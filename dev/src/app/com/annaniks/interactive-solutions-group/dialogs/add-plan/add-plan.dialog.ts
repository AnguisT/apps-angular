import { Component, Inject, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationService } from '../../views/admin/configurations/configuration.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProjectsService } from '../../views/admin/projects/projects.service';

@Component({
  selector: 'add-plan-dialog',
  templateUrl: 'add-plan.dialog.html',
  styleUrls: ['add-plan.dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddPlanDialog implements OnInit {
  public form: FormGroup;
  public object;
  public digitalProcess = '';
  public companyProcess = '';
  public eventProcess = '';
  ru = {
    monthNames: ['Январь', 'Ферваль', 'Март', 'Апрель', 'Мая', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Март', 'Апр', 'Мая', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  };
  public disabled1Month = false;
  public disabled2Month = false;
  public disabled3Month = false;
  public disabled4Month = false;
  public disabled5Month = false;
  public disabled6Month = false;
  public disabled7Month = false;
  public disabled8Month = false;
  public disabled9Month = false;
  public disabled10Month = false;
  public disabled11Month = false;
  public disabled12Month = false;
  allProjects;
  projectsByDate = [];
  employeesList;
  digitalProfit = 0;
  eventProfit = 0;

  private destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<AddPlanDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _configurationService: ConfigurationService,
    private _fb: FormBuilder,
    private _projectsService: ProjectsService) {
  }

  ngOnInit(): void {
    this.initForm();
    this._getAllEmployees();
    this.isDisabledMonth(this.data.dates, new Date(Date.now()).getFullYear());
    if (this.data.data) {
      this._getOnePlan(this.data.data.id);
    }
  }

  initForm() {
    this.form = this._fb.group({
      digitalPlan: null,
      digitalCurrentProcess: null,
      companyPlan: null,
      companyCurrentProcess: null,
      eventPlan: null,
      eventCurrentProcess: null,
      selectedDate: null
    });
  }

  validDate(date, format, locale) {
    return formatDate(date, format, locale);
  }

  changePlan() {
    const digitalPlan = this.form.get('digitalPlan').value ? this.form.get('digitalPlan').value : 0;
    const eventPlan = this.form.get('eventPlan').value ? this.form.get('eventPlan').value : 0;
    const companyPlan = digitalPlan + eventPlan;
    this.form.patchValue({ companyPlan: companyPlan });
  }

  changePlanNow() {
    const digitalPlanNow = this.form.get('digitalCurrentProcess').value ? this.form.get('digitalCurrentProcess').value : 0;
    const eventPlanNow = this.form.get('eventCurrentProcess').value ? this.form.get('eventCurrentProcess').value : 0;
    const companyPlanNow = digitalPlanNow + eventPlanNow;
    this.form.patchValue({ companyCurrentProcess: companyPlanNow });
  }

  savePlan() {
    const data = {
      DatePlan: formatDate(this.form.get('selectedDate').value, 'yyyy.MM.dd', 'en'),
      DigitalPlan: this.form.get('digitalPlan').value,
      DigitalPlanNow: this.form.get('digitalCurrentProcess').value || 0,
      CompanyPlan: this.form.get('companyPlan').value,
      CompanyPlanNow: this.form.get('companyCurrentProcess').value || 0,
      EventPlan: this.form.get('eventPlan').value,
      EventPlanNow: this.form.get('eventCurrentProcess').value || 0,
    };
    if (this.data.data) {
      this._updatePlan(this.data.data.id, data);
    } else {
      this._savePlan(data);
    }
  }

  isDisabledMonth(dates, currentYear) {
    dates.map((date) => {
      const year = new Date(date).getFullYear();
      const month = new Date(date).getMonth() + 1;
      if (currentYear === year) {
        switch (month) {
          case 1:
            this.disabled1Month = true;
            break;
          case 2:
            this.disabled2Month = true;
            break;
          case 3:
            this.disabled3Month = true;
            break;
          case 4:
            this.disabled4Month = true;
            break;
          case 5:
            this.disabled5Month = true;
            break;
          case 6:
            this.disabled6Month = true;
            break;
          case 7:
            this.disabled7Month = true;
            break;
          case 8:
            this.disabled8Month = true;
            break;
          case 9:
            this.disabled9Month = true;
            break;
          case 10:
            this.disabled10Month = true;
            break;
          case 11:
            this.disabled11Month = true;
            break;
          case 12:
            this.disabled12Month = true;
            break;
          default:
            break;
        }
      }
    });
  }

  changeYear(event) {
    this.disabled1Month = false;
    this.disabled2Month = false;
    this.disabled3Month = false;
    this.disabled4Month = false;
    this.disabled5Month = false;
    this.disabled6Month = false;
    this.disabled7Month = false;
    this.disabled8Month = false;
    this.disabled9Month = false;
    this.disabled10Month = false;
    this.disabled11Month = false;
    this.disabled12Month = false;
    this.isDisabledMonth(this.data.dates, event.year);
  }

  onCancel(data): void {
    this.dialogRef.close(data);
  }

  filterEmployee() {
    let digital = 0;
    let event = 0;
    this.employeesList.forEach((res) => {
      console.log(res);
      if (res.isActive) {
        if (res.DepartmentId === 1) {
          digital += res.IndividualPlan;
        } else if (res.DepartmentId === 2) {
          event += res.IndividualPlan;
        }
      }
    });
    this.form.get('digitalPlan').setValue(digital);
    this.form.get('eventPlan').setValue(event);
    this.form.get('companyPlan').setValue(digital + event);
  }

  private _getOnePlan(id) {
    return this._configurationService.getOnePlan(id).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.form.patchValue({
        digitalPlan: data['message'][0]['DigitalPlan'],
        digitalCurrentProcess: data['message'][0]['DigitalPlanNow'],
        companyPlan: data['message'][0]['CompanyPlan'],
        companyCurrentProcess: data['message'][0]['CompanyPlanNow'],
        eventPlan: data['message'][0]['EventPlan'],
        eventCurrentProcess: data['message'][0]['EventPlanNow'],
        selectedDate: new Date(data['message'][0]['DatePlan']),
      });
    });
  }

  private _savePlan(plan) {
    return this._configurationService.savePlan(plan).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data['message'] === 'Save success') {
        this.onCancel(true);
      }
    });
  }

  private _deletePlan() {
    return this._configurationService.deleteOnePlan(this.data.data.id).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data['message'] === 'Deleted success') {
        this.onCancel(true);
      }
    });
  }

  private _updatePlan(id, plan) {
    plan.Id = id;
    return this._configurationService.updatePlan(plan).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data['message'] === 'Changed success') {
        this.onCancel(true);
      }
    });
  }

  private _getAllEmployees() {
    return this._projectsService.getAllEmployee().subscribe((data) => {
      this.employeesList = data['message'];
      this.filterEmployee();
      return data['message'];
    });
  }
}
