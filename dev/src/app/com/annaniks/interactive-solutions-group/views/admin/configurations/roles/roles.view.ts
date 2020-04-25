import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import {AppService, MenuService} from '../../../../services';
import {map, takeUntil} from 'rxjs/operators';
import {ConfigurationService} from '../configuration.service';
import {Subject} from 'rxjs';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'roles',
  templateUrl: 'roles.view.html',
  styleUrls: ['roles.view.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RolesView implements OnInit, OnDestroy, AfterContentChecked {
  selectedPosition;
  positionEmployee: any[];
  projectStatus: any[];
  public menuList: Array<object>;
  dataSource: any[];
  arrayGeneralInfo: any[] = [];
  arrayDateArea: any[] = [];
  arrayMembers: any[] = [];
  arrayTaskProject: any[] = [];
  arrayEmployer: any[] = [];
  arrayClient: any[] = [];
  arrayComission: any[] = [];
  arrayBudjet: any[] = [];
  arraySubcontractor: any[] = [];
  fieldsProject: any[] = [];
  employees: any[] = [];
  loading = false;
  posEmployee;
  employee;
  projStatus;
  employeeRightsTemplate = {
    isConfigurator: false,
    isProjectCreate: false,
    isProject: false,
    isCompanyCreate: false,
    isCompany: false,
    isDepartmentCreate: false,
    isDepartment: false,
    isManagerCreate: false,
    isManager: false,
    isTrip: false,
    isProcess: false,
    isVacation: false,
    isDayOff: false,
    isFinanceVisible: false,
    isFinanceEditable: false,
    isFinanceDeleting: false,
  };
  employeeRights = {};

  private destroy$ = new Subject();

  constructor(
    private _menuService: MenuService,
    public appService: AppService,
    private _configurationService: ConfigurationService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.menuList = _menuService.getPages();
  }

  ngOnInit(): void {
    this._getPositionEmployee();
    this._getProjectStatus();
    this._getAllEmployee();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  onChange() {
    if (this.posEmployee && this.projStatus) {
      this.selectedPosition = this.posEmployee;
      this._getSelectedPosition(this.posEmployee, this.projStatus);
    }
  }

  selectEmploee(event) {
    this._getRightsAccess(event.value.Id);
  }

  onChangeCheckbox(ell) {
    ell.Value = !ell.Value;
  }

  saveEmployeeRights() {
    this.loading = true;
    this._configurationService
      .saveRightsAccess({
        Rights: this.employeeRights,
        Id: this.employee.Id,
      })
      .subscribe(() => {
        setTimeout(() => (this.loading = false), 1000);
      });
  }

  onClickSave(e) {
    this.loading = true;
    const objOnSave = {Position: this.posEmployee, Status: this.projStatus};
    const functionality = [
      ...this.arrayGeneralInfo,
      ...this.arrayDateArea,
      ...this.arrayMembers,
      ...this.arrayTaskProject,
      ...this.arrayEmployer,
      ...this.arrayClient,
      ...this.arrayComission,
      ...this.arrayBudjet,
      ...this.arraySubcontractor,
    ];
    objOnSave['Rights'] = {Functionality: functionality};
    this._setRights(objOnSave);
  }

  private _getPositionEmployee() {
    return this._configurationService
      .getPositionEmployee()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.positionEmployee = res['message']));
  }

  private _getProjectStatus() {
    return this._configurationService
      .getStatusProject()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.projectStatus = res['message']));
  }

  changeVisible(fields) {
    if (fields.isVisible === false) {
      fields.isEditable = false;
      fields.isRequired = false;
    }
  }

  private _getSelectedPosition(position, status) {
    this.arrayGeneralInfo = [];
    this.arrayDateArea = [];
    this.arrayMembers = [];
    this.arrayTaskProject = [];
    this.arrayEmployer = [];
    this.arrayClient = [];
    this.arrayComission = [];
    this.arrayBudjet = [];
    this.arraySubcontractor = [];
    return this._configurationService
      .getOneRigths(position.Id, status.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res['message'].length !== 0) {
          const availableFunctionality: any[] =
            res['message'][0]['Rights']['Functionality'];
          availableFunctionality.forEach((item, index) => {
            if (item.section === 'generalInfo') {
              this.arrayGeneralInfo.push(item);
            }
            if (item.section === 'dateArea') {
              this.arrayDateArea.push(item);
            }
            if (item.section === 'members') {
              this.arrayMembers.push(item);
            }
            if (item.section === 'taskProject') {
              this.arrayTaskProject.push(item);
            }
            if (item.section === 'employer') {
              this.arrayEmployer.push(item);
            }
            if (item.section === 'client') {
              this.arrayClient.push(item);
            }
            if (item.section === 'commission') {
              this.arrayComission.push(item);
            }
            if (item.section === 'budjet') {
              this.arrayBudjet.push(item);
            }
            if (item.section === 'subcontractor') {
              this.arraySubcontractor.push(item);
            }
          });
          this.arrayGeneralInfo = this.checkTwoArray(
            generalInfo,
            this.arrayGeneralInfo,
          );
          this.arrayDateArea = this.checkTwoArray(dateArea, this.arrayDateArea);
          this.arrayMembers = this.checkTwoArray(members, this.arrayMembers);
          this.arrayTaskProject = this.checkTwoArray(
            taskProject,
            this.arrayTaskProject,
          );
          this.arrayEmployer = this.checkTwoArray(employer, this.arrayEmployer);
          this.arrayClient = this.checkTwoArray(client, this.arrayClient);
          this.arrayComission = this.checkTwoArray(
            commission,
            this.arrayComission,
          );
          this.arrayBudjet = this.checkTwoArray(budjet, this.arrayBudjet);
          this.arraySubcontractor = this.checkTwoArray(
            subcontractor,
            this.arraySubcontractor,
          );
          this.fieldsProject = [
            {
              tabName: 'Информация',
              cardName1: 'Основная информация',
              cardName2: 'Дата и место проведения',
              fields1: [...this.arrayGeneralInfo],
              fields2: [...this.arrayDateArea],
            },
            {
              tabName: 'Задача проекта',
              cardName1: 'Участники',
              cardName2: 'Задачи проекта и дополнительные вводны',
              fields1: [...this.arrayMembers],
              fields2: [...this.arrayTaskProject],
            },
            {
              tabName: 'Форма продажи',
              cardName1: 'Заказчик',
              cardName2: 'Клиент',
              cardName3: 'Комиссионер',
              fields1: [...this.arrayEmployer],
              fields2: [...this.arrayClient],
              fields3: [...this.arrayComission],
            },
            {
              tabName: 'Бюджет и оплата',
              cardName1: 'Бюджет',
              fields1: [...this.arrayBudjet],
            },
            {
              tabName: 'Подрядчик',
              cardName1: 'Подрядчик',
              fields1: [...this.arraySubcontractor],
            },
          ];
        } else {
          this.setArray(generalInfo, this.arrayGeneralInfo);
          this.setArray(dateArea, this.arrayDateArea);
          this.setArray(members, this.arrayMembers);
          this.setArray(taskProject, this.arrayTaskProject);
          this.setArray(employer, this.arrayEmployer);
          this.setArray(client, this.arrayClient);
          this.setArray(commission, this.arrayComission);
          this.setArray(budjet, this.arrayBudjet);
          this.setArray(subcontractor, this.arraySubcontractor);
          this.fieldsProject = [
            {
              tabName: 'Информация',
              cardName1: 'Основная информация',
              cardName2: 'Дата и место проведения',
              fields1: [...this.arrayGeneralInfo],
              fields2: [...this.arrayDateArea],
            },
            {
              tabName: 'Задача проекта',
              cardName1: 'Участники',
              cardName2: 'Задачи проекта и дополнительные вводны',
              fields1: [...this.arrayMembers],
              fields2: [...this.arrayTaskProject],
            },
            {
              tabName: 'Форма продажи',
              cardName1: 'Заказчик',
              cardName2: 'Клиент',
              cardName3: 'Комиссионер',
              fields1: [...this.arrayEmployer],
              fields2: [...this.arrayClient],
              fields3: [...this.arrayComission],
            },
            {
              tabName: 'Бюджет и оплата',
              cardName1: 'Бюджет',
              fields1: [...this.arrayBudjet],
            },
            {
              tabName: 'Подрядчик',
              cardName1: 'Подрядчик',
              fields1: [...this.arraySubcontractor],
            },
          ];
        }
      });
  }

  checkIndeterminate(fields, props) {
    const array = fields.map(field => field[props]);
    return array.every(v => v === array[0]);
  }

  checked(fields, props) {
    const same = this.checkIndeterminate(fields, props);
    if (same) {
      return fields[0][props];
    }
  }

  changeCheck(fields, props) {
    const isIndeterminate = this.checkIndeterminate(fields, props);
    if (!isIndeterminate) {
      fields.forEach(field => {
        field[props] = true;
      });
    } else {
      fields.forEach(field => {
        field[props] = !field[props];
      });
    }
  }

  checkIsVisible(fields) {
    const array = fields.map(field => field['isVisible']);
    const flag = array.every(v => v === false);
    if (flag) {
      fields.forEach(item => {
        item['isRequired'] = false;
        item['isEditable'] = false;
      });
    }
    return flag;
  }

  convertArraySection(company) {
    let array = [];
    if (company.fields1) {
      array = array.concat(company.fields1);
    }
    if (company.fields2) {
      array = array.concat(company.fields2);
    }
    if (company.fields3) {
      array = array.concat(company.fields3);
    }
    return array;
  }

  checkIndeterminateSection(company, props) {
    const array = this.convertArraySection(company);
    const arr = array.map(field => field[props]);
    return arr.every(v => v === arr[0]);
  }

  checkedSection(company, props) {
    const array = this.convertArraySection(company);
    const same = this.checkIndeterminateSection(company, props);
    if (same) {
      return array[0][props];
    }
  }

  changeCheckSection(company, props) {
    const array = this.convertArraySection(company);
    const isIndeterminate = this.checkIndeterminateSection(company, props);
    if (!isIndeterminate) {
      array.forEach(field => {
        field[props] = true;
      });
    } else {
      array.forEach(field => {
        field[props] = !field[props];
      });
    }
  }

  checkIsVisibleSection(company) {
    const array = this.convertArraySection(company);
    const arr = array.map(field => field['isVisible']);
    const flag = arr.every(v => v === false);
    if (flag) {
      array.forEach(item => {
        item['isRequired'] = false;
        item['isEditable'] = false;
      });
    }
    return flag;
  }

  checkIndeterminateGeneral() {
    let array = [];
    this.fieldsProject.forEach(item => {
      array = array.concat(this.convertArraySection(item));
    });
    const arrIsVisible = array.map(field => field['isVisible']);
    const arrIsEditable = array.map(field => field['isEditable']);
    const arrIsRequired = array.map(field => field['isRequired']);
    const flagIsVisible = arrIsVisible.every(v => v === arrIsVisible[0]);
    const flagIsEditable = arrIsEditable.every(v => v === arrIsEditable[0]);
    const flagIsRequired = arrIsRequired.every(v => v === arrIsRequired[0]);
    const arrayFlag = [flagIsVisible, flagIsEditable, flagIsRequired];
    return arrayFlag.every(v => v === arrayFlag[0]);
  }

  checkIndeterminateGeneralCol(props) {
    let array = [];
    this.fieldsProject.forEach(item => {
      array = array.concat(this.convertArraySection(item));
    });
    const arrProps = array.map(field => field[props]);
    const flagProps = arrProps.every(v => v === arrProps[0]);
    return flagProps;
  }

  checkedGeneral() {
    let array = [];
    this.fieldsProject.forEach(item => {
      array = array.concat(this.convertArraySection(item));
    });
    const same = this.checkIndeterminateGeneral();
    if (same && this.fieldsProject.length) {
      return (
        array[0]['isVisible'] ||
        array[0]['isRequired'] ||
        array[0]['isEditable']
      );
    }
  }

  checkedGeneralCol(props) {
    let array = [];
    this.fieldsProject.forEach(item => {
      array = array.concat(this.convertArraySection(item));
    });
    const same = this.checkIndeterminateGeneralCol(props);
    if (same && this.fieldsProject.length) {
      return array[0][props];
    }
  }

  changeCheckGeneral() {
    let array = [];
    this.fieldsProject.forEach(item => {
      array = array.concat(this.convertArraySection(item));
    });
    const isIndeterminate = this.checkIndeterminateGeneral();
    if (!isIndeterminate) {
      array.forEach(field => {
        field['isVisible'] = true;
        field['isEditable'] = true;
        field['isRequired'] = true;
      });
    } else {
      array.forEach(field => {
        field['isVisible'] = !field['isVisible'];
        field['isEditable'] = !field['isEditable'];
        field['isRequired'] = !field['isRequired'];
      });
    }
  }

  changeCheckGeneralCol(props) {
    let array = [];
    this.fieldsProject.forEach(item => {
      array = array.concat(this.convertArraySection(item));
    });
    const isIndeterminate = this.checkIndeterminateGeneralCol(props);
    if (!isIndeterminate) {
      array.forEach(field => {
        field[props] = true;
      });
    } else {
      array.forEach(field => {
        field[props] = !field[props];
      });
    }
    this.cdRef.detectChanges();
  }

  checkIsVisibleGeneral() {
    let array = [];
    this.fieldsProject.forEach(item => {
      array = array.concat(this.convertArraySection(item));
    });
    const arr = array.map(field => field['isVisible']);
    const flag = arr.every(v => v === false);
    if (flag) {
      array.forEach(item => {
        item['isRequired'] = false;
        item['isEditable'] = false;
      });
    }
    let returnFlag = false;
    arr.map(item => {
      if (!item) {
        returnFlag = true;
      }
    });
    return returnFlag;
  }

  checkTwoArray(constArray, array) {
    constArray.forEach(item => {
      const find = array.find(res => res.key === item.key);
      if (find) {
        item.isRequired = find.isRequired;
        item.isVisible = find.isVisible;
        item.isEditable = find.isEditable;
      }
    });
    return constArray;
  }

  setArray(array, setArray) {
    array.forEach(item => {
      setArray.push(item);
    });
  }

  private _setRights(data) {
    return this._configurationService
      .saveRights(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() =>
        setTimeout(() => {
          this.loading = false;
        }, 1000),
      );
  }

  private _getAllEmployee() {
    this._configurationService.getAllEmployee().subscribe(res => {
      const generalPosition = [16, 17, 22, 14];
      this.employees = res['message'];
      this.employees = this.employees.filter(
        employee => !generalPosition.includes(employee.PositionId),
      );
    });
  }

  private _getRightsAccess(Id) {
    this._configurationService.getRightsAccess(Id).subscribe(res => {
      if (res['message'][0].Rights) {
        this.employeeRights = {
          ...this.employeeRightsTemplate,
          ...res['message'][0].Rights,
        };
      } else {
        this.employeeRights = {
          isConfigurator: false,
          isProjectCreate: false,
          isProject: false,
          isCompanyCreate: false,
          isCompany: false,
          isDepartmentCreate: false,
          isDepartment: false,
          isManagerCreate: false,
          isManager: false,
          isTrip: false,
          isProcess: false,
          isVacation: false,
          isDayOff: false,
          isFinanceVisible: false,
          isFinanceEditable: false,
          isFinanceDeleting: false,
        };
      }
    });
  }
}

const generalInfo = [
  {
    section: 'generalInfo',
    key: 'projectName',
    name: 'Название проекта',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'number',
    name: 'Номер проекта',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'projectType',
    name: 'Тип проекта',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'salesType',
    name: 'Тип продаж',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'department',
    name: 'Департамент-исполнитель',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'departmentInvolved',
    name: 'Участвующие департаменты',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'projectStatus',
    name: 'Статус проекта',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'commentStatus',
    name: 'Комментарий (Статус проекта)',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'requestDate',
    name: 'Дата запроса',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'submissionDate',
    name: 'Дата сдачи предложения',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'harProdject',
    name: 'Характер проекта',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'setProjectFormat',
    name: 'Входящий формат проекта',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
  {
    section: 'generalInfo',
    key: 'projectFormat',
    name: 'Формат проекта',
    isVisible: true,
    isEditable: true,
    isRequired: true,
  },
];

const dateArea = [
  {
    section: 'dateArea',
    key: 'dateParty',
    name: 'Серия мероприятий',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'dateArea',
    key: 'cyclicity',
    name: 'Цикличность',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'dateArea',
    key: 'timetable',
    name: 'Расписание',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'dateArea',
    key: 'country',
    name: 'Страна проведения',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'dateArea',
    key: 'city',
    name: 'Город проведения',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'dateArea',
    key: 'zone',
    name: 'Зона проведения',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'dateArea',
    key: 'indOut',
    name: 'Место проведения',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
];

const members = [
  {
    section: 'members',
    key: 'participantCount',
    name: 'Количество участников план',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'participantCountF',
    name: 'Количество участников факт',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'fgender',
    name: 'Гендерное соотношение М и Ж',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'formagesKl',
    name: 'Средний возраст',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'fprofileKl',
    name: 'Профиль деятельности аудиториит',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'levelCompany',
    name: 'Уровень в компании',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'fbackgroundKl',
    name: 'Бэкграунд',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'motivParty',
    name: 'Мотивация',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'vovlechParty',
    name: 'Вовлеченность',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'activParty',
    name: 'Активность',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'opensParty',
    name: 'Открытость',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'nacionParty',
    name: 'Национальность',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'langParty',
    name: 'Язык',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'vipParty',
    name: 'Наличие VIP-бенифициара',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'members',
    key: 'commentParty',
    name: 'Комментарий (VIP)',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
];

const taskProject = [
  {
    section: 'taskProject',
    key: 'taskProject',
    name: 'Задачи проекта',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'taskProject',
    key: 'bizKontent',
    name: 'Бизнес-контент',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'taskProject',
    key: 'scenariyParty',
    name: 'Сценарий',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'taskProject',
    key: 'lifeExpe',
    name: 'Life-experience',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'taskProject',
    key: 'finsider',
    name: 'Инсайт',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'taskProject',
    key: 'fefficiencyKl',
    name: 'Как оценивать эффективность проекта',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
];

const budjet = [
  {
    section: 'budjet',
    key: 'ifBudget',
    name: 'Бюджет',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'clientBudget',
    name: 'Размер бюджета',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'fBudgetPredlog',
    name: 'Бюджет предложение',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'fprofitWont',
    name: 'Ожидаемая прибыль',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'fBudgetFact',
    name: 'Бюджет факт',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'fprofitFact',
    name: 'Прибыль факт',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'paymentMethod',
    name: 'Способ оплаты',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'formMethod',
    name: 'Форма оплаты',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'payDate',
    name: 'Дата оплаты',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'typeContract',
    name: 'Тип договора',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'budjet',
    key: 'legalPersonISG',
    name: 'Юридическое лицо ISG',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
];

const employer = [
  {
    section: 'employer',
    key: 'customer',
    name: 'Название компании',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'employer',
    key: 'mainCustomerLegalPerson',
    name: 'Юридическое лицо',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'employer',
    key: 'mainCustomerManager',
    name: 'Операционные менеджеры',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'employer',
    key: 'customerClosingDocuments',
    name: 'Наличие закрывающих документов',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
];

const client = [
  {
    section: 'client',
    key: 'client',
    name: 'Название компании',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'client',
    key: 'mainClientLegalPerson',
    name: 'Юридическое лицо',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'client',
    key: 'mainClientManager',
    name: 'Операционные менеджеры',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'client',
    key: 'clientClosingDocuments',
    name: 'Наличие закрывающих документов',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
];

const commission = [
  {
    section: 'commission',
    key: 'komisioner',
    name: 'Комиссионер',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'commission',
    key: 'customer',
    name: 'Название компании',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'commission',
    key: 'mainCustomerLegalPerson',
    name: 'Юридическое лицо',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'commission',
    key: 'mainCustomerManager',
    name: 'Менеджер',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'commission',
    key: 'typeComision',
    name: 'Тип комиссии',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'commission',
    key: 'paymentMethod',
    name: 'Тип оплаты',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'commission',
    key: 'commentCommission',
    name: 'Комментарий',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
];

const subcontractor = [
  {
    section: 'subcontractor',
    key: 'zoneReact',
    name: 'Зона ответственности',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'subcontractor',
    key: 'ifContractor',
    name: 'Подрядчик',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'subcontractor',
    key: 'companySub',
    name: 'Компания',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'subcontractor',
    key: 'companySubLegalPerson',
    name: 'Юридическое лицо',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'subcontractor',
    key: 'companySubManager',
    name: 'Операционный менеджер',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
  {
    section: 'subcontractor',
    key: 'subClosingDocuments',
    name: 'Наличие закрывающих документов',
    isVisible: true,
    isRequired: true,
    isEditable: true,
  },
];
