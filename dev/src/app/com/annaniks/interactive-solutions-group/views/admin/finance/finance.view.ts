import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import {Router} from '@angular/router';
import {takeUntil, map} from 'rxjs/operators';
import {MsgService} from '../../../services/sharedata';
import {Subject, forkJoin} from 'rxjs';
import {ExportService} from '../../../services/export.service';
import {FinanceService} from './finance.service';
import {MatDialog} from '@angular/material';
import {AddFinanceDialogComponent} from '../../../dialogs/add-finance/add-finance.dialog';
import {ConfigurationService} from '../configurations/configuration.service';
import {ContactsService} from '../contacts/contacts.service';
import {CookieService} from 'angular2-cookie';
import {ProjectsService} from '../projects/projects.service';

@Component({
  selector: 'app-finance',
  templateUrl: 'finance.view.html',
  styleUrls: ['finance.view.scss'],
})
export class FinanceViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  public loading = true;
  public dataSource = [];
  public finance_status = [];
  public projects = [];
  public employies = [];
  public finances = [];
  public projectEmployee = [];
  public months = [
    '01_Январь',
    '02_Февраль',
    '03_Март',
    '04_Апрель',
    '05_Май',
    '06_Июнь',
    '07_Июль',
    '08_Август',
    '09_Сентябрь',
    '10_Октябрь',
    '11_Ноябрь',
    '12_Декабрь',
  ];
  public generalPosition = [16, 17, 22, 14];
  public positionId;
  public Id;
  public isShowAll = false;

  private $destroy: Subject<void> = new Subject<void>();

  constructor(
    private _router: Router,
    private _financeService: FinanceService,
    private _configurationService: ConfigurationService,
    private _contactService: ContactsService,
    private data: MsgService,
    public _exportService: ExportService,
    private _matDialog: MatDialog,
    private _cookieService: CookieService,
    public _projectService: ProjectsService,
  ) {
    this.positionId = Number(this._cookieService.get('PositionID'));
    this.Id = Number(this._cookieService.get('Id'));
  }

  ngOnInit() {
    const combined = forkJoin(
      this._getAllFinanceStatus(),
      this._getAllProjects(),
      this._getAllEmployee(),
      this._getProjectAllEmployee(),
      this._getRightAccess(),
    );

    combined.subscribe(() => this.getAllFinance());
  }

  ngAfterViewInit(): void {
    this._exportTable();
    this._exportAllTable();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  private _exportTable() {
    this.data.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this.dataGrid.instance.exportToExcel(false);
    });
  }

  private _exportAllTable() {
    this.data.exportAllTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this._financeService.getAllExport().subscribe((data) => {
        this._exportService.exportExcel(data, 'Финансы');
      });
    });
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxButton',
      options: {
        text: 'Сброс',
        onClick: this.clearAllFilters.bind(this),
      },
    });
  }

  clearAllFilters() {
    this.dataGrid.instance.clearFilter();
    this.dataGrid.instance.clearSorting();
    this.dataGrid.instance.clearGrouping();
  }

  addFinance(data?) {
    const dialog = this._matDialog.open(AddFinanceDialogComponent, {
      disableClose: true,
      width: '800px',
      data: data ? data.data : null,
    });
    dialog.beforeClosed().subscribe((value) => {
      if (value) {
        this.loading = true;
        this.getAllFinance();
      }
    });
  }

  private getAllFinance() {
    this._financeService.getAllFinance().subscribe((data) => {
      this.finances = data['message'];
      const array = [];
      this.finances.forEach((finance) => {
        if (finance.DateApp) {
          const dateProject = new Date(finance.DateApp);
          finance['Month'] = this.months[dateProject.getMonth()];
          finance['Year'] = dateProject.getFullYear();
        }
        finance.Status = this.finance_status.find(
          (status) => status.Id === finance.StatusId,
        ).Name;
        finance.NumberProject = this.projects.find(
          (project) => project.Id === finance.ProjectId,
        ).Number;
        finance.NameProject = this.projects.find(
          (project) => project.Id === finance.ProjectId,
        ).Name;
        finance.Employee = this.employies.find(
          (employee) => employee.Id === finance.ManagerId,
        ).FulName;
        if (this.generalPosition.includes(this.positionId) || this.isShowAll) {
          array.push(finance);
        } else {
          const findProject = this.projects.find(
            (project) => project.Id === finance.ProjectId,
          );
          if (findProject) {
            const projectEmployee = this.projectEmployee
              .filter((empl) => empl.ProjectId === findProject.Id)
              .map((empl) => empl.EmployeeId);
            if (projectEmployee.includes(this.Id)) {
              array.push(finance);
            } else if (finance.ManagerId === this.Id) {
              array.push(finance);
            }
          }
        }
      });
      this.dataSource = array;
      this.loading = false;
    });
  }

  private _getProjectAllEmployee() {
    return this._projectService.getProjectAllEmployee().pipe(
      map((data) => {
        this.projectEmployee = data['message'];
      }),
    );
  }

  private _getAllFinanceStatus() {
    return this._configurationService.getAllFinanceStatus().pipe(
      map((data) => {
        this.finance_status = data['message'];
      }),
    );
  }

  private _getAllProjects() {
    return this._configurationService.getAllProjects().pipe(
      map((data) => {
        this.projects = data['message'];
      }),
    );
  }

  private _getAllEmployee() {
    return this._configurationService.getAllEmployee().pipe(
      map((data) => {
        this.employies = data['message'];
      }),
    );
  }

  private _getRightAccess() {
    return this._configurationService.getRightsAccess(this.Id).pipe(
      map((res) => {
        if (res['message'][0].Rights) {
          this.isShowAll = res['message'][0].Rights.isFinanceVisible;
        } else {
          this.isShowAll = false;
        }
      }),
    );
  }
}
