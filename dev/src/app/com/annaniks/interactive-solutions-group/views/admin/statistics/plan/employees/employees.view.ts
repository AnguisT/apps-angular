import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { ProjectsService } from '../../../projects/projects.service';
import { forkJoin, Subscription, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DxDataGridComponent } from 'devextreme-angular';
import { formatDate } from '@angular/common';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.view.html',
  styleUrls: ['./employees.view.scss']
})
export class EmployeesView implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  loading = true;
  employees = [];
  departments = [];
  projects = [];
  plan;

  selectedMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  private months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Мая',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октярь',
    'Ноябрь',
    'Декабрь'
  ];

  private _subscription: Subscription = new Subscription();
  private $destroy: Subject<void> = new Subject<void>();

  constructor(
    private _configurationService: ConfigurationService,
    private _projectsService: ProjectsService,
    private data: MsgService
  ) { }

  ngOnInit() {
    const combined = forkJoin(
      this._getAllDepartments(),
      this._getAllEmployees(),
      this._getOnePlanByDate(),
      this._getAllProject(),
    );
    let month: any = this.selectedMonth + 1;
    if (month < 10) {
      month = `0${this.selectedMonth + 1}`;
    }
    this._subscription = combined.subscribe(() => {
      this.filterDepartment(`${month}-${this.currentYear}`);
      this.filterPlans();
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
  }

  ngAfterViewInit(): void {
    this._exportTable();
  }

  private _exportTable() {
    this.data.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this.dataGrid.instance.exportToExcel(false);
    });
  }

  customizeExportData(columns, rows) {
    rows.forEach(data => {
      const individualPlanNow = data.data.Plan.ProfitAll;
      const res = (individualPlanNow / data.data.IndividualPlan) * 100;
      if (res > 100) {
        data.values[4] = `${res.toFixed(2)}%`;
      } else if (res === 100) {
        data.values[4] = `${res.toFixed(0)}%`;
      } else if (res < 100) {
        data.values[4] = `${(100 - res).toFixed(2)}%`;
      }
      const amountPlan = data.data.IndividualPlan - data.data.Plan.ProfitAll;
      if (amountPlan < 0) {
        data.values[5] = `${amountPlan.toFixed(0).toString().slice(1)}`;
      } else {
        data.values[5] = `${amountPlan.toFixed(0)}`;
      }
    });
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxButton',
      options: {
        text: 'Сброс',
        onClick: this.clearAllFilters.bind(this)
      }
    });
  }

  clearAllFilters() {
    this.dataGrid.instance.clearFilter();
    this.dataGrid.instance.clearSorting();
    this.dataGrid.instance.clearGrouping();
  }

  incrementMonth() {
    this.selectedMonth = this.selectedMonth + 1;
    if (this.selectedMonth > 11) {
      this.currentYear = this.currentYear + 1;
      this.selectedMonth = 0;
    }
    let month: any = this.selectedMonth + 1;
    if (month < 10) {
      month = `0${this.selectedMonth + 1}`;
    }
    this._getPlanByDate(`${month}-${this.currentYear}`);
  }

  decrementMonth() {
    this.selectedMonth = this.selectedMonth - 1;
    if (this.selectedMonth < 0) {
      this.currentYear = this.currentYear - 1;
      this.selectedMonth = 11;
    }
    let month: any = this.selectedMonth + 1;
    if (month < 10) {
      month = `0${this.selectedMonth + 1}`;
    }
    this._getPlanByDate(`${month}-${this.currentYear}`);
  }

  filterDepartment(date) {
    this.employees.forEach((employee) => {
      const department = this.departments.find((depart) => depart.Id === employee.DepartmentId);
      employee.Department = department.Name;
      let countProject = 0;
      let countProjectSuccess = 0;
      employee.profitAll = 0;
      this.projects.forEach((project) => {
        const res = project.ManagerProjectId === employee.Id && project;
        if (res) {
          if (res.Projectdate) {
            const projectdate = formatDate(res.Projectdate.split(',')[0], 'MM-yyyy', 'en');
            if (projectdate === date) {
              countProject++;
              if (res.StatusId === 53 || res.StatusId === 54) {
                countProjectSuccess++;
                employee.profitAll += project.profitFact ? project.profitFact : 0;
              }
            }
          }
        }
      });
      employee.countProject = countProject;
      employee.countProjectSuccess = countProjectSuccess;
    });
    this.employees = this.employees.filter((employee) => employee.countProject > 0);
  }

  filterPlans() {
    if (this.plan) {
      this.employees.forEach((employee) => {
        employee.Plan = {
          ProfitAll: employee.profitAll - (employee.profitAll * 0.08),
          Plan: employee.DepartmentId === 1 ? this.plan.DigitalPlan : this.plan.EventPlan,
          PlanNow: employee.DepartmentId === 1 ? this.plan.DigitalPlanNow : this.plan.EventPlanNow,
          DepartmentId: employee.DepartmentId,
        };
        const performance = employee.IndividualPlan - employee.Plan.ProfitAll;
        employee.Performance = performance > 0 ? 'Нет' : 'Да';
      });
    }
  }

  generatePercentSucess(cell) {
    const individualPlanNow = cell.data.Plan.ProfitAll;

    const res = (individualPlanNow / cell.data.IndividualPlan) * 100;
    if (res > 100) {
      return `${res.toFixed(2)}%`;
    } else if (res === 100) {
      return `${res.toFixed(0)}%`;
    }
  }

  generatePercentDanger(cell) {
    const individualPlanNow = cell.data.Plan.ProfitAll;
    const res = (individualPlanNow / cell.data.IndividualPlan) * 100;
    if (res < 100) {
      return `${(100 - res).toFixed(2)}%`;
    }
  }

  generateAmountSucess(cell) {
    const amountPlan = cell.data.IndividualPlan - cell.data.Plan.ProfitAll;
    if (amountPlan < 0) {
      return `${amountPlan.toFixed(0).toString().slice(1)}`;
    } else if (amountPlan === 0) {
      return `${amountPlan.toFixed(0)}`;
    }
  }

  generateAmountDanger(cell) {
    const amountPlan = cell.data.IndividualPlan - cell.data.Plan.ProfitAll;
    if (amountPlan > 0) {
      return `${amountPlan.toFixed(0)}`;
    }
  }

  private _getAllEmployees() {
    return this._configurationService.getAllEmployee().pipe(
      map((data) => {
        this.employees = data['message'];
        return data['message'];
      })
    );
  }

  private _getAllDepartments() {
    return this._projectsService.getAllEmployeeDepartments().pipe(
      map((data) => {
        this.departments = data['message'];
        return data['message'];
      })
    );
  }

  private _getAllProject() {
    return this._projectsService.getProject().pipe(
      map((data) => {
        this.projects = data['message'];
        return data['message'];
      })
    );
  }

  _getPlanByDate(date) {
    console.log(date);
    this._configurationService.getAllEmployee().subscribe((dataEmployee) => {
      this.employees = dataEmployee['message'];
      this._configurationService.getOnePlanByDate({ date: date }).subscribe((data) => {
        this.plan = data['message'][0];
        this.filterDepartment(date);
        this.filterPlans();
      });
    });
  }

  private _getOnePlanByDate() {
    let currentMonth: any = this.selectedMonth + 1;
    if (currentMonth < 10) {
      currentMonth = `0${this.selectedMonth + 1}`;
    }
    const currentYear = this.currentYear;
    return this._configurationService.getOnePlanByDate({ date: `${currentMonth}-${currentYear}` }).pipe(
      map((data) => {
        this.plan = data['message'][0];
        return data['message'];
      })
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this.$destroy.next();
    this.$destroy.complete();
  }
}
