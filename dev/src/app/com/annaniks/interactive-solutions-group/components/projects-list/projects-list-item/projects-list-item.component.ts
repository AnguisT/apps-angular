import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import {Router} from '@angular/router';
import {DatePipe, formatDate} from '@angular/common';
import {MsgService} from '../../../services/sharedata';
import {takeUntil, finalize, map} from 'rxjs/operators';
import {Subject, forkJoin} from 'rxjs';
import {DxDataGridComponent} from 'devextreme-angular';
import {DateFormatPipe} from '../../../pipe/date.format.pipe';
import {ContactsService} from '../../../views/admin/contacts/contacts.service';
import {ProjectsService} from '../../../views/admin/projects/projects.service';
import {CookieService} from 'angular2-cookie';
import {ConfigurationService} from '../../../views/admin/configurations/configuration.service';
import {locale, loadMessages} from 'devextreme/localization';
import {ruMessage} from '../../../shared/localize';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {ExportService} from '../../../services/export.service';

@Component({
  selector: 'projects-list-item',
  templateUrl: 'projects-list-item.component.html',
  styleUrls: ['projects-list-item.component.css'],
})
export class ProjectsListItemComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  @Input() item;
  public dataSource;
  public loading = true;
  public isHidden = true;
  public timer;
  public projectsReminder;
  public PositionID;
  public employees;
  public valuesReminder;
  public valueReminder;
  defaultVisible = false;
  cards;
  months = [
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

  private _baseUrl: string = 'https://crm.i-s-group.ru:3000/static/';
  private _destroy$ = new Subject();

  constructor(
    private _router: Router,
    private _datePipe: DatePipe,
    private data: MsgService,
    private _cookieService: CookieService,
    private _projectsService: ProjectsService,
    private _configurationService: ConfigurationService,
    private _exportService: ExportService,
  ) {
    loadMessages(ruMessage);
    locale(navigator.language);
  }

  doubleClickFunction(e) {
    if (e.key && e.rowType === 'data') {
      this._router.navigate(['/projects/' + e.key + '/edit']);
    }
  }

  ngOnInit() {
    this.PositionID = Number(this._cookieService.get('PositionID'));
    this._combineObservables();
    this._exportTable();
    this.dataGrid.onContentReady.subscribe(() => {
      const target: any = document.querySelectorAll('#warning');
      const popover = document.getElementById('popover');
      const self = this;
      target.forEach((item) => {
        item.addEventListener('mouseenter', (event) => {
          const find = this.valuesReminder.find(
            (reminder) =>
              reminder.StatusName.split(' ').join('') ===
              event.target.innerText.split(' ').join(''),
          );
          if (find) {
            this.valueReminder = `${find.CountDays}`;
          } else {
            this.valueReminder = '';
          }
          self.defaultVisible = !self.defaultVisible;
          popover.setAttribute(
            'style',
            `
                    top: ${event.pageY - 100}px;
                    position: absolute;
                    width: 300px;
                    height: 70px;
                    padding: 5px;
                    text-align: center;
                    background: white;
                    border: 0.5px solid #d8d8d8;
                    border-width: 0.5px;
                    border-radius: 10px;`,
          );
        });
        item.addEventListener('mouseleave', (event) => {
          self.defaultVisible = !self.defaultVisible;
        });
      });
      this.loading = false;
    });
  }

  private _combineObservables() {
    const combined = forkJoin(
      this._getAllEmployee(),
      this._getAllProjectReminder(),
      this._getValueReminder(),
      this._getAllCards(),
    );

    combined.subscribe(() => this._getProjects());
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  calculateCellValue(data) {
    return `<div class="dx-template-wrapper">
            <div class="status-circle status-${data.StatusId}"></div>
        </div>`;
  }

  calculateStatus(data) {
    if (data.isUpdate || data.isDeadline) {
      return `<div class="dx-template-wrapper warning">
                ${
                  data.isDeadline
                    ? '<i class="material-icons icon-warning">warning</i>'
                    : ''
                }
                <span class="${
                  data.isUpdate ? 'text-warning' : 'dx-template-wrapper'
                }"
                    ${data.isUpdate ? 'id="warning"' : ''} >${
        data.StatusName
      }</span>
            </div>`;
    } else {
      return `<div class="dx-template-wrapper">${data.StatusName}</div>`;
    }
  }

  visiblePopover(event) {
    if (this.defaultVisible) {
      this.defaultVisible = true;
    } else {
      this.defaultVisible = false;
    }
  }

  onRowClick(e) {
    const expanded = e.component.isRowExpanded(e.key);
    if (!expanded) {
      e.component.expandRow(e.key);
    } else {
      e.component.collapseRow(e.key);
    }
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

  public navToManagerProfile(manager) {
    if (manager) {
      this._router.navigate(['/configurations/partner/' + manager]);
    }
  }
  public navToManagerProfileContact(manager) {
    if (manager) {
      this._router.navigate(['contacts/manager/' + manager]);
    }
  }

  public navToCompanyProfile(company) {
    if (company) {
      this._router.navigate(['contacts/companies/' + company]);
    }
  }

  public setImage(key: string): string {
    if (this.item && this.item[key]) {
      return this._baseUrl + this.item[key];
    }
    return;
  }

  generateTableData(data) {
    if (data != undefined) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].StatusId == null) {
          data[i].StatusId = 0;
        }

        if (data[i].StatusName == null) {
          data[i].StatusName = '-';
        }

        data[i]['ManagerProjectFullName'] =
          (data[i].ManagerProjectName || '') +
          ' ' +
          (data[i].ManagerProjectSurname || '');
      }
    }
    return data;
  }

  private _getProjects() {
    const generalPosition = [17, 22];
    const statusIds = [54, 56, 57];
    this.data.currentMessage
      .pipe(takeUntil(this._destroy$))
      .subscribe((message: Array<any>) => {
        if (message) {
          console.log(message);
          message.forEach((project) => {
            if (project.Projectdate) {
              const date = project.Projectdate.split(',');

              const dateProject = new Date(date[0]);
              project['EventDateMonth'] = this.months[dateProject.getMonth()];
              // project['EventDateMonth'] = dateProject.toLocaleString('default', { month: 'long' });
              project['EventDateQuarter'] = this._quarterOfTheYear(dateProject);
              project['EventDateYear'] = dateProject.getFullYear();
              if (project['TypeDateParty'] === 2) {
                project['Projectdate'] = formatDate(
                  new Date(project.Projectdate),
                  'yyyy-MM',
                  'en',
                );
              }
            }
            if (project['TypeDateParty'] === 3) {
              project['Projectdate'] = 'Не определенно';
            }
            project.CustomerClientName = project.CustomerName
              ? project.CustomerName
              : project.ClientName;
            const findProjectReminder = this.projectsReminder.find(
              (reminder) => reminder.ProjectId === project.Id,
            );
            const findValuesReminder = this.valuesReminder.find(
              (reminder) => reminder.StatusId === project.StatusId,
            );
            const findEmployee = this.employees.find(
              (employee) => employee.Id === project.ManagerProjectId,
            );
            const findTasks = this.cards.find(
              (task) =>
                task.projectId === project.Id &&
                task.statusId !== 16 &&
                task.HourDiff <= 0 &&
                task.MinuteDiff <= 0,
            );
            if (!statusIds.includes(project.StatusId)) {
              if (findProjectReminder && findValuesReminder) {
                if (findProjectReminder.Days >= findValuesReminder.CountDays) {
                  if (generalPosition.includes(this.PositionID)) {
                    project.isUpdate = true;
                  } else if (findEmployee) {
                    if (findEmployee.PositionId === this.PositionID) {
                      project.isUpdate = true;
                    }
                  } else {
                    project.isUpdate = false;
                  }
                } else {
                  project.isUpdate = false;
                }
              }
              if (findTasks) {
                if (generalPosition.includes(this.PositionID)) {
                  project.isDeadline = true;
                } else if (findEmployee) {
                  if (findEmployee.PositionId === this.PositionID) {
                    project.isDeadline = true;
                  }
                } else {
                  project.isDeadline = false;
                }
              }
            }
          });
          this.dataSource = this.generateTableData(message);
          this.loading = false;
        }
      });
  }

  private _getAllProjectReminder() {
    return this._projectsService.getAllProjectReminder().pipe(
      map((data) => {
        this.projectsReminder = data['message'];
        return data;
      }),
    );
  }

  private _getAllEmployee() {
    return this._projectsService.getAllEmployee().pipe(
      map((data) => {
        this.employees = data['message'];
        return data;
      }),
    );
  }

  private _quarterOfTheYear(date) {
    const month = date.getMonth() + 1;
    const getQuarter = Math.ceil(month / 3);
    let quarter;

    switch (getQuarter) {
      case 1:
        quarter = 'I';
        break;
      case 2:
        quarter = 'II';
        break;
      case 3:
        quarter = 'III';
        break;
      case 4:
        quarter = 'IV';
        break;
    }

    return quarter;
  }

  private _exportTable() {
    this.data.exportTable$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._projectsService.getProjectExportExcel().subscribe((data) => {
        this._exportService.exportExcel(data, 'Projects');
      });
    });
  }

  private _getValueReminder() {
    return this._configurationService.getValueReminder().pipe(
      map((data) => {
        this.valuesReminder = data['message'];
        return data;
      }),
    );
  }

  private _getAllCards() {
    return this._projectsService.getAllCards().pipe(
      map((data) => {
        console.log(data);
        this.cards = data['message'];
        return data;
      }),
    );
  }
}
