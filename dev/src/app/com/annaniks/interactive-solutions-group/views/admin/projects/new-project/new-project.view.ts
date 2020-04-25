import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {ProjectsService} from '../projects.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import {delay, finalize, findIndex, map, takeUntil} from 'rxjs/operators';
import {ServerResponse} from '../../../../types/types';
import {forkJoin, Subscription, Observable, of, Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {
  AddmanagerDialog,
  AddEmployeeDialog,
  AddSubcontravtorDialog,
  ConfirmDialog,
  AddCompanyDialog,
} from '../../../../dialogs';
import {DatePipe, formatDate} from '@angular/common';
import {AddFileDialog} from '../../../../dialogs/add-file/add-file.dialog';
import {AddTaskDialog} from '../../../../dialogs/add-task/add-task.dialog';
import {IColumn, ITask} from '../../task/task.models';
import {TaskService} from '../../task/task.service';
import {CookieService} from 'angular2-cookie';
import {ConfigurationService} from '../../configurations/configuration.service';
import {ContactsService} from '../../contacts/contacts.service';
import {ComponentCanDeactivate} from '../../../../services/project.deactivate';
import {AddLegalEntityView} from '../../../../dialogs/add-legal-entity/add-legal-entity.view';
import {AddNewManagerDialogComponent} from '../../../../dialogs/add-new-manager/add-new-manger.dialog';
import {EstimateComponent} from './comps/estimate/estimate.component';
import {MessageService} from 'primeng/api';
import {difference, omitBy} from 'lodash';
import moment from 'moment';

@Component({
  selector: 'new-project',
  templateUrl: 'new-project.view.html',
  styleUrls: ['new-project.view.scss'],
  providers: [ConfigurationService],
})
export class NewProjectView
  implements OnInit, OnDestroy, ComponentCanDeactivate {
  @ViewChild(EstimateComponent) estimate: EstimateComponent;
  public isHidden = true;
  public files: IFile[] = [];
  public tasks: ITask[] = [];
  public boards: IColumn[] = [];
  private _projectInfo: object;
  private _projectId: number;
  private _subscription: Subscription = new Subscription();
  public editable = false;
  public isDataAvailable = false;
  public projectForm: FormGroup;
  public mainProjects: Array<object> = [];
  public projectsStatuses: Array<object> = [];
  public companies: Array<object> = [];
  public companiesSub: Array<object> = [];
  public projectsFormats: Array<object> = [];
  public projectsTypes: Array<object> = [];
  public departments: Array<object> = [];
  public salesTypes: Array<object> = [];
  public projectTasks: Array<object> = [];
  public submited = false;
  public cyclicites: Array<object> = [];
  public countries: Array<object> = [];
  public cities: Array<object> = [];
  public zones: Array<object> = [];
  public indOut: Array<object> = [];
  public paymentMethods: Array<object> = [];
  public legalPersonsISG: Array<object> = [];

  public ifBudgets: Array<object> = [];
  public komisioners: Array<object> = [];
  public typeComisions: Array<object> = [];
  public zoneReacts: Array<object> = [];
  public ifContractors: Array<object> = [];

  public formMethods: Array<object> = [];
  public harProdjects: Array<object> = [];
  public datePartys: Array<object> = [];
  public levelCompanys: Array<object> = [];
  public motivPartys: Array<object> = [];
  public vovlechPartys: Array<object> = [];
  public activPartys: Array<object> = [];
  public opensPartys: Array<object> = [];
  public nacionPartys: Array<object> = [];
  public langPartys: Array<object> = [];
  public taskProjects: Array<object> = [];
  public bizKontents: Array<object> = [];
  public scenariyPartys: Array<object> = [];
  public lifeExpes: Array<object> = [];
  public typeContracts: Array<object> = [];

  public customerManagers: Array<object> = [];
  public clientManagers: Array<object> = [];
  public employees: Array<object> = [];
  public saleEmployees: Array<object> = [];
  public managers: Array<object> = [];
  public subcontractors: Array<object> = [];
  public subcontractorsList: Array<object> = [];
  public employeesList: Array<object> = [];
  public error = '';
  public validationError = '';
  public loading = true;
  public switchValue = 1;
  public sectionSelect = 1;
  public fiedsFunctionality = [];
  public defaultDate = new Date();
  public recomendName: Array<object> = [];
  public recomendNameISG: Array<object> = [];
  public disabledTime = true;
  public clientLegalPerson = [];
  public customerLegalPerson = [];
  public subLegalPerson = [];
  public clientManager = [];
  public customerManager = [];
  public subManager = [];
  public citiesByCountry = [];
  public typeOP = [
    {
      Id: 1,
      Name: 'ОП менеджер ISG',
    },
  ];
  public typeOPSaleForm = [
    {
      Id: 2,
      Name: 'ОП менеджер',
    },
  ];
  public typeClosingDocuments = [
    {
      Id: 1,
      Name: 'Да',
    },
    {
      Id: 2,
      Name: 'Нет',
    },
  ];
  public typeDatePartys = [
    {
      Id: 1,
      Name: 'Дата',
    },
    {
      Id: 2,
      Name: 'Месяц',
    },
    {
      Id: 3,
      Name: 'Не определено',
    },
  ];
  public rolesISG = [];
  public rolesManagers = [];
  public estimateData;
  public employeesPost = [];
  public isCompanyCreate;
  public isDepartmentCreate;
  public isManagerCreate;
  public isProject;
  public Id;
  public positionId;
  public showTask = false;

  private _destroy$ = new Subject();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _projectService: ProjectsService,
    private _taskService: TaskService,
    private _fb: FormBuilder,
    private _matDialog: MatDialog,
    private _router: Router,
    private _datePipe: DatePipe,
    private _cookieService: CookieService,
    private _configurationService: ConfigurationService,
    private _contactsService: ContactsService,
    private messageService: MessageService,
  ) {
    this.Id = this._cookieService.get('Id');
    this.positionId = this._cookieService.get('PositionID');
  }

  async canDeactivate() {
    if (this.projectForm.dirty) {
      return confirm('Вы хотите покинуть страницу?');
    } else {
      return true;
    }
  }

  ngOnInit() {
    this.loading = true;
    this._formBuilder();
    this._combineObservables();
  }

  changeSwitchValue(value) {
    this.switchValue = value;
  }

  saveEstimateDate(event) {
    this.estimateData = event;
  }

  changeSection(value) {
    this.sectionSelect = value;
  }

  public simpleClickFunction(): void {
    this.isHidden = !this.isHidden;
  }

  addFile() {
    if (!this.isProject) {
      return;
    }
    const dialogRef = this._matDialog.open(AddFileDialog, {
      disableClose: true,
      width: '500px',
    });

    dialogRef.beforeClose().subscribe((res) => {
      if (res) {
        this.files.push(res);
        this._saveFile(res);
      }
    });
  }

  deleteFile(file) {
    this._projectService.deleteFile(file.id).subscribe((data) => {
      this._getFiles();
    });
  }

  isShowTask() {
    this._projectService.getProjectAllEmployee().subscribe((employees) => {
      const positionId = [8, 9, 10, 11, 13, 15];
      const employeesFilter = employees['message']
        .filter((empl) => empl.ProjectId === this._projectInfo['Id'])
        .map((empl) => empl.EmployeeId);

      if (
        this._projectInfo['ManagerProjectId'] === Number(this.Id) ||
        this._projectInfo['SaleManagerId'] === Number(this.Id)
      ) {
        this.showTask = true;
      } else if (!positionId.includes(Number(this.positionId))) {
        this.showTask = true;
      } else if (employeesFilter.includes(Number(this.Id))) {
        this.showTask = true;
      } else {
        this.showTask = false;
      }
    });
  }

  openTaskModal(task?: ITask) {
    if (!this.isProject) {
      return;
    }
    const dialogRef = this._matDialog.open(AddTaskDialog, {
      disableClose: true,
      width: '700px',
      data: task
        ? {task, project: this._projectInfo}
        : {project: this._projectInfo},
    });

    dialogRef.beforeClose().subscribe((res: any) => {
      if (res && res.id) {
        if (task) {
          this._updateTask(res);
        } else {
          this.boards[0].tasks.push(res);
          this._saveBoards();
          this._filterTasks();
        }
      }
      if (res && res.doneId) {
        const ids = this._getTaskIndex(res.doneId);
        const getTask = this.boards[ids.column].tasks.splice(ids.task, 1);

        const findColumn = this.boards.find((item) => item.id === 16);

        if (findColumn) {
          findColumn.tasks.push(...getTask);
        }
        this._filterTasks();
        this._saveBoards();
      }

      if (res && res.deleteId) {
        const ids = this._getTaskIndex(res.deleteId);
        this.boards[ids.column].tasks.splice(ids.task, 1);

        this._filterTasks();
        this._saveBoards();
      }
    });
  }

  private _updateTask(task: ITask) {
    const ids = this._getTaskIndex(task.id);

    this.boards[ids.column].tasks[ids.task] = task;
    this._filterTasks();
    this._saveBoards();
  }

  private _getTaskIndex(taskId) {
    const ids = {column: 0, task: 0};
    this.boards.forEach((column, index) => {
      const findTask = column.tasks.findIndex((item) => item.id === taskId);

      if (findTask !== -1) {
        ids.column = index;
        ids.task = findTask;
      }
    });
    return ids;
  }

  private _saveBoards() {
    const data = {
      ProjectId: this._projectId,
      Boards: this.boards,
    };

    this._taskService
      .saveBoard(data)
      .pipe(takeUntil(this._destroy$))
      .subscribe(console.log);
  }

  private _saveFile(res: IFile) {
    const file = {
      ProjectId: this._projectId,
      file: res,
    };
    return this._projectService
      .saveFile(file)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._getFiles();
      });
  }

  private _formBuilder(): void {
    this.projectForm = this._fb.group({
      projectName: [null, true && Validators.required],

      formagesKl: [null],
      fgenderMan: [null],
      fgenderWoman: [null],
      fBudgetPredlog: [null],
      fprofitWont: [null],
      fBudgetFact: [null],
      fprofitFact: [null],
      fprofit: [null],
      fprofileKl: [null],
      fbackgroundKl: [null],
      finsider: [null],
      fefficiencyKl: [null],

      mainProject: [null],
      projectStatus: [null, Validators.required],
      customer: [null],
      customerFilial: [null],
      customerDepartment: [null],
      client: [null],
      clientFilial: [null],
      clientDepartment: [null],
      mainCustomerManager: [null],
      mainClientManager: [null],
      participantCount: [null],
      participantCountF: [null],
      setProjectFormat: [[]],
      projectFormat: [[]],
      projectType: [null],
      department: [null, Validators.required],
      recomendationName: [null],
      recomendationNameISG: [null],
      salesType: [null],
      projectTask: [null],
      cyclicity: [null],
      requestDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      projectDate: [[new Date()]],
      projectDuration: [null],
      submissionDate: [null],
      country: [],
      city: [[]],
      zone: [[]],
      indOut: [[]],
      clientBudget: [null],
      expenseBudget: [null],
      sale: [null],
      pm: [null],
      paymentMethod: [null],

      ifBudget: [null],
      komisioner: [null],
      typeComision: [null],

      formMethod: [null],
      harProdject: [null],
      dateParty: [null],
      levelCompany: [[]],
      motivParty: [null],
      vovlechParty: [null],
      activParty: [null],
      opensParty: [null],
      nacionParty: [[{Id: 1, Name: 'Русские'}]],
      langParty: [[{Id: 1, Name: 'Русский'}]],
      taskProject: [[]],
      taskProjectComment: [null],
      bizKontent: [null],
      scenariyParty: [null],
      lifeExpe: [null],
      typeContract: [null],
      number: [null, Validators.required],

      vipParty: [null],
      commentParty: [null],
      commentStatus: [null],
      payDate: [[new Date()]],
      typeDateParty: [null],
      singleParty: null,
      multiDatePartyPause: null,
      seriesDateParty: null,
      multiDateParty: null,
      mainCustomerLegalPerson: [null],
      mainClientLegalPerson: [null],
      legalPersonISG: [null],
      commentFormatProject: [null],
      commentSetFormatProject: [null],
      commentCyclicity: [null],
      commentZones: [null],
      commentIndOut: [null],
      commentLevelCompany: [null],
      commentBizKontent: [null],
      commentScenariyParty: [null],
      commentLifeExpe: [null],
      commentRecomendManager: [null],
      op: new FormArray([]),
      opSale: new FormArray([]),
      opCustomer: new FormArray([]),
      opClient: new FormArray([]),
      commissionNumber: [null],
      commentCommission: [null],
      customerClosingDocuments: [null],
      clientClosingDocuments: [null],
      arrayBudgetPredlogs: new FormArray([]),
      arrayTimetables: new FormArray([]),
      departmentInvolved: [null],
      subcontractors: new FormArray([]),
    });
    this.projectForm.get('country').valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }
      this.citiesByCountry = this.cities.filter(
        (city) => city['CountryId'] === value.Id,
      );
      this.citiesByCountry.push(this.cities.find((city) => city['Id'] === 17));
      if (this._projectInfo) {
        this.projectForm
          .get('city')
          .setValue(
            this.findObject(this.cities, 'Id', this._projectInfo['CityId']),
          );
      } else {
        if (this.citiesByCountry.find((city) => city.isCapital === 1)) {
          this.projectForm
            .get('city')
            .setValue([
              this.citiesByCountry.find((city) => city.isCapital === 1),
            ]);
        } else {
          this.projectForm.get('city').setValue([]);
        }
      }
    });
    this.projectForm.get('customer').valueChanges.subscribe((value) => {
      this._setCompanyFilials(value, 'Customer').subscribe();
      this._setCompanyManagers(value, 'Customer');
    });
    this.projectForm.get('customerFilial').valueChanges.subscribe((value) => {
      this._setCompanyDepartments(value, 'Customer');
    });
    this.projectForm.get('client').valueChanges.subscribe((value) => {
      this._setCompanyFilials(value, 'Client').subscribe();
      this._setCompanyManagers(value, 'Client');
    });
    this.projectForm.get('clientFilial').valueChanges.subscribe((value) => {
      this._setCompanyDepartments(value, 'Client');
    });
    this.projectForm.get('projectDate').setValue([new Date()]);
    this.projectForm.get('singleParty').valueChanges.subscribe((data) => {
      if (!data) {
        return;
      }
      if (this.projectForm.get('typeDateParty').value.Id === 2) {
        this.projectForm.patchValue({
          projectDate: this.projectForm.get('singleParty').value,
        });
        return;
      }
      if (data.length) {
        this.projectForm.patchValue({
          projectDate: this.projectForm.get('singleParty').value,
        });
      } else {
        this.projectForm.patchValue({
          projectDate: new Date(),
        });
      }
      this.addTimetable([this.projectForm.get('singleParty').value]);
    });
    this.projectForm.get('multiDateParty').valueChanges.subscribe((data) => {
      if (!data) {
        return;
      }
      if (this.projectForm.get('typeDateParty').value.Id === 2) {
        this.projectForm.patchValue({
          projectDate: this.projectForm.get('singleParty').value,
        });
        return;
      }
      if (data.length) {
        this.projectForm.patchValue({
          projectDate: this.projectForm.get('multiDateParty').value,
        });
      } else {
        this.projectForm.patchValue({
          projectDate: new Date(),
        });
      }
      this.addTimetable(this.projectForm.get('multiDateParty').value);
    });
    this.projectForm
      .get('multiDatePartyPause')
      .valueChanges.subscribe((data) => {
        if (!data) {
          return;
        }
        if (this.projectForm.get('typeDateParty').value.Id === 2) {
          this.projectForm.patchValue({
            projectDate: this.projectForm.get('singleParty').value,
          });
          return;
        }
        if (data.length) {
          this.projectForm.patchValue({
            projectDate: this.projectForm.get('multiDatePartyPause').value,
          });
        } else {
          this.projectForm.patchValue({
            projectDate: new Date(),
          });
        }
        this.addTimetable(this.projectForm.get('multiDatePartyPause').value);
      });
    this.projectForm.get('seriesDateParty').valueChanges.subscribe((data) => {
      if (!data) {
        return;
      }
      if (this.projectForm.get('typeDateParty').value.Id === 2) {
        this.projectForm.patchValue({
          projectDate: this.projectForm.get('singleParty').value,
        });
        return;
      }
      if (data.length) {
        this.projectForm.patchValue({
          projectDate: this.projectForm.get('seriesDateParty').value,
        });
      } else {
        this.projectForm.patchValue({
          projectDate: new Date(),
        });
      }
      this.addTimetable(this.projectForm.get('seriesDateParty').value);
    });
    this.projectForm.get('requestDate').valueChanges.subscribe((data) => {
      if (data) {
        if (
          new Date(data) >
          new Date(this.projectForm.get('submissionDate').value)
        ) {
          this.projectForm.get('submissionDate').setValue(data);
        }
      } else {
        this.projectForm.get('submissionDate').setValue(null);
      }
    });

    let flag = 0;
    this.projectForm.get('zone').valueChanges.subscribe((data) => {
      if (this._projectId) {
        if (flag > 1) {
          this.projectForm.get('commentZones').setValue('');
        }
        flag = flag + 1;
      } else {
        this.projectForm.get('commentZones').setValue('');
      }
    });
  }

  selectTypeDateParty(event, field) {
    this.projectForm.get(field).setValue(null);
    this.resetTimetable();
  }

  onChangeStatus(event) {
    if (event.value) {
      this._getRight(this._cookieService.get('PositionID'), event.value['Id']);
    } else {
      const res = this.projectsStatuses.find(
        (status) => status['Name'] === 'Новый запрос',
      );
      this.projectForm.patchValue({projectStatus: res});
    }
  }

  checkIsVisible(field) {
    if (this.fiedsFunctionality.length) {
      const find = this.fiedsFunctionality.find((item) => item.key === field);
      if (find) {
        return find.isVisible;
      }
      return false;
    }
  }

  setValidators() {
    if (this.fiedsFunctionality.length) {
      this.fiedsFunctionality.forEach((item) => {
        if (item.key !== 'projectName' || item.key !== 'number') {
          if (item.key === 'fgender') {
            if (item.isRequired) {
              this.projectForm.controls['fgenderMan'].setValidators(
                Validators.required,
              );
              this.projectForm.controls['fgenderWoman'].setValidators(
                Validators.required,
              );
              this.projectForm.controls['fgenderMan'].updateValueAndValidity();
              this.projectForm.controls[
                'fgenderWoman'
              ].updateValueAndValidity();
            } else {
              this.projectForm.controls['fgenderMan'].clearValidators();
              this.projectForm.controls['fgenderWoman'].clearValidators();
              this.projectForm.controls['fgenderMan'].updateValueAndValidity();
              this.projectForm.controls[
                'fgenderWoman'
              ].updateValueAndValidity();
            }
          } else if (item.key === 'companySubLegalPerson') {
          } else if (item.isRequired) {
            if (this.projectForm.controls[item.key]) {
              this.projectForm.controls[item.key].setValidators(
                Validators.required,
              );
              this.projectForm.controls[item.key].updateValueAndValidity();
            }
          } else {
            if (this.projectForm.controls[item.key]) {
              this.projectForm.controls[item.key].clearValidators();
              this.projectForm.controls[item.key].updateValueAndValidity();
            }
          }
        }
      });
    }
  }

  checkIsRequired(field) {
    if (this.fiedsFunctionality.length) {
      const find = this.fiedsFunctionality.find((item) => item.key === field);
      if (find) {
        return find.isRequired;
      }
      return false;
    }
  }

  checkIsEditable(field) {
    if (this.fiedsFunctionality.length) {
      const find = this.fiedsFunctionality.find((item) => item.key === field);
      if (find) {
        return find.isEditable;
      }
      return false;
    }
  }

  // selectDate(value) {
  //     this.projectForm.get('singleParty').setValue([value]);
  // }

  private _setCompanyFilials(value, type): Observable<void> {
    if (value && value.Id) {
      return this._projectService.getFilialById(value.Id).pipe(
        map((data: ServerResponse) => {
          let index = this.companies.indexOf(value);
          if (index > -1) {
            this.companies[index][type.toLocaleLowerCase() + 'filials'] =
              data.message;
            if (this.editable && this.projectForm.get('customer').value) {
              const patchObject = {};
              patchObject[
                type.toLocaleLowerCase() + 'Filial'
              ] = this.findObject(
                this.projectForm.get('customer').value[
                  type.toLocaleLowerCase() + 'filials'
                ] || [],
                'Id',
                this._projectInfo[type + 'FilialId'],
              )[0];
              this.projectForm.patchValue(patchObject);
            }
          }
        }),
      );
    } else {
      return of();
    }
  }

  private _setCompanyDepartments(value, type: string): void {
    if (value && value.Id) {
      this._projectService
        .getDepartamnetByFilialId(value.Id)
        .subscribe((data: ServerResponse) => {
          let companyIndex = this.companies.indexOf(
            this.projectForm.get(type.toLocaleLowerCase()).value,
          );
          if (companyIndex > -1) {
            let filialIndex = this.companies[companyIndex][
              type.toLocaleLowerCase() + 'filials'
            ].indexOf(value);
            if (filialIndex > -1) {
              this.companies[companyIndex][
                type.toLocaleLowerCase() + 'filials'
              ][filialIndex]['department'] = data.message;
              if (this.editable) {
                const patchObject = {};
                patchObject[
                  type.toLocaleLowerCase() + 'Department'
                ] = this.findObject(
                  this._checkObjectValue(
                    this.projectForm.get(type.toLocaleLowerCase() + 'Filial')
                      .value,
                    'department',
                  ),
                  'Id',
                  this._projectInfo[type + 'DepartmentId'],
                )[0];
                this.projectForm.patchValue(patchObject);
              }
            }
          }
        });
    }
  }

  private _setCompanyManagers(value, mode?): Observable<void> | void {
    if (value && value.Id) {
      this._contactsService
        .getLegalEntities(value.Id)
        .subscribe((entities: any) => {
          this._projectService
            .getCompanyManagers(value.Id)
            .subscribe((data: ServerResponse) => {
              const index = this.companies.indexOf(value);
              if (index > -1) {
                this.companies[index]['managers'] = data.message;
                this.companies[index]['legalPerson'] = entities;
                if (this.editable) {
                  if (mode === 'Client') {
                    this._projectInfo['ChildManagerClient'].forEach(
                      (element, index) => {
                        this.projectForm.addControl(
                          'clientManager' + index,
                          new FormControl(
                            this.findObject(
                              this.projectForm.get('client').value.managers,
                              'Id',
                              element.Id,
                            )[0],
                          ),
                        );
                      },
                    );
                    this.clientManagers = this._projectInfo[
                      'ChildManagerClient'
                    ];
                    this.projectForm.patchValue({
                      mainClientManager: this.findObject(
                        this._checkObjectValue(
                          this.projectForm.get('client').value,
                          'managers',
                        ),
                        'Id',
                        this._projectInfo['ClientMainManagerId'],
                      )[0],
                    });
                  }

                  if (mode === 'Customer') {
                    this._projectInfo['ChildManagerCustomer'].forEach(
                      (element, index) => {
                        this.projectForm.addControl(
                          'customerManager' + index,
                          new FormControl(
                            this.findObject(
                              this.projectForm.get('customer').value.managers,
                              'Id',
                              element.Id,
                            )[0],
                          ),
                        );
                      },
                    );
                    this.customerManagers = this._projectInfo[
                      'ChildManagerCustomer'
                    ];
                    this.projectForm.patchValue({
                      mainCustomerManager: this.findObject(
                        this.projectForm.get('customer').value.managers,
                        'Id',
                        this._projectInfo['CustomerMainManagerId'],
                      )[0],
                    });
                  }
                }
                if (mode === 'Client') {
                  this.clientLegalPerson = entities;
                  this.clientManager = data.message;
                  if (this.editable) {
                    const legalPerson = this.findObject(
                      this.clientLegalPerson,
                      'Id',
                      this._projectInfo['ClientMainLegalPersonId'],
                    )[0];
                    this.projectForm
                      .get('mainClientLegalPerson')
                      .setValue(legalPerson);
                  }
                } else if (mode === 'Customer') {
                  this.customerLegalPerson = entities;
                  this.customerManager = data.message;
                  if (this.editable) {
                    const legalPerson = this.findObject(
                      this.customerLegalPerson,
                      'Id',
                      this._projectInfo['CustomerMainLegalPersonId'],
                    )[0];
                    this.projectForm
                      .get('mainCustomerLegalPerson')
                      .setValue(legalPerson);
                  }
                }
              }
            });
        });
    } else {
      return of();
    }
  }

  resetSalesForm() {
    this.projectForm.get('customer').setValue(null);
    this.projectForm.get('mainCustomerLegalPerson').setValue(null);
    this.projectForm.get('mainCustomerManager').setValue(null);
    this.projectForm.get('customerClosingDocuments').setValue(null);
    this.projectForm.get('client').setValue(null);
    this.projectForm.get('mainClientLegalPerson').setValue(null);
    this.projectForm.get('mainClientManager').setValue(null);
    this.projectForm.get('clientClosingDocuments').setValue(null);
    this.projectForm.get('komisioner').setValue(null);
    this.projectForm.get('typeComision').setValue(null);
    this.projectForm.get('paymentMethod').setValue(null);
    this.projectForm.get('commentCommission').setValue(null);

    (<FormArray>this.projectForm.get('opClient')).controls.forEach(
      (data, index) => {
        (<FormArray>this.projectForm.get('opClient')).removeAt(index);
      },
    );
    (<FormArray>this.projectForm.get('opCustomer')).controls.forEach(
      (data, index) => {
        (<FormArray>this.projectForm.get('opCustomer')).removeAt(index);
      },
    );
  }

  resetDayPartyForm(event) {
    this.projectForm.get('singleParty').setValue(null);
    this.projectForm.get('multiDateParty').setValue(null);
    this.projectForm.get('multiDatePartyPause').setValue(null);
    this.projectForm.get('seriesDateParty').setValue(null);
    while ((<FormArray>this.projectForm.get('arrayTimetables')).length) {
      (<FormArray>this.projectForm.get('arrayTimetables')).removeAt(0);
    }
  }

  private _getProjectInfo(projectId: number): void {
    this._projectService
      .getProjectById(projectId)
      .subscribe((data: ServerResponse) => {
        this._setProjectValues(data.message[0]);
      });
  }

  private _getProjectId(): void {
    this._activatedRoute.params.subscribe((params: Params) => {
      if (params && params.id) {
        this._projectId = +params.id;
        this._getProjectInfo(this._projectId);
        this._getTasks();
        this._getFiles();
        this.editable = true;
      } else {
        this.isDataAvailable = true;
        const res = this.projectsStatuses.find(
          (status) => status['Name'] === 'Новый запрос',
        );
        this.projectForm.patchValue({projectStatus: res});
        this._getRight(this._cookieService.get('PositionID'), res['Id']);
      }
    });
  }

  private _combineObservables(): void {
    const combined = forkJoin(
      this._getMainProjects(),
      this._getProjectStatuses(),
      this._getAllCompanies(),
      this._getAllProjectFormats(),
      this._getAllProjectTypes(),
      this._getAllDepartments(),
      this._getAllSalesTypes(),
      this._getAllProjectTypes(),
      this._getAllProjectTasks(),
      this._getAllCountries(),
      this._getAllCyclicity(),
      this._getAllCities(),
      this._getAllZones(),
      this._getAllIndOut(),
      this._getAllPayMethods(),

      this._getAllifBudgets(),
      this._getAllkomisioners(),
      this._getAlltypeComisions(),
      this._getAllzoneReacts(),
      this._getAllifContractors(),

      this._getAllFormMethods(),
      this._getAllharProdjects(),
      this._getAlldatePartys(),
      this._getAlllevelCompanys(),
      this._getAllmotivPartys(),
      this._getAllvovlechPartys(),
      this._getAllactivPartys(),
      this._getAllopensPartys(),
      this._getAllnacionPartys(),
      this._getAlllangPartys(),
      this._getAlltaskProjects(),
      this._getAllbizKontents(),
      this._getAllscenariyPartys(),
      this._getAlllifeExpes(),
      this._getAlltypeContracts(),

      this._getAllManagers(),
      this._getAllSubcontractors(),
      this._getAllEmployees(),
      this._getAllLegalPersonISG(),
      this._getAllRolesISG(),
      this._getAllRolesManager(),

      this._getRightsAccess(this.Id),
    );
    this._subscription = combined.subscribe(() => {
      this.projectForm.get('country').setValue({Id: 7, Name: 'Россия'});
      this.projectForm
        .get('harProdject')
        .setValue({Id: 1, Name: 'Коммерческий проект'});
      this.projectForm.get('typeDateParty').setValue({Id: 1, Name: 'Дата'});
      // this.projectForm.get('city').setValue([{ Id: 7, Name: 'Москва' }]);
      this._getProjectId();
    });
  }

  private _checkObjectValue(object, key) {
    return object && object[key] ? object[key] : null;
  }

  public addManager(type, id): void {
    if (this.projectForm.get(type).value.Id) {
      const matDialog = this._matDialog.open(AddmanagerDialog, {
        width: '613px',
        minHeight: '300px',
        data: {
          companyId: id,
          editable: this.editable,
          projectId: this._projectId,
          type: type,
        },
      });
      matDialog.afterClosed().subscribe((data) => {
        if (data && data.Id) {
          if (type == 'customer') {
            this.projectForm.addControl(
              'customerManager' + this.customerManagers.length,
              new FormControl(data, Validators.required),
            );
            this.customerManagers.push(data);
          } else if (type == 'client') {
            this.projectForm.addControl(
              'clientManager' + this.clientManagers.length,
              new FormControl(data, Validators.required),
            );
            this.clientManagers.push(data);
          }
        }
      });
    }
  }

  public addEmployee(mode?: string): void {
    const matDialog = this._matDialog.open(AddEmployeeDialog, {
      minHeight: '300px',
      width: '400px',
      data: {
        editable: this.editable,
        projectId: this._projectId,
        mode: mode === 'sale' ? 2 : 1,
      },
    });
    matDialog.afterClosed().subscribe((value) => {
      if (value) {
        this._setEmployeesByPosition(value, mode).subscribe(() => {
          this.getDepartmentInvolved();
          if (this.editable) {
            this._updateProject();
          }
        });
      }
    });
  }

  onInputStartTime(value, time: FormGroup) {
    if (value > time.get('EndTime').value) {
      time.get('EndTime').setValue(value);
    }
  }

  onInputEndTime(value, time: FormGroup) {
    if (value < time.get('StartTime').value) {
      time.get('StartTime').setValue(value);
    }
  }

  inputStartTime(event, time) {
    const startDate = formatDate(time.get('StartTime').value, 'HH:mm', 'en');
    const endDate = formatDate(time.get('EndTime').value, 'HH:mm', 'en');
    if (startDate > endDate) {
      time.get('EndTime').setValue(time.get('StartTime').value);
    }
  }

  inputEndTime(event, time) {
    const startDate = formatDate(time.get('StartTime').value, 'HH:mm', 'en');
    const endDate = formatDate(time.get('EndTime').value, 'HH:mm', 'en');
    if (endDate < startDate) {
      time.get('StartTime').setValue(time.get('EndTime').value);
    }
  }

  onSubcontractorChange(item, value, legalPerson?) {
    if (value && value.Id) {
      this._contactsService
        .getLegalEntities(value.Id)
        .subscribe((entities: any) => {
          this._projectService
            .getCompanyManagers(value.Id)
            .subscribe((data: ServerResponse) => {
              const index = this.companies.indexOf(value);
              item.get('subLegalPerson').setValue(entities);
              if (index > -1) {
                if (this.editable) {
                  const legalPersonValue = this.findObject(
                    item.get('subLegalPerson').value,
                    'Id',
                    legalPerson,
                  )[0];
                  item.get('companySubLegalPerson').setValue(legalPersonValue);
                }
              }
            });
        });
    }
  }

  public addSubcontractor(subs?) {
    const filter = this.fiedsFunctionality.filter(
      (item) => item.section === 'subcontractor',
    );

    if (subs) {
      console.log(filter.find((item) => item.key === 'zoneReact'));
      subs.forEach((sub) => {
        (<FormArray>this.projectForm.get('subcontractors')).push(
          new FormGroup({
            zoneReact: new FormControl(
              this.findObject(this.zoneReacts, 'Id', sub.zoneReactIds),
              filter.find((item) => item.key === 'zoneReact').isRequired &&
                Validators.required,
            ),
            ifContractor: new FormControl(
              this.findObject(this.ifContractors, 'Id', sub.ifContractorId)[0],
              filter.find((item) => item.key === 'ifContractor').isRequired &&
                Validators.required,
            ),
            companySub: new FormControl(
              this.findObject(this.companiesSub, 'Id', sub.companySub)[0],
            ),
            subClosingDocuments: new FormControl(
              this.findObject(
                this.typeClosingDocuments,
                'Id',
                sub.subClosingDocuments,
              )[0],
            ),
            companySubManager: new FormControl(
              this.findObject(this.managers, 'Id', sub.companySubManager)[0],
              filter.find((item) => item.key === 'companySubManager')
                .isRequired && Validators.required,
            ),
            companySubLegalPerson: new FormControl(null),
            subLegalPerson: new FormControl(null),
            opSub: this.setOPSubManager(sub.opSub),
          }),
        );
        this.onSubcontractorChange(
          (<FormArray>this.projectForm.get('subcontractors')).controls[
            (<FormArray>this.projectForm.get('subcontractors')).controls
              .length - 1
          ],
          this.findObject(this.companiesSub, 'Id', sub.companySub)[0],
          sub.companySubLegalPerson,
        );
      });
    } else {
      (<FormArray>this.projectForm.get('subcontractors')).push(
        new FormGroup({
          zoneReact: new FormControl(
            [],
            filter.find((item) => item.key === 'zoneReact').isRequired &&
              Validators.required,
          ),
          ifContractor: new FormControl(
            null,
            filter.find((item) => item.key === 'ifContractor').isRequired &&
              Validators.required,
          ),
          companySub: new FormControl(null),
          companySubLegalPerson: new FormControl(null),
          companySubManager: new FormControl(
            null,
            filter.find((item) => item.key === 'companySubManager')
              .isRequired && Validators.required,
          ),
          subClosingDocuments: new FormControl(null),
          subLegalPerson: new FormControl(null),
          opSub: new FormArray([]),
        }),
      );
    }

    const subcontractors = this.projectForm.get('subcontractors') as FormArray;
    subcontractors.controls.forEach((item) => {
      item.get('companySub').valueChanges.subscribe((value) => {
        this.onSubcontractorChange(item, value);
      });
      item.get('ifContractor').valueChanges.subscribe((data) => {
        if (data) {
          if (data.Id === 1) {
            const fiedsFunctionality = this.fiedsFunctionality.find(
              (field) => field.key === 'companySubLegalPerson',
            );
            if (fiedsFunctionality) {
              if (fiedsFunctionality.isRequired) {
                item
                  .get('companySubManager')
                  .setValidators(Validators.required);
                item
                  .get('subClosingDocuments')
                  .setValidators(Validators.required);
                item
                  .get('companySubLegalPerson')
                  .setValidators(Validators.required);
                item.get('companySub').setValidators(Validators.required);

                item.get('companySubLegalPerson').updateValueAndValidity();
                item.get('companySubManager').updateValueAndValidity();
                item.get('subClosingDocuments').updateValueAndValidity();
                item.get('companySub').updateValueAndValidity();
              }
            }
          } else {
            item.get('subClosingDocuments').setValue(null);
            item.get('companySubLegalPerson').setValue(null);
            while ((<FormArray>item.get('opSub')).length !== 0) {
              (<FormArray>item.get('opSub')).removeAt(0);
            }
            item.get('companySub').setValue(null);

            item.get('companySubLegalPerson').clearValidators();
            item.get('companySubManager').clearValidators();
            item.get('subClosingDocuments').clearValidators();
            item.get('companySub').clearValidators();

            item.get('companySubLegalPerson').updateValueAndValidity();
            item.get('companySubManager').updateValueAndValidity();
            item.get('subClosingDocuments').updateValueAndValidity();
            item.get('companySub').updateValueAndValidity();
          }
        }
      });
    });
  }

  public removeSubcontractor(ind) {
    (<FormArray>this.projectForm.get('subcontractors')).removeAt(ind);
  }

  public addTimetable(array) {
    console.log(array);
    const field = this.fiedsFunctionality.find(
      (item) => item.key === 'timetable',
    );
    if (!field) {
      return;
    }
    let formArray = this.projectForm.get('arrayTimetables').value;
    formArray = formArray.map((date) => date.Timetable.getTime());
    array = array.map((date) => date.getTime());
    const itemsInsert = difference(array, formArray);
    const itemsDelete = difference(formArray, array);
    console.log(itemsDelete);

    itemsInsert.forEach((item: number) => {
      if (field.isRequired) {
        (<FormArray>this.projectForm.get('arrayTimetables')).push(
          new FormGroup({
            Timetable: new FormControl(new Date(item), Validators.required),
            StartTime: new FormControl(new Date(item), Validators.required),
            EndTime: new FormControl(new Date(item), Validators.required),
          }),
        );
      } else {
        (<FormArray>this.projectForm.get('arrayTimetables')).push(
          new FormGroup({
            Timetable: new FormControl(new Date(item)),
            StartTime: new FormControl(new Date(item)),
            EndTime: new FormControl(new Date(item)),
          }),
        );
      }
    });

    itemsDelete.forEach((item: number) => {
      const index = formArray.indexOf(item);
      this.removeTimetable(index);
    });
  }

  public setTimetable(timetable) {
    const field = this.fiedsFunctionality.find(
      (item) => item.key === 'timetable',
    );
    if (!timetable) {
      return;
    }
    timetable.forEach((item) => {
      if (field.isRequired) {
        (<FormArray>this.projectForm.get('arrayTimetables')).push(
          new FormGroup({
            Timetable: new FormControl(
              new Date(item.Timetable),
              Validators.required,
            ),
            StartTime: new FormControl(
              new Date(item.StartTime),
              Validators.required,
            ),
            EndTime: new FormControl(
              new Date(item.EndTime),
              Validators.required,
            ),
          }),
        );
      } else {
        (<FormArray>this.projectForm.get('arrayTimetables')).push(
          new FormGroup({
            Timetable: new FormControl(new Date(item.Timetable)),
            StartTime: new FormControl(new Date(item.StartTime)),
            EndTime: new FormControl(new Date(item.EndTime)),
          }),
        );
      }
    });
  }

  public resetTimetable() {
    while ((this.projectForm.get('arrayTimetables') as FormArray).length) {
      (this.projectForm.get('arrayTimetables') as FormArray).removeAt(
        (this.projectForm.get('arrayTimetables') as FormArray).length - 1,
      );
    }
  }

  public removeTimetable(ind) {
    (<FormArray>this.projectForm.get('arrayTimetables')).removeAt(ind);
  }

  public addBudgetPredlog() {
    const item = this.fiedsFunctionality.find(
      (field) => field.key === 'fBudgetPredlog',
    );
    if (item.isRequired) {
      (<FormArray>this.projectForm.get('arrayBudgetPredlogs')).push(
        new FormGroup({
          budgetPredlog: new FormControl(0, Validators.required),
        }),
      );
    } else {
      (<FormArray>this.projectForm.get('arrayBudgetPredlogs')).push(
        new FormGroup({
          budgetPredlog: new FormControl(0),
        }),
      );
    }
  }

  public setBudgetPredlog(value) {
    const item = this.fiedsFunctionality.find(
      (field) => field.key === 'fBudgetPredlog',
    );
    if (item.isRequired) {
      (<FormArray>this.projectForm.get('arrayBudgetPredlogs')).push(
        new FormGroup({
          budgetPredlog: new FormControl(value, Validators.required),
        }),
      );
    } else {
      (<FormArray>this.projectForm.get('arrayBudgetPredlogs')).push(
        new FormGroup({
          budgetPredlog: new FormControl(value),
        }),
      );
    }
  }

  public removeBudgetPredlog(ind) {
    (<FormArray>this.projectForm.get('arrayBudgetPredlogs')).removeAt(ind);
  }

  public addOPSubManager(item) {
    (<FormArray>item.get('opSub')).push(
      new FormGroup({
        opSubEmployee: new FormControl('', Validators.required),
        typeOPSub: new FormControl('', Validators.required),
        roleSub: new FormControl('', Validators.required),
      }),
    );
  }

  public setOPSubManager(opSubs) {
    const formArray = new FormArray([]);
    opSubs.forEach((value) => {
      let employee;
      let type;
      let role;
      if (value.type === 1) {
        employee = this.employeesList.find(
          (empl) => empl['Id'] === value.employee,
        );
        type = this.typeOP.find((top) => top.Id === value.type);
        role = this.rolesISG.find((roleISG) => roleISG.Id === value.role);
      } else {
        employee = this.managers.find(
          (manager) => manager['Id'] === value.employee,
        );
        type = this.typeOPSaleForm.find((top) => top.Id === value.type);
        role = this.rolesManagers.find(
          (roleManager) => roleManager.Id === value.role,
        );
      }
      formArray.push(
        new FormGroup({
          opSubEmployee: new FormControl(employee, Validators.required),
          typeOPSub: new FormControl(type, Validators.required),
          roleSub: new FormControl(role, Validators.required),
        }),
      );
    });
    return formArray;
  }

  public removeOPSubManager(item, ind) {
    (<FormArray>item.get('opSub')).removeAt(ind);
  }

  public addOPManager(mode?: string) {
    if (mode === 'sale') {
      (<FormArray>this.projectForm.get('opSale')).push(
        new FormGroup({
          opSaleEmployee: new FormControl('', Validators.required),
          typeOPSale: new FormControl('', Validators.required),
          roleSale: new FormControl('', Validators.required),
        }),
      );
    } else if (mode === 'customer') {
      (<FormArray>this.projectForm.get('opCustomer')).push(
        new FormGroup({
          opCustomerEmployee: new FormControl('', Validators.required),
          typeOPCustomer: new FormControl('', Validators.required),
          roleCustomer: new FormControl('', Validators.required),
        }),
      );
    } else if (mode === 'client') {
      (<FormArray>this.projectForm.get('opClient')).push(
        new FormGroup({
          opClientEmployee: new FormControl('', Validators.required),
          typeOPClient: new FormControl('', Validators.required),
          roleClient: new FormControl('', Validators.required),
        }),
      );
    } else {
      (<FormArray>this.projectForm.get('op')).push(
        new FormGroup({
          opEmployee: new FormControl('', Validators.required),
          typeOP: new FormControl('', Validators.required),
          role: new FormControl('', Validators.required),
        }),
      );
    }
  }

  public setOPManager(value, mode?: string) {
    let employee;
    let type;
    let role;
    if (value.type === 1) {
      employee = this.employeesList.find(
        (empl) => empl['Id'] === value.employee,
      );
      type = this.typeOP.find((top) => top.Id === value.type);
      role = this.rolesISG.find((roleISG) => roleISG.Id === value.role);
    } else {
      employee = this.managers.find(
        (manager) => manager['Id'] === value.employee,
      );
      type = this.typeOPSaleForm.find((top) => top.Id === value.type);
      role = this.rolesManagers.find(
        (roleManager) => roleManager.Id === value.role,
      );
    }
    if (mode === 'sale') {
      (<FormArray>this.projectForm.get('opSale')).push(
        new FormGroup({
          opSaleEmployee: new FormControl(employee, Validators.required),
          typeOPSale: new FormControl(type, Validators.required),
          roleSale: new FormControl(role, Validators.required),
        }),
      );
    } else if (mode === 'customer') {
      (<FormArray>this.projectForm.get('opCustomer')).push(
        new FormGroup({
          opCustomerEmployee: new FormControl(employee, Validators.required),
          typeOPCustomer: new FormControl(type, Validators.required),
          roleCustomer: new FormControl(role, Validators.required),
        }),
      );
    } else if (mode === 'client') {
      (<FormArray>this.projectForm.get('opClient')).push(
        new FormGroup({
          opClientEmployee: new FormControl(employee, Validators.required),
          typeOPClient: new FormControl(type, Validators.required),
          roleClient: new FormControl(role, Validators.required),
        }),
      );
    } else {
      (<FormArray>this.projectForm.get('op')).push(
        new FormGroup({
          opEmployee: new FormControl(employee, Validators.required),
          typeOP: new FormControl(type, Validators.required),
          role: new FormControl(role, Validators.required),
        }),
      );
    }
  }

  public removeOPManager(ind: number, mode?: string, item?) {
    if (mode === 'sale') {
      (<FormArray>this.projectForm.get('opSale')).removeAt(ind);
    } else if (mode === 'customer') {
      (<FormArray>this.projectForm.get('opCustomer')).removeAt(ind);
    } else if (mode === 'client') {
      (<FormArray>this.projectForm.get('opClient')).removeAt(ind);
    } else {
      (<FormArray>this.projectForm.get('op')).removeAt(ind);
    }
  }

  public removeManager(type, index, managerId): void {
    this.projectForm.removeControl(type + index);
    if (type == 'customerManager') {
      this.customerManagers.splice(index, 1);
    }
    if (type == 'clientManager') {
      this.clientManagers.splice(index, 1);
    }
    if (this.editable) {
      this._deleteManagerById(
        this._projectId,
        managerId,
        this.projectForm.get('customer').value.Id,
      );
    }
  }

  public removeEmployee(ind: number, employeeId: number, mode?: string): void {
    if (mode === 'sale') {
      this.projectForm.removeControl('saleEmployee' + ind);
    } else {
      this.projectForm.removeControl('employee' + ind);
    }
    const employees = mode === 'sale' ? this.saleEmployees : this.employees;
    employees.splice(ind, 1);
    this.getDepartmentInvolved();
    if (this.editable) {
      this._deleteEmployeeById(this._projectId, employeeId);
      this._updateProject();
    }
  }

  public removeSubcontractors(ind: number, subcontractorId: number): void {
    this.projectForm.removeControl('subcontractor' + ind);
    this.subcontractors.splice(ind, 1);
    if (this.editable) {
      this._deleteSubcontractorById(this._projectId, subcontractorId);
    }
  }

  public findObject(
    array: Array<object>,
    value: string,
    value1: string | number | Array<number>,
  ): Array<object> {
    let filteredArray: Array<object> = [];
    if (array && value && value1) {
      filteredArray = array.filter((element) => {
        return (
          element[value] === value1 ||
          (Array.isArray(value1) && value1.includes(element[value]))
        );
      });
    }
    return filteredArray;
  }

  public getDepartmentInvolved() {
    const arr = [];
    this.employees.forEach((employee) => {
      const find = arr.find((item) => item === employee['DepartmentName']);
      if (!find) {
        arr.push(employee['DepartmentName']);
      }
    });
    this.projectForm.get('departmentInvolved').setValue(arr.join(', '));
  }

  private _setEmployeesByPosition(value, mode?: string) {
    if (value && value.PositionId) {
      return this._projectService.getEmployeeByPosition(value.PositionId).pipe(
        map((data: ServerResponse) => {
          value['employeesPosition'] = data.message;
          const employee = data.message.filter(
            (element) => element['Id'] === value['EmployeeId'],
          )[0];
          if (mode === 'sale') {
            this.projectForm.addControl(
              'saleEmployee' + this.saleEmployees.length,
              new FormControl(employee, Validators.required),
            );
            if (!this.editable) {
              this.employeesPost.push({...value, Mode: 2});
            } else {
              this.employeesPost.push(value);
            }
            this.saleEmployees.push(value);
          } else {
            this.projectForm.addControl(
              'employee' + this.employees.length,
              new FormControl(employee, Validators.required),
            );
            if (!this.editable) {
              this.employeesPost.push({...value, Mode: 1});
            } else {
              this.employeesPost.push(value);
            }
            this.employees.push(value);
          }
        }),
      );
    }
  }

  private _generateProjectNumber(
    departmentName: string,
    projectYear: string,
  ): void {
    this._projectService
      .generateProjectNumber(departmentName, projectYear)
      .subscribe((data: ServerResponse) => {
        this.projectForm.patchValue({
          number: data.message,
        });
      });
  }

  private _replaceArray(array, key): Array<number> {
    const idArray: Array<number> = [];
    array.forEach((element) => {
      idArray.push(element[key]);
    });
    return idArray;
  }

  convertMultiDate(arrayDate, dateParty) {
    if (arrayDate) {
      if (this.projectForm.get('typeDateParty').value.Id === 2 && dateParty) {
        return formatDate(arrayDate, 'yyyy-MM-dd', 'en');
      } else if (
        this.projectForm.get('typeDateParty').value.Id === 3 &&
        dateParty
      ) {
        return null;
      } else {
        const dates = [];
        if (arrayDate.length) {
          arrayDate.forEach((date, index) => {
            dates.push(formatDate(date, 'yyyy-MM-dd', 'en'));
          });
          return dates.length > 0 ? dates.join(',') : null;
        }
      }
    }
  }

  /**
   *
   * @param type
   * @param employee
   * @param role
   */
  getOPManager(array: string, type: string, employee: string, role: string) {
    const result = [];
    for (const control of (<FormArray>this.projectForm.get(array)).controls) {
      result.push({
        type: control.value[type].Id,
        employee: control.value[employee].Id,
        role: control.value[role].Id,
      });
    }
    return result;
  }

  getOPSubManager(array, type: string, employee: string, role: string) {
    const result = [];
    array.forEach((item) => {
      result.push({
        type: item[type].Id,
        employee: item[employee].Id,
        role: item[role].Id,
      });
    });
    return result;
  }

  getBudgetPredlog() {
    const result = [];
    for (const control of (<FormArray>(
      this.projectForm.get('arrayBudgetPredlogs')
    )).controls) {
      result.push(control.value.budgetPredlog);
    }
    return result.join(',');
  }

  getSubcontractors() {
    const array = this.projectForm.get('subcontractors').value;
    console.log(array);
    const results = [];
    array.forEach((item) => {
      results.push({
        zoneReactIds: item.zoneReact.map((ell) => ell.Id),
        ifContractorId: this._checkObjectValue(item.ifContractor, 'Id'),
        companySub: this._checkObjectValue(item.companySub, 'Id'),
        companySubLegalPerson: this._checkObjectValue(
          item.companySubLegalPerson,
          'Id',
        ),
        companySubManager: this._checkObjectValue(item.companySubManager, 'Id'),
        subClosingDocuments: this._checkObjectValue(
          item.subClosingDocuments,
          'Id',
        ),
        opSub: this.getOPSubManager(
          item.opSub,
          'typeOPSub',
          'opSubEmployee',
          'roleSub',
        ),
      });
    });
    console.log(results);
    return results;
  }

  private _addProject(projectName, number, val?): void {
    const multiDate = this.convertMultiDate(
      this.projectForm.get('multiDateParty').value,
      true,
    );
    const singleDate = this.convertMultiDate(
      this.projectForm.get('singleParty').value
        ? [this.projectForm.get('singleParty').value]
        : null,
      true,
    );
    const multiDatePause = this.convertMultiDate(
      this.projectForm.get('multiDatePartyPause').value,
      true,
    );
    const seriesDate = val
      ? this.convertMultiDate([val], true)
      : this.convertMultiDate(
          this.projectForm.get('seriesDateParty').value,
          true,
        );
    const projectDate = val
      ? this.convertMultiDate([val], true)
      : this.convertMultiDate(this.projectForm.get('projectDate').value, true);
    const payDate = this.convertMultiDate(
      this.projectForm.get('payDate').value,
      false,
    );
    const opSaleEmployee = this.getOPManager(
      'opSale',
      'typeOPSale',
      'opSaleEmployee',
      'roleSale',
    );
    const opEmployee = this.getOPManager('op', 'typeOP', 'opEmployee', 'role');
    const opClientEmployee = this.getOPManager(
      'opClient',
      'typeOPClient',
      'opClientEmployee',
      'roleClient',
    );
    const opCustomerEmployee = this.getOPManager(
      'opCustomer',
      'typeOPCustomer',
      'opCustomerEmployee',
      'roleCustomer',
    );
    const budgetPredlogs = this.getBudgetPredlog();
    const subs = this.getSubcontractors();
    let timetables;
    if (val) {
      timetables = (<FormArray>this.projectForm.get('arrayTimetables')).value
        .filter((date) => date.Timetable.getTime() === val.getTime())
        .map((date) => {
          return {
            Timetable: formatDate(date.Timetable, 'yyyy-MM-dd HH:mm', 'en'),
            StartTime: formatDate(date.StartTime, 'yyyy-MM-dd HH:mm', 'en'),
            EndTime: formatDate(date.EndTime, 'yyyy-MM-dd HH:mm', 'en'),
          };
        });
    } else {
      timetables = (<FormArray>(
        this.projectForm.get('arrayTimetables')
      )).value.map((date) => {
        return {
          Timetable: formatDate(date.Timetable, 'yyyy-MM-dd HH:mm', 'en'),
          StartTime: formatDate(date.StartTime, 'yyyy-MM-dd HH:mm', 'en'),
          EndTime: formatDate(date.EndTime, 'yyyy-MM-dd HH:mm', 'en'),
        };
      });
    }
    this._projectService
      .addNewProject({
        projectName: projectName,

        formagesKl: this.projectForm.get('formagesKl').value,
        fgenderMan: this.projectForm.get('fgenderMan').value,
        fgenderWoman: this.projectForm.get('fgenderWoman').value,
        fBudgetPredlog: this.projectForm.get('fBudgetPredlog').value,
        budgetPredlogs,
        fprofitWont: this.projectForm.get('fprofitWont').value,
        fBudgetFact: this.projectForm.get('fBudgetFact').value,
        fprofitFact: this.projectForm.get('fprofitFact').value,
        fprofit: this.projectForm.get('fprofit').value,
        fprofileKl: this.projectForm.get('fprofileKl').value,
        fbackgroundKl: this.projectForm.get('fbackgroundKl').value,
        finsider: this.projectForm.get('finsider').value,
        fefficiencyKl: this.projectForm.get('fefficiencyKl').value,

        statusId: this._checkObjectValue(
          this.projectForm.get('projectStatus').value,
          'Id',
        ),
        generalProjectId: this._checkObjectValue(
          this.projectForm.get('mainProject').value,
          'Id',
        ),
        formatId: this._checkObjectValue(
          this.projectForm.get('projectFormat').value,
          'Id',
        ),
        ciclycityId: this._checkObjectValue(
          this.projectForm.get('cyclicity').value,
          'Id',
        ),
        clientId: this._checkObjectValue(
          this.projectForm.get('client').value,
          'Id',
        ),
        customerId: this._checkObjectValue(
          this.projectForm.get('customer').value,
          'Id',
        ),
        recomendManagerId: this._checkObjectValue(
          this.projectForm.get('recomendationName').value,
          'Id',
        ),
        recomendISGId: this._checkObjectValue(
          this.projectForm.get('recomendationNameISG').value,
          'Id',
        ),
        saleTypeId: this._checkObjectValue(
          this.projectForm.get('salesType').value,
          'Id',
        ),
        projectTypeId: this._checkObjectValue(
          this.projectForm.get('projectType').value,
          'Id',
        ),
        projectTaskId: this._checkObjectValue(
          this.projectForm.get('projectTask').value,
          'Id',
        ),
        projectDuration: this.projectForm.get('projectDuration').value,
        saleId: this._checkObjectValue(
          this.projectForm.get('sale').value,
          'Id',
        ),
        pmId: this._checkObjectValue(this.projectForm.get('pm').value, 'Id'),
        budgetForClient: this.projectForm.get('clientBudget').value,
        budget: this.projectForm.get('expenseBudget').value,
        payMethodId: this._checkObjectValue(
          this.projectForm.get('paymentMethod').value,
          'Id',
        ),

        ifbudgetId: this._checkObjectValue(
          this.projectForm.get('ifBudget').value,
          'Id',
        ),
        komisionerId: this._checkObjectValue(
          this.projectForm.get('komisioner').value,
          'Id',
        ),
        typecomisionId: this._checkObjectValue(
          this.projectForm.get('typeComision').value,
          'Id',
        ),

        formpaymentId: this._checkObjectValue(
          this.projectForm.get('formMethod').value,
          'Id',
        ),
        harprodjectId: this._checkObjectValue(
          this.projectForm.get('harProdject').value,
          'Id',
        ),
        datepartyId: this._checkObjectValue(
          this.projectForm.get('dateParty').value,
          'Id',
        ),
        levelcompanyId: this.projectForm
          .get('levelCompany')
          .value.map((ell) => ell.Id),
        motivpartyId: this._checkObjectValue(
          this.projectForm.get('motivParty').value,
          'Id',
        ),
        vovlechpartyId: this._checkObjectValue(
          this.projectForm.get('vovlechParty').value,
          'Id',
        ),
        activpartyId: this._checkObjectValue(
          this.projectForm.get('activParty').value,
          'Id',
        ),
        openspartyId: this._checkObjectValue(
          this.projectForm.get('opensParty').value,
          'Id',
        ),
        bizkontentId: this._checkObjectValue(
          this.projectForm.get('bizKontent').value,
          'Id',
        ),
        scenariypartyId: this._checkObjectValue(
          this.projectForm.get('scenariyParty').value,
          'Id',
        ),
        lifeexpeId: this._checkObjectValue(
          this.projectForm.get('lifeExpe').value,
          'Id',
        ),
        typecontractId: this._checkObjectValue(
          this.projectForm.get('typeContract').value,
          'Id',
        ),

        countryId: this._checkObjectValue(
          this.projectForm.get('country').value,
          'Id',
        ),
        countParticipants: this.projectForm.get('participantCount').value,
        countParticipantsF: this.projectForm.get('participantCountF').value,
        childManagerClient: this._replaceArray(this.clientManagers, 'Id'),
        childManagerCustomer: this._replaceArray(this.customerManagers, 'Id'),
        subcontractor: this._replaceArray(this.subcontractors, 'Id'),
        employee: this.employeesPost.map((el) => {
          return {EmployeeId: el['EmployeeId'], Mode: el['Mode']};
        }),
        clientDepartmentId: this._checkObjectValue(
          this.projectForm.get('clientDepartment').value,
          'Id',
        ),
        clientFilialId: this._checkObjectValue(
          this.projectForm.get('clientFilial').value,
          'Id',
        ),
        clientMainManagerId: this._checkObjectValue(
          this.projectForm.get('mainClientManager').value,
          'Id',
        ),
        customerDepartmentId: this._checkObjectValue(
          this.projectForm.get('customerDepartment').value,
          'Id',
        ),
        customerFilialId: this._checkObjectValue(
          this.projectForm.get('customerFilial').value,
          'Id',
        ),
        customerMainManagerId: this._checkObjectValue(
          this.projectForm.get('mainCustomerManager').value,
          'Id',
        ),
        departMentId: this._checkObjectValue(
          this.projectForm.get('department').value,
          'Id',
        ),
        customerLegalPersonId: this._checkObjectValue(
          this.projectForm.get('mainCustomerLegalPerson').value,
          'Id',
        ),
        clientLegalPersonId: this._checkObjectValue(
          this.projectForm.get('mainClientLegalPerson').value,
          'Id',
        ),
        legalPersonISGId: this._checkObjectValue(
          this.projectForm.get('legalPersonISG').value,
          'id',
        ),
        customerClosingDocuments: this._checkObjectValue(
          this.projectForm.get('customerClosingDocuments').value,
          'Id',
        ),
        clientClosingDocuments: this._checkObjectValue(
          this.projectForm.get('clientClosingDocuments').value,
          'Id',
        ),
        typeDateParty: this._checkObjectValue(
          this.projectForm.get('typeDateParty').value,
          'Id',
        ),
        opSale: opSaleEmployee ? JSON.stringify(opSaleEmployee) : null,
        op: opEmployee ? JSON.stringify(opEmployee) : null,
        opClient: opClientEmployee ? JSON.stringify(opClientEmployee) : null,
        opCustomer: opCustomerEmployee
          ? JSON.stringify(opCustomerEmployee)
          : null,
        subcontractors: subs ? JSON.stringify(subs) : null,
        taskProjectComment: this.projectForm.get('taskProjectComment').value,
        requestDate: this.projectForm.get('requestDate').value,
        projectFinishDate: this.projectForm.get('submissionDate').value,
        projectDate: projectDate,
        number: number,
        commentStatus: this.projectForm.get('commentStatus').value,
        commentCyclicity: this.projectForm.get('commentCyclicity').value,
        commentZones: this.projectForm.get('commentZones').value,
        commentIndOut: this.projectForm.get('commentIndOut').value,
        commentLevelCompany: this.projectForm.get('commentLevelCompany').value,
        commentBizKontent: this.projectForm.get('commentBizKontent').value,
        commentScenariyParty: this.projectForm.get('commentScenariyParty')
          .value,
        commentLifeExpe: this.projectForm.get('commentLifeExpe').value,
        commentRecomendManager: this.projectForm.get('commentRecomendManager')
          .value,
        commissionNumber: this.projectForm.get('commissionNumber').value,
        commentCommission: this.projectForm.get('commentCommission').value,
        departmentInvolved: this.projectForm.get('departmentInvolved').value,
        payDate: payDate,
        timetable: JSON.stringify(timetables),
        singleParty: singleDate,
        multiDatePartyPause: multiDatePause,
        seriesParty: seriesDate,
        multiDateParty: multiDate,
        commentFormatProject: this.projectForm.get('commentFormatProject')
          .value,
        commentSetFormatProject: this.projectForm.get('commentSetFormatProject')
          .value,
        vip: this.projectForm.get('vipParty').value,
        comment: this.projectForm.get('commentParty').value,
        nacionpartyId: this.projectForm
          .get('nacionParty')
          .value.map((ell) => ell.Id),
        taskprojectId: this.projectForm
          .get('taskProject')
          .value.map((ell) => ell.Id),
        langpartyId: this.projectForm
          .get('langParty')
          .value.map((ell) => ell.Id),
        cityId: this.projectForm.get('city').value.map((ell) => ell.Id),
        formatIds: this.projectForm
          .get('projectFormat')
          .value.map((ell) => ell.Id),
        setProjectFormatIds: this.projectForm
          .get('setProjectFormat')
          .value.map((ell) => ell.Id),
        indoorOutdoorId: this.projectForm
          .get('indOut')
          .value.map((ell) => ell.Id),
        areaId: this.projectForm.get('zone').value.map((ell) => ell.Id),
      })
      .pipe(
        delay(300),
        finalize(() => (this.loading = false)),
      )
      .subscribe(
        (data) => {
          const ProjectId = data['message'];
          const StatusId = this._checkObjectValue(
            this.projectForm.get('projectStatus').value,
            'Id',
          );
          this.markFormGroupPristine(this.projectForm);
          if (this.estimate) {
            const ce = {
              ...this.estimate.estimateForm.value,
              ProjectId: ProjectId,
            };
            this._projectService.addProjectCE(ce).subscribe(() => {
              this._projectService
                .addProjectReminder({ProjectId, StatusId})
                .subscribe(() => {
                  this._router.navigate(['/projects/all-projects']);
                });
            });
          } else if (this.estimateData) {
            const ce = {
              ...this.estimateData,
              ProjectId: ProjectId,
            };
            this._projectService.addProjectCE(ce).subscribe(() => {
              this._projectService
                .addProjectReminder({ProjectId, StatusId})
                .subscribe(() => {
                  this._router.navigate(['/projects/all-projects']);
                });
            });
          } else {
            this._projectService
              .addProjectReminder({ProjectId, StatusId})
              .subscribe(() => {
                this._router.navigate(['/projects/all-projects']);
              });
          }
        },
        (error) => {
          this.validationError = undefined;
          this.loading = false;
          this.error = error.error.message;
        },
      );
  }

  private _updateProject(): void {
    const multiDate = this.convertMultiDate(
      this.projectForm.get('multiDateParty').value,
      true,
    );
    const singleDate = this.convertMultiDate(
      this.projectForm.get('singleParty').value
        ? [this.projectForm.get('singleParty').value]
        : null,
      true,
    );
    const multiDatePause = this.convertMultiDate(
      this.projectForm.get('multiDatePartyPause').value,
      true,
    );
    const seriesDate = this.convertMultiDate(
      this.projectForm.get('seriesDateParty').value,
      true,
    );
    const projectDate = this.convertMultiDate(
      this.projectForm.get('projectDate').value,
      true,
    );
    const payDate = this.convertMultiDate(
      this.projectForm.get('payDate').value,
      false,
    );
    const opSaleEmployee = this.getOPManager(
      'opSale',
      'typeOPSale',
      'opSaleEmployee',
      'roleSale',
    );
    const opEmployee = this.getOPManager('op', 'typeOP', 'opEmployee', 'role');
    const opClientEmployee = this.getOPManager(
      'opClient',
      'typeOPClient',
      'opClientEmployee',
      'roleClient',
    );
    const opCustomerEmployee = this.getOPManager(
      'opCustomer',
      'typeOPCustomer',
      'opCustomerEmployee',
      'roleCustomer',
    );
    const budgetPredlogs = this.getBudgetPredlog();
    const subs = this.getSubcontractors();
    const timetables = (<FormArray>(
      this.projectForm.get('arrayTimetables')
    )).value.map((date) => {
      return {
        Timetable: formatDate(date.Timetable, 'yyyy-MM-dd HH:mm', 'en'),
        StartTime: formatDate(date.StartTime, 'yyyy-MM-dd HH:mm', 'en'),
        EndTime: formatDate(date.EndTime, 'yyyy-MM-dd HH:mm', 'en'),
      };
    });
    console.log(timetables);
    this._projectService
      .updateProject({
        projectId: this._projectId,
        projectName: this.projectForm.get('projectName').value,

        formagesKl: this.projectForm.get('formagesKl').value,
        fgenderMan: this.projectForm.get('fgenderMan').value,
        fgenderWoman: this.projectForm.get('fgenderWoman').value,
        fBudgetPredlog: this.projectForm.get('fBudgetPredlog').value,
        budgetPredlogs,
        fprofitWont: this.projectForm.get('fprofitWont').value,
        fBudgetFact: this.projectForm.get('fBudgetFact').value,
        fprofitFact: this.projectForm.get('fprofitFact').value,
        fprofit: this.projectForm.get('fprofit').value,
        fprofileKl: this.projectForm.get('fprofileKl').value,
        fbackgroundKl: this.projectForm.get('fbackgroundKl').value,
        finsider: this.projectForm.get('finsider').value,
        fefficiencyKl: this.projectForm.get('fefficiencyKl').value,

        statusId: this._checkObjectValue(
          this.projectForm.get('projectStatus').value,
          'Id',
        ),
        generalProjectId: this._checkObjectValue(
          this.projectForm.get('mainProject').value,
          'Id',
        ),
        formatId: null, // this._checkObjectValue(this.projectForm.get('projectFormat').value, 'Id'),
        ciclycityId: this._checkObjectValue(
          this.projectForm.get('cyclicity').value,
          'Id',
        ),
        clientId: this._checkObjectValue(
          this.projectForm.get('client').value,
          'Id',
        ),
        customerId: this._checkObjectValue(
          this.projectForm.get('customer').value,
          'Id',
        ),
        recomendManagerId: this._checkObjectValue(
          this.projectForm.get('recomendationName').value,
          'Id',
        ),
        recomendISGId: this._checkObjectValue(
          this.projectForm.get('recomendationNameISG').value,
          'Id',
        ),
        saleTypeId: this._checkObjectValue(
          this.projectForm.get('salesType').value,
          'Id',
        ),
        projectTypeId: this._checkObjectValue(
          this.projectForm.get('projectType').value,
          'Id',
        ),
        projectTaskId: this._checkObjectValue(
          this.projectForm.get('projectTask').value,
          'Id',
        ),
        projectDuration: this.projectForm.get('projectDuration').value,
        saleId: this._checkObjectValue(
          this.projectForm.get('sale').value,
          'Id',
        ),
        pmId: this._checkObjectValue(this.projectForm.get('pm').value, 'Id'),
        budgetForClient: this.projectForm.get('clientBudget').value,
        budget: this.projectForm.get('expenseBudget').value,
        payMethodId: this._checkObjectValue(
          this.projectForm.get('paymentMethod').value,
          'Id',
        ),

        ifbudgetId: this._checkObjectValue(
          this.projectForm.get('ifBudget').value,
          'Id',
        ),
        komisionerId: this._checkObjectValue(
          this.projectForm.get('komisioner').value,
          'Id',
        ),
        typecomisionId: this._checkObjectValue(
          this.projectForm.get('typeComision').value,
          'Id',
        ),

        formpaymentId: this._checkObjectValue(
          this.projectForm.get('formMethod').value,
          'Id',
        ),
        harprodjectId: this._checkObjectValue(
          this.projectForm.get('harProdject').value,
          'Id',
        ),
        datepartyId: this._checkObjectValue(
          this.projectForm.get('dateParty').value,
          'Id',
        ),
        levelcompanyId: this.projectForm
          .get('levelCompany')
          .value.map((ell) => ell.Id),
        motivpartyId: this._checkObjectValue(
          this.projectForm.get('motivParty').value,
          'Id',
        ),
        vovlechpartyId: this._checkObjectValue(
          this.projectForm.get('vovlechParty').value,
          'Id',
        ),
        activpartyId: this._checkObjectValue(
          this.projectForm.get('activParty').value,
          'Id',
        ),
        openspartyId: this._checkObjectValue(
          this.projectForm.get('opensParty').value,
          'Id',
        ),
        bizkontentId: this._checkObjectValue(
          this.projectForm.get('bizKontent').value,
          'Id',
        ),
        scenariypartyId: this._checkObjectValue(
          this.projectForm.get('scenariyParty').value,
          'Id',
        ),
        lifeexpeId: this._checkObjectValue(
          this.projectForm.get('lifeExpe').value,
          'Id',
        ),
        typecontractId: this._checkObjectValue(
          this.projectForm.get('typeContract').value,
          'Id',
        ),

        countryId: this._checkObjectValue(
          this.projectForm.get('country').value,
          'Id',
        ),
        countParticipants: this.projectForm.get('participantCount').value,
        countParticipantsF: this.projectForm.get('participantCountF').value,
        clientDepartmentId: this._checkObjectValue(
          this.projectForm.get('clientDepartment').value,
          'Id',
        ),
        clientFilialId: this._checkObjectValue(
          this.projectForm.get('clientFilial').value,
          'Id',
        ),
        clientMainManagerId: this._checkObjectValue(
          this.projectForm.get('mainClientManager').value,
          'Id',
        ),
        customerDepartmentId: this._checkObjectValue(
          this.projectForm.get('customerDepartment').value,
          'Id',
        ),
        customerFilialId: this._checkObjectValue(
          this.projectForm.get('customerFilial').value,
          'Id',
        ),
        customerMainManagerId: this._checkObjectValue(
          this.projectForm.get('mainCustomerManager').value,
          'Id',
        ),
        departMentId: this._checkObjectValue(
          this.projectForm.get('department').value,
          'Id',
        ),
        customerLegalPersonId: this._checkObjectValue(
          this.projectForm.get('mainCustomerLegalPerson').value,
          'Id',
        ),
        clientLegalPersonId: this._checkObjectValue(
          this.projectForm.get('mainClientLegalPerson').value,
          'Id',
        ),
        legalPersonISGId: this._checkObjectValue(
          this.projectForm.get('legalPersonISG').value,
          'id',
        ),
        customerClosingDocuments: this._checkObjectValue(
          this.projectForm.get('customerClosingDocuments').value,
          'Id',
        ),
        clientClosingDocuments: this._checkObjectValue(
          this.projectForm.get('clientClosingDocuments').value,
          'Id',
        ),
        typeDateParty: this._checkObjectValue(
          this.projectForm.get('typeDateParty').value,
          'Id',
        ),
        opSale: opSaleEmployee ? JSON.stringify(opSaleEmployee) : null,
        op: opEmployee ? JSON.stringify(opEmployee) : null,
        opClient: opClientEmployee ? JSON.stringify(opClientEmployee) : null,
        opCustomer: opCustomerEmployee
          ? JSON.stringify(opCustomerEmployee)
          : null,
        subcontractors: subs ? JSON.stringify(subs) : null,
        taskProjectComment: this.projectForm.get('taskProjectComment').value,
        requestDate: this.projectForm.get('requestDate').value,
        projectFinishDate: this.projectForm.get('submissionDate').value,
        projectDate: projectDate,
        number: this.projectForm.get('number').value,
        commentStatus: this.projectForm.get('commentStatus').value,
        commentCyclicity: this.projectForm.get('commentCyclicity').value,
        commentZones: this.projectForm.get('commentZones').value,
        commentIndOut: this.projectForm.get('commentIndOut').value,
        commentLevelCompany: this.projectForm.get('commentLevelCompany').value,
        commentBizKontent: this.projectForm.get('commentBizKontent').value,
        commentScenariyParty: this.projectForm.get('commentScenariyParty')
          .value,
        commentLifeExpe: this.projectForm.get('commentLifeExpe').value,
        commentRecomendManager: this.projectForm.get('commentRecomendManager')
          .value,
        commissionNumber: this.projectForm.get('commissionNumber').value,
        commentCommission: this.projectForm.get('commentCommission').value,
        departmentInvolved: this.projectForm.get('departmentInvolved').value,
        payDate: payDate,
        timetable: JSON.stringify(timetables),
        singleParty: singleDate,
        multiDatePartyPause: multiDatePause,
        seriesParty: seriesDate,
        multiDateParty: multiDate,
        commentFormatProject: this.projectForm.get('commentFormatProject')
          .value,
        commentSetFormatProject: this.projectForm.get('commentSetFormatProject')
          .value,
        vip: this.projectForm.get('vipParty').value,
        comment: this.projectForm.get('commentParty').value,
        nacionpartyId: this.projectForm
          .get('nacionParty')
          .value.map((ell) => ell.Id),
        taskprojectId: this.projectForm
          .get('taskProject')
          .value.map((ell) => ell.Id),
        langpartyId: this.projectForm
          .get('langParty')
          .value.map((ell) => ell.Id),
        cityId: this.projectForm.get('city').value.map((ell) => ell.Id),
        setProjectFormatIds: this.projectForm
          .get('setProjectFormat')
          .value.map((ell) => ell.Id),
        formatIds: this.projectForm
          .get('projectFormat')
          .value.map((ell) => ell.Id),
        indoorOutdoorId: this.projectForm
          .get('indOut')
          .value.map((ell) => ell.Id),
        areaId: this.projectForm.get('zone').value.map((ell) => ell.Id),
      })
      .pipe(
        delay(300),
        finalize(() => (this.loading = false)),
      )
      .subscribe(
        (data) => {
          const ProjectId = this._projectId;
          const StatusId = this._checkObjectValue(
            this.projectForm.get('projectStatus').value,
            'Id',
          );
          this._projectService
            .updateProjectReminder({ProjectId, StatusId})
            .subscribe();
          this.markFormGroupPristine(this.projectForm);
          if (this.estimate) {
            const ce = {
              ...this.estimate.estimateForm.value,
              ProjectId: this._projectId,
            };
            this._projectService.addProjectCE(ce).subscribe();
          } else if (this.estimateData) {
            const ce = {
              ...this.estimateData,
              ProjectId: this._projectId,
            };
            this._projectService.addProjectCE(ce).subscribe();
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Проект сохранен',
          });
          this.isShowTask();
          this.error = '';
        },
        (error) => {
          this.validationError = undefined;
          this.error = error.error.message;
        },
      );
  }

  markFormGroupPristine(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsPristine();
    });
  }

  convertStringToDate(date, dateParty, typeDateParty?) {
    if (dateParty) {
      if (date) {
        if (typeDateParty === 2) {
          return new Date(date);
        } else {
          date = date.split(',');
          date.forEach((item, index) => {
            date[index] = new Date(item);
          });
          return date;
        }
      }
    } else {
      if (date) {
        date = date.split(',');
        date.forEach((item, index) => {
          date[index] = new Date(item);
        });
        return date;
      }
    }
  }

  converSingleStringToDate(date) {
    if (date) {
      return new Date(date);
    }
  }

  private _setProjectValues(projectInfo: object): void {
    this._projectInfo = projectInfo;
    console.log(projectInfo);
    const projectDate = this.convertStringToDate(
      projectInfo['Projectdate'],
      true,
      projectInfo['TypeDateParty'],
    );
    const payDate = this.convertStringToDate(projectInfo['PayDate'], false);
    const multiDateParty = this.convertStringToDate(
      projectInfo['MultiDateParty'],
      true,
      projectInfo['TypeDateParty'],
    );
    const singleParty = this.converSingleStringToDate(
      projectInfo['SingleParty'],
    );
    const multiDatePartyPause = this.convertStringToDate(
      projectInfo['MultiDatePartyPause'],
      true,
      projectInfo['TypeDateParty'],
    );
    const seriesDateParty = this.convertStringToDate(
      projectInfo['SeriesDateParty'],
      true,
      projectInfo['TypeDateParty'],
    );
    this.projectForm.patchValue({
      projectName: projectInfo['Name'],

      formagesKl: projectInfo['agesKl'],
      fgenderMan: projectInfo['genderMan'],
      fgenderWoman: projectInfo['genderWoman'],
      fBudgetPredlog: projectInfo['BudgetPredlog'],
      fprofitWont: projectInfo['profitWont'],
      fBudgetFact: projectInfo['BudgetFact'],
      fprofitFact: projectInfo['profitFact'],
      fprofit: projectInfo['profit'],
      fprofileKl: projectInfo['profileKl'],
      fbackgroundKl: projectInfo['backgroundKl'],
      finsider: projectInfo['insider'],
      fefficiencyKl: projectInfo['efficiencyKl'],

      pm: this.findObject(
        this.employeesList,
        'Id',
        projectInfo['ManagerProjectId'],
      )[0],
      mainProject: this.findObject(
        this.mainProjects,
        'Id',
        projectInfo['GeneralProjectId'],
      )[0],
      projectStatus: this.findObject(
        this.projectsStatuses,
        'Id',
        projectInfo['StatusId'],
      )[0],
      customer: this.findObject(
        this.companies,
        'Id',
        projectInfo['CustomerId'],
      )[0],
      client: this.findObject(this.companies, 'Id', projectInfo['ClientId'])[0],
      mainCustomerManager: this.findObject(
        this.managers,
        'Id',
        projectInfo['CustomerMainManagerId'],
      )[0],
      mainClientManager: this.findObject(
        this.managers,
        'Id',
        projectInfo['ClientMainManagerId'],
      )[0],
      participantCount: projectInfo['CountParticipants'],
      participantCountF: projectInfo['CountParticipantsF'],
      setProjectFormat: this.findObject(
        this.projectsFormats,
        'Id',
        projectInfo['SetProjectFormatIds'],
      ),
      projectFormat: this.findObject(
        this.projectsFormats,
        'Id',
        projectInfo['formatIds'],
      ),
      projectType: this.findObject(
        this.projectsTypes,
        'Id',
        projectInfo['ProjectTypeId'],
      )[0],
      recomendationName: this.findObject(
        this.recomendName,
        'Id',
        projectInfo['RecomendManagerId'],
      )[0],
      recomendationNameISG: this.findObject(
        this.recomendNameISG,
        'Id',
        projectInfo['RecomendISGId'],
      )[0],
      salesType: this.findObject(
        this.salesTypes,
        'Id',
        projectInfo['SaleTypeId'],
      )[0],
      projectTask: this.findObject(
        this.projectTasks,
        'Id',
        projectInfo['ProjectTaskId'],
      )[0],
      cyclicity: this.findObject(
        this.cyclicites,
        'Id',
        projectInfo['CyclicityId'],
      )[0],
      requestDate: projectInfo['RequestDate'],
      projectDuration: projectInfo['ProjectDuration'],
      submissionDate: projectInfo['ProjectFinishDate'],
      country: this.findObject(
        this.countries,
        'Id',
        projectInfo['CountryId'],
      )[0],
      city: this.findObject(this.cities, 'Id', projectInfo['CityId']),
      zone: this.findObject(this.zones, 'Id', projectInfo['AreaId']),
      indOut: this.findObject(
        this.indOut,
        'Id',
        projectInfo['IndoorOutdoorId'],
      ),
      clientBudget: projectInfo['BudgetForClient'],
      expenseBudget: projectInfo['Budget'],
      paymentMethod: this.findObject(
        this.paymentMethods,
        'Id',
        projectInfo['PayMethodId'],
      )[0],

      ifBudget: this.findObject(
        this.ifBudgets,
        'Id',
        projectInfo['IfbudgetId'],
      )[0],
      komisioner: this.findObject(
        this.komisioners,
        'Id',
        projectInfo['KomisionerId'],
      )[0],
      typeComision: this.findObject(
        this.typeComisions,
        'Id',
        projectInfo['TypecomisionId'],
      )[0],
      formMethod: this.findObject(
        this.formMethods,
        'Id',
        projectInfo['FormpaymentId'],
      )[0],
      harProdject: this.findObject(
        this.harProdjects,
        'Id',
        projectInfo['HarprodjectId'],
      )[0],
      dateParty: this.findObject(
        this.datePartys,
        'Id',
        projectInfo['DatepartyId'],
      )[0],
      levelCompany: this.findObject(
        this.levelCompanys,
        'Id',
        projectInfo['LevelcompanyId'],
      ),
      motivParty: this.findObject(
        this.motivPartys,
        'Id',
        projectInfo['MotivpartyId'],
      )[0],
      vovlechParty: this.findObject(
        this.vovlechPartys,
        'Id',
        projectInfo['VovlechpartyId'],
      )[0],
      activParty: this.findObject(
        this.activPartys,
        'Id',
        projectInfo['ActivpartyId'],
      )[0],
      opensParty: this.findObject(
        this.opensPartys,
        'Id',
        projectInfo['OpenspartyId'],
      )[0],
      nacionParty: this.findObject(
        this.nacionPartys,
        'Id',
        projectInfo['NacionpartyId'],
      ),
      taskProject: this.findObject(
        this.taskProjects,
        'Id',
        projectInfo['TaskprojectId'],
      ),
      langParty: this.findObject(
        this.langPartys,
        'Id',
        projectInfo['LangpartyId'],
      ),
      bizKontent: this.findObject(
        this.bizKontents,
        'Id',
        projectInfo['BizkontentId'],
      )[0],
      scenariyParty: this.findObject(
        this.scenariyPartys,
        'Id',
        projectInfo['ScenariypartyId'],
      )[0],
      lifeExpe: this.findObject(
        this.lifeExpes,
        'Id',
        projectInfo['LifeexpeId'],
      )[0],
      typeContract: this.findObject(
        this.typeContracts,
        'Id',
        projectInfo['TypecontractId'],
      )[0],
      sale: this.findObject(
        this.employeesList,
        'Id',
        projectInfo['SaleManagerId'],
      )[0],
      department: this.findObject(
        this.departments,
        'Id',
        projectInfo['DepartmentId'],
      )[0],
      legalPersonISG: this.findObject(
        this.legalPersonsISG,
        'id',
        projectInfo['LegalPersonISGId'],
      )[0],
      customerClosingDocuments: this.findObject(
        this.typeClosingDocuments,
        'Id',
        projectInfo['CustomerClosingDocuments'],
      )[0],
      clientClosingDocuments: this.findObject(
        this.typeClosingDocuments,
        'Id',
        projectInfo['ClientClosingDocuments'],
      )[0],
      typeDateParty: this.findObject(
        this.typeDatePartys,
        'Id',
        projectInfo['TypeDateParty'],
      )[0],
      commentFormatProject: projectInfo['CommentFormatProject'],
      commentSetFormatProject: projectInfo['CommentSetFormatProject'],
      taskProjectComment: projectInfo['TaskProjectComment'],
      number: projectInfo['Number'],
      vipParty: projectInfo['VIP'],
      commentParty: projectInfo['Comment'],
      commentStatus: projectInfo['CommentStatus'],
      commentCyclicity: projectInfo['CommentCyclicity'],
      commentZones: projectInfo['CommentZones'],
      commentIndOut: projectInfo['CommentIndOut'],
      commentLevelCompany: projectInfo['CommentLevelCompany'],
      commentBizKontent: projectInfo['CommentBizKontent'],
      commentScenariyParty: projectInfo['CommentScenariyParty'],
      commentLifeExpe: projectInfo['CommentLifeExpe'],
      commentRecomendManager: projectInfo['CommentRecomendManager'],
      commissionNumber: projectInfo['CommissionNumber'],
      commentCommission: projectInfo['CommentCommission'],
      departmentInvolved: projectInfo['DepartmentInvolved'],
      payDate: payDate,
      singleParty: singleParty,
      multiDatePartyPause: multiDatePartyPause,
      seriesDateParty: seriesDateParty,
      multiDateParty: multiDateParty,
      projectDate: projectDate,
    });
    projectInfo['Employee'].forEach((element) => {
      let mode;
      if (projectInfo['Employee']) {
        mode = element.Mode === 2 ? 'sale' : '';
      }
      this._setEmployeesByPosition(element, mode).subscribe(() => {
        if (!projectInfo['DepartmentInvolved']) {
          this.getDepartmentInvolved();
        }
      });
    });
    projectInfo['OPSaleEmployee'].forEach((element) => {
      this.setOPManager(element, 'sale');
    });
    projectInfo['OPEmployee'].forEach((element) => {
      this.setOPManager(element);
    });
    projectInfo['OPCustomerEmployee'].forEach((element) => {
      this.setOPManager(element, 'customer');
    });
    projectInfo['OPClientEmployee'].forEach((element) => {
      this.setOPManager(element, 'client');
    });
    // projectInfo['OPSubEmployee'].forEach(element => {
    //     this.setOPManager(element, 'sub');
    // });

    projectInfo['Subcontractor'].forEach((element, index) => {
      this.projectForm.addControl(
        'subcontractor' + index,
        new FormControl(element, Validators.required),
      );
    });

    if (this.projectForm.get('pm').value) {
      const department = this.departments.filter((res: any) => {
        if (this.projectForm.get('pm').value.DepartmentId === 1) {
          return res.Id === 70;
        } else if (this.projectForm.get('pm').value.DepartmentId === 2) {
          return res.Id === 69;
        }
      });
      this.projectForm.patchValue({
        department: department[0],
      });
    }

    if (
      this.findObject(this.projectsStatuses, 'Id', projectInfo['StatusId'])[0]
    ) {
      this._getRight(
        this._cookieService.get('PositionID'),
        this.findObject(
          this.projectsStatuses,
          'Id',
          projectInfo['StatusId'],
        )[0]['Id'],
      );
    }

    this.isShowTask();

    this.subcontractors = projectInfo['Subcontractor'];
    this.isDataAvailable = true;
  }

  addNewSubManager(item) {
    const companySelect = item.get('companySub').value;

    const dialogRef = this._matDialog.open(AddNewManagerDialogComponent, {
      width: '600px',
      height: 'auto',
      data: companySelect
        ? {
            Company: companySelect,
            isCompany: this.isCompanyCreate,
            isDepartment: this.isDepartmentCreate,
          }
        : {
            isCompany: this.isCompanyCreate,
            isDepartment: this.isDepartmentCreate,
          },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this._getAllManagers().subscribe(() => {
          this._projectService
            .getCompanyManagers(item.get('companySub').value.Id)
            .subscribe((res) => {
              this.subManager = res['message'];
              item
                .get('companySubManager')
                .setValue(res['message'][this.subManager.length - 1]);
            });
        });
      }
    });
  }

  addNewManager(field, company?, commission?) {
    let companySelect;
    if (field === 'companySubManager') {
      companySelect = this.projectForm.get('companySub').value;
    } else if (field === 'mainClientManager') {
      companySelect = this.projectForm.get('client').value;
    } else if (field === 'mainCustomerManager') {
      companySelect = this.projectForm.get('customer').value;
    }
    const dialogRef = this._matDialog.open(AddNewManagerDialogComponent, {
      width: '600px',
      height: 'auto',
      data:
        !company && companySelect
          ? {
              Company: companySelect,
              isCompany: this.isCompanyCreate,
              isDepartment: this.isDepartmentCreate,
            }
          : {
              isCompany: this.isCompanyCreate,
              isDepartment: this.isDepartmentCreate,
            },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this._getAllManagers().subscribe(() => {
          if (field === 'recomendationName') {
            this.projectForm.get(field).setValue(this.recomendName[0]);
          } else if (field === 'companySubManager') {
            this._projectService
              .getCompanyManagers(this.projectForm.get('companySub').value.Id)
              .subscribe((res) => {
                this.subManager = res['message'];
                this.projectForm
                  .get(field)
                  .setValue(res['message'][this.subManager.length - 1]);
              });
          } else if (field === 'mainClientManager') {
            this._projectService
              .getCompanyManagers(this.projectForm.get('client').value.Id)
              .subscribe((res) => {
                this.clientManager = res['message'];
                this.projectForm
                  .get(field)
                  .setValue(res['message'][this.clientManager.length - 1]);
              });
          } else if (field === 'mainCustomerManager') {
            if (commission) {
              this.projectForm.get(field).setValue(this.managers[0]);
            } else {
              this._projectService
                .getCompanyManagers(this.projectForm.get('customer').value.Id)
                .subscribe((res) => {
                  this.customerManager = res['message'];
                  this.projectForm
                    .get(field)
                    .setValue(res['message'][this.customerManager.length - 1]);
                });
            }
          }
        });
      }
    });
  }

  addNewManagerInArray(field, array, ind) {
    const dialogRef = this._matDialog.open(AddNewManagerDialogComponent, {
      width: '600px',
      height: 'auto',
      data: {
        isCompany: this.isCompanyCreate,
        isDepartment: this.isDepartmentCreate,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this._getAllManagers().subscribe(() => {
          const ops = this.projectForm.get(array) as FormArray;
          const formGroup = ops.controls[ind] as FormGroup;
          formGroup.controls[field].setValue(this.managers[0]);
        });
      }
    });
  }

  addNewSubManagerInArray(item, ind) {
    const dialogRef = this._matDialog.open(AddNewManagerDialogComponent, {
      width: '600px',
      height: 'auto',
      data: {
        isCompany: this.isCompanyCreate,
        isDepartment: this.isDepartmentCreate,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this._getAllManagers().subscribe(() => {
          const subs = item.get('opSub') as FormArray;
          const formGroup = subs.controls[ind] as FormGroup;
          formGroup.controls['opSubEmployee'].setValue(this.managers[0]);
        });
      }
    });
  }

  addNewSubLegalEntity(item) {
    const Id = item.get('companySub').value;

    const dialogRef = this._matDialog.open(AddLegalEntityView, {
      width: '600px',
      height: '430px',
      data: {CompanyId: Id},
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this._contactsService
          .getLegalEntities(item.get('companySub').value.Id)
          .subscribe((entities: any) => {
            this.subLegalPerson = entities;
            item.get('companySubLegalPerson').setValue(entities[0]);
          });
      }
    });
  }

  addNewLegalEntity(field) {
    let Id;
    if (field === 'mainClientLegalPerson') {
      Id = this.projectForm.get('client').value;
    }
    if (field === 'mainCustomerLegalPerson') {
      Id = this.projectForm.get('customer').value;
    }
    if (field === 'companySubLegalPerson') {
      Id = this.projectForm.get('companySub').value;
    }
    const dialogRef = this._matDialog.open(AddLegalEntityView, {
      width: '600px',
      height: '430px',
      data: {CompanyId: Id},
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (field === 'mainClientLegalPerson') {
          this._contactsService
            .getLegalEntities(this.projectForm.get('client').value.Id)
            .subscribe((entities: any) => {
              this.clientLegalPerson = entities;
              this.projectForm.get(field).setValue(entities[0]);
            });
        }
        if (field === 'mainCustomerLegalPerson') {
          this._contactsService
            .getLegalEntities(this.projectForm.get('customer').value.Id)
            .subscribe((entities: any) => {
              this.customerLegalPerson = entities;
              this.projectForm.get(field).setValue(entities[0]);
            });
        }
        if (field === 'companySubLegalPerson') {
          this._contactsService
            .getLegalEntities(this.projectForm.get('companySub').value.Id)
            .subscribe((entities: any) => {
              this.subLegalPerson = entities;
              this.projectForm.get(field).setValue(entities[0]);
            });
        }
      }
    });
  }

  addNewSubCompany(item) {
    const dialogRef = this._matDialog.open(AddCompanyDialog, {
      width: '600px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this._getAllCompanies().subscribe(() => {
          const find = this.companiesSub.find(
            (sub) => sub['Id'] === data.insertId,
          );
          if (find) {
            item
              .get('companySub')
              .setValue(this.companiesSub[this.companiesSub.length - 1]);
          }
        });
      }
    });
  }

  addNewCompany(field) {
    const dialogRef = this._matDialog.open(AddCompanyDialog, {
      width: '600px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this._getAllCompanies().subscribe(() => {
          this.projectForm.patchValue({
            client:
              this.projectForm.get('client').value &&
              this.findObject(
                this.companies,
                'Id',
                this.projectForm.get('client').value.Id,
              )[0],
            customer:
              this.projectForm.get('customer').value &&
              this.findObject(
                this.companies,
                'Id',
                this.projectForm.get('customer').value.Id,
              )[0],
            companySub:
              this.projectForm.get('companySub').value &&
              this.findObject(
                this.companiesSub,
                'Id',
                this.projectForm.get('companySub').value.Id,
              )[0],
          });
          this.projectForm
            .get(field)
            .setValue(this.companies[this.companies.length - 1]);
        });
      }
    });
  }

  changeManager(event) {
    const department = this.departments.filter((res: any) => {
      if (event.value.DepartmentId === 1) {
        return res.Id === 70;
      } else if (event.value.DepartmentId === 2) {
        return res.Id === 69;
      }
    });
    this.projectForm.patchValue({
      department: department[0],
    });
    this.onClickGenerate();
  }

  checkProjectFormat() {
    const formats = this.projectForm
      .get('projectFormat')
      .value.find((format) => format.Id === 50);
    if (formats) {
      return true;
    }
    return false;
  }

  checkLevelCompany() {
    const levels = this.projectForm
      .get('levelCompany')
      .value.find((level) => level.Id === 4);
    if (levels) {
      return true;
    }
    return false;
  }

  checkTaskProject() {
    const taskProject = this.projectForm
      .get('taskProject')
      .value.find((level) => level.Id === 7);
    if (taskProject) {
      return true;
    }
    return false;
  }

  public onClickGenerate() {
    const projectDate = this.projectForm.get('projectDate');
    if (projectDate.value.length && !this.editable) {
      if (
        this.projectForm.get('department').valid &&
        this.projectForm.get('projectDate').value
      ) {
        const projectYear = this._datePipe.transform(
          this.projectForm.get('projectDate').value[0],
          'yyyy',
        );
        this._generateProjectNumber(
          this._checkObjectValue(
            this.projectForm.get('department').value,
            'Name',
          ),
          projectYear,
        );
      }
    }
  }

  public onClickSave(): void {
    const invalid1 = [];
    const controls = (<FormArray>this.projectForm.get('subcontractors'))
      .controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid1.push(name);
      }
    }
    console.log(controls);
    console.log(invalid1);
    const invalid2 = [];
    const controls2 = this.projectForm.controls;
    for (const name in controls2) {
      if (controls2[name].invalid) {
        invalid2.push(name);
      }
    }
    console.log(invalid2);
    if (!this.isProject) {
      return;
    }
    if (this.projectForm.valid) {
      this.loading = true;
      if (!this.editable) {
        const projectName = this.projectForm.get('projectName').value;
        const number = this.projectForm.get('number').value;
        if (this.projectForm.get('seriesDateParty').value) {
          if (this.projectForm.get('seriesDateParty').value.length > 1) {
            this.projectForm
              .get('seriesDateParty')
              .value.forEach((val, index) => {
                this._addProject(
                  projectName + '_' + index,
                  number + '_' + index,
                  val,
                );
              });
          }
        } else {
          this._addProject(projectName, number);
        }
      } else {
        this._updateProject();
      }
    } else {
      this.validationError = 'Пожалуйста заполните все поля *';
      this.submited = true;
    }
  }

  public onClickCancel(): void {
    this._router.navigate(['/projects/all-projects']);
  }

  public onClickDelete(): void {
    if (!this.isProject) {
      return;
    }
    if (this.editable) {
      const dialogRef = this._matDialog.open(ConfirmDialog, {
        width: '350px',
        panelClass: 'padding24',
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.markFormGroupPristine(this.projectForm);
          this.loading = true;
          this._deleteProjectById(this._projectId);
        }
      });
    }
  }

  private _getMainProjects(): Observable<object> {
    return this._projectService.getAllProjectsName().pipe(
      map((data: ServerResponse) => {
        this.mainProjects = data.message;
        return data.message;
      }),
    );
  }

  private _getProjectStatuses(): Observable<object> {
    return this._projectService.getAllStatuses().pipe(
      map((data: ServerResponse) => {
        this.projectsStatuses = data.message;
        return data.message;
      }),
    );
  }

  private _getAllCompanies(): Observable<object> {
    return this._projectService.getAllCompany().pipe(
      map((data: ServerResponse) => {
        this.companies = data.message;
        this.companiesSub = data.message.filter(
          (comp) => comp['Subcontractor'] === 1,
        );
        return data.message;
      }),
    );
  }

  private _getAllProjectFormats(): Observable<object> {
    return this._projectService.getAllFormatProject().pipe(
      map((data: ServerResponse) => {
        this.projectsFormats = data.message;
        return data.message;
      }),
    );
  }

  private _getAllProjectTypes(): Observable<object> {
    return this._projectService.getAllProjectTypes().pipe(
      map((data: ServerResponse) => {
        this.projectsTypes = data.message;
        return data.message;
      }),
    );
  }

  private _getAllDepartments(): Observable<object> {
    return this._projectService.getAllDepartments().pipe(
      map((data: ServerResponse) => {
        this.departments = data.message;
        return data.message;
      }),
    );
  }

  private _getAllSalesTypes(): Observable<object> {
    return this._projectService.getAllSalesTypes().pipe(
      map((data: ServerResponse) => {
        this.salesTypes = data.message;
        return data.message;
      }),
    );
  }

  private _getAllProjectTasks(): Observable<object> {
    return this._projectService.getAllProjectTask().pipe(
      map((data: ServerResponse) => {
        this.projectTasks = data.message;
        return data.message;
      }),
    );
  }

  private _getAllCyclicity(): Observable<object> {
    return this._projectService.getAllCyclicalProject().pipe(
      map((data: ServerResponse) => {
        this.cyclicites = data.message;
        return data.message;
      }),
    );
  }

  private _getAllCountries(): Observable<object> {
    return this._projectService.getAllCountries().pipe(
      map((data: ServerResponse) => {
        this.countries = data.message;
        return data.message;
      }),
    );
  }

  private _getAllCities(): Observable<object> {
    return this._projectService.getAllCities().pipe(
      map((data: ServerResponse) => {
        this.cities = data.message;
        return data.message;
      }),
    );
  }

  private _getAllZones(): Observable<object> {
    return this._projectService.getAllAreasConduct().pipe(
      map((data: ServerResponse) => {
        this.zones = data.message;
        return data.message;
      }),
    );
  }

  private _getAllIndOut(): Observable<object> {
    return this._projectService.getIndoorOutdoor().pipe(
      map((data: ServerResponse) => {
        this.indOut = data.message;
        return data.message;
      }),
    );
  }

  private _getAllPayMethods(): Observable<object> {
    return this._projectService.getAllPayMethods().pipe(
      map((data: ServerResponse) => {
        this.paymentMethods = data.message;
        return data.message;
      }),
    );
  }

  private _getAllFormMethods(): Observable<object> {
    return this._projectService.getAllFormMethods().pipe(
      map((data: ServerResponse) => {
        this.formMethods = data.message;
        return data.message;
      }),
    );
  }

  private _getAllifBudgets(): Observable<object> {
    return this._projectService.getAllifBudgets().pipe(
      map((data: ServerResponse) => {
        this.ifBudgets = data.message;
        return data.message;
      }),
    );
  }
  private _getAllkomisioners(): Observable<object> {
    return this._projectService.getAllkomisioners().pipe(
      map((data: ServerResponse) => {
        this.komisioners = data.message;
        return data.message;
      }),
    );
  }
  private _getAlltypeComisions(): Observable<object> {
    return this._projectService.getAlltypeComisions().pipe(
      map((data: ServerResponse) => {
        this.typeComisions = data.message;
        return data.message;
      }),
    );
  }
  private _getAllzoneReacts(): Observable<object> {
    return this._projectService.getAllzoneReacts().pipe(
      map((data: ServerResponse) => {
        this.zoneReacts = data.message;
        return data.message;
      }),
    );
  }
  private _getAllifContractors(): Observable<object> {
    return this._projectService.getAllifContractors().pipe(
      map((data: ServerResponse) => {
        this.ifContractors = data.message;
        return data.message;
      }),
    );
  }

  private _getAllharProdjects(): Observable<object> {
    return this._projectService.getAllharProdjects().pipe(
      map((data: ServerResponse) => {
        this.harProdjects = data.message;
        return data.message;
      }),
    );
  }
  private _getAlldatePartys(): Observable<object> {
    return this._projectService.getAlldatePartys().pipe(
      map((data: ServerResponse) => {
        this.datePartys = data.message;
        return data.message;
      }),
    );
  }
  private _getAlllevelCompanys(): Observable<object> {
    return this._projectService.getAlllevelCompanys().pipe(
      map((data: ServerResponse) => {
        this.levelCompanys = data.message;
        return data.message;
      }),
    );
  }
  private _getAllmotivPartys(): Observable<object> {
    return this._projectService.getAllmotivPartys().pipe(
      map((data: ServerResponse) => {
        this.motivPartys = data.message;
        return data.message;
      }),
    );
  }
  private _getAllvovlechPartys(): Observable<object> {
    return this._projectService.getAllvovlechPartys().pipe(
      map((data: ServerResponse) => {
        this.vovlechPartys = data.message;
        return data.message;
      }),
    );
  }
  private _getAllactivPartys(): Observable<object> {
    return this._projectService.getAllactivPartys().pipe(
      map((data: ServerResponse) => {
        this.activPartys = data.message;
        return data.message;
      }),
    );
  }
  private _getAllopensPartys(): Observable<object> {
    return this._projectService.getAllopensPartys().pipe(
      map((data: ServerResponse) => {
        this.opensPartys = data.message;
        return data.message;
      }),
    );
  }
  private _getAllnacionPartys(): Observable<object> {
    return this._projectService.getAllnacionPartys().pipe(
      map((data: ServerResponse) => {
        this.nacionPartys = data.message;
        return data.message;
      }),
    );
  }
  private _getAlllangPartys(): Observable<object> {
    return this._projectService.getAlllangPartys().pipe(
      map((data: ServerResponse) => {
        this.langPartys = data.message;
        return data.message;
      }),
    );
  }
  private _getAlltaskProjects(): Observable<object> {
    return this._projectService.getAlltaskProjects().pipe(
      map((data: ServerResponse) => {
        this.taskProjects = data.message;
        return data.message;
      }),
    );
  }
  private _getAllbizKontents(): Observable<object> {
    return this._projectService.getAllbizKontents().pipe(
      map((data: ServerResponse) => {
        this.bizKontents = data.message;
        return data.message;
      }),
    );
  }
  private _getAllscenariyPartys(): Observable<object> {
    return this._projectService.getAllscenariyPartys().pipe(
      map((data: ServerResponse) => {
        this.scenariyPartys = data.message;
        return data.message;
      }),
    );
  }
  private _getAlllifeExpes(): Observable<object> {
    return this._projectService.getAlllifeExpes().pipe(
      map((data: ServerResponse) => {
        this.lifeExpes = data.message;
        return data.message;
      }),
    );
  }
  private _getAlltypeContracts(): Observable<object> {
    return this._projectService.getAlltypeContracts().pipe(
      map((data: ServerResponse) => {
        this.typeContracts = data.message;
        return data.message;
      }),
    );
  }

  private _getAllManagers(): Observable<object> {
    return this._projectService.getAllManager().pipe(
      map((data: ServerResponse) => {
        this.managers = data.message;
        this.recomendName = this.managers;
        return data.message;
      }),
    );
  }

  private _getAllSubcontractors(): Observable<object> {
    return this._projectService.getAllSubcontractor().pipe(
      map((data: ServerResponse) => {
        this.subcontractorsList = data.message;
        return data.message;
      }),
    );
  }

  private _getAllEmployees(): Observable<object> {
    return this._projectService.getAllEmployee().pipe(
      map((data: ServerResponse) => {
        this.employeesList = data.message;
        this.recomendNameISG = data.message;
        return data.message;
      }),
    );
  }

  /**
   *
   * @param positionId
   * @param statusId
   */
  private _getRight(positionId: string, statusId: number) {
    return this._configurationService
      .getOneRigths(positionId, statusId)
      .subscribe((res) => {
        if (res['message'].length !== 0) {
          this.fiedsFunctionality = res['message'][0].Rights.Functionality;
          this.setValidators();
          if (this._projectId) {
            this._projectInfo['BudgetPredlogs'].forEach((element) => {
              this.setBudgetPredlog(element);
            });
            this.setTimetable(this._projectInfo['Timetable']);
            this.addSubcontractor(this._projectInfo['Subcontractors']);
          }
        }
        this.loading = false;
      });
  }

  private _deleteEmployeeById(projectId: number, employeeId: number): void {
    this._projectService.deleteEmployee(projectId, employeeId).subscribe(
      () => {},
      (error) => {
        this.error = error.error.message;
      },
    );
  }

  private _deleteSubcontractorById(
    projectId: number,
    subcontractorId: number,
  ): void {
    this._projectService
      .deleteProjectSubcontractor(projectId, subcontractorId)
      .subscribe(
        () => {},
        (error) => {
          this.error = error.error.message;
        },
      );
  }

  private _deleteManagerById(
    projectId: number,
    managerId: number,
    comapnyId: number,
  ): void {
    this._projectService
      .deleteCompanyManager(projectId, managerId, comapnyId)
      .subscribe(
        () => {},
        (error) => {
          this.error = error.error.message;
        },
      );
  }

  private _deleteProjectById(projectId: number): void {
    this._projectService.deleteProject(projectId).subscribe(
      () => {
        this.loading = false;
        this._router.navigate(['/projects/all-projects']);
      },
      (error) => {
        this.error = error.error.message;
        this.loading = false;
      },
    );
  }

  private _getTasks() {
    this._taskService
      .getBoard(this._projectId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res: IColumn[]) => {
        this.boards = res;
        this._filterTasks();
      });
  }

  private _getFiles() {
    this._projectService
      .getFiles(this._projectId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => (this.files = res['message']));
  }

  private _filterTasks() {
    this.tasks = [];
    this.boards.forEach((column) => {
      if (column.id !== 16) {
        this.tasks.push(...column.tasks);
      }
    });
  }

  private _getAllLegalPersonISG() {
    return this._configurationService.getAllLegalPersonISG().pipe(
      map((data) => {
        this.legalPersonsISG = data['message'];
        return data;
      }),
    );
  }

  private _getAllRolesISG() {
    return this._projectService.getAllRolesISG().pipe(
      map((data) => {
        this.rolesISG = data['message'];
        return data;
      }),
    );
  }

  private _getAllRolesManager() {
    return this._projectService.getAllRolesManager().pipe(
      map((data) => {
        this.rolesManagers = data['message'];
        return data;
      }),
    );
  }

  private _getRightsAccess(Id) {
    return this._configurationService.getRightsAccess(Id).pipe(
      map((res) => {
        const generalPosition = [16, 17, 22, 14];
        if (generalPosition.includes(Number(this.positionId))) {
          this.isCompanyCreate = true;
          this.isDepartmentCreate = true;
          this.isManagerCreate = true;
          this.isProject = true;
        } else {
          if (res['message'][0].Rights) {
            this.isCompanyCreate = res['message'][0].Rights.isCompanyCreate;
            this.isDepartmentCreate =
              res['message'][0].Rights.isDepartmentCreate;
            this.isManagerCreate = res['message'][0].Rights.isManagerCreate;
            this.isProject = res['message'][0].Rights.isProject;
          } else {
            this.isCompanyCreate = false;
            this.isDepartmentCreate = false;
            this.isManagerCreate = false;
            this.isProject = false;
          }
        }
      }),
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  dateParty(startDate: string, endDate: string): {[key: string]: any} {
    return (group: FormGroup): {[key: string]: any} => {
      const start = group.controls[startDate];
      const end = group.controls[endDate];
      if (start.value > end.value) {
        return {
          dateInvalid: true,
        };
      }
      return null;
    };
  }
}

export interface IFile {
  name: string;
  url: string;
}

// [
//     {
//         ZoneReactId: 1,
//         SubcontractorId: 1,
//         CompanyId: 1,
//         LegalPersonId: 1,
//         ManagerId: 1,
//         OPManagers: [],
//     }
// ]
