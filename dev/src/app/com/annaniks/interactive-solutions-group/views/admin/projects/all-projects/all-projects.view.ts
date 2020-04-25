import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import {ProjectsService} from '../projects.service';
import {Status} from './all-projects.models';
import {map} from 'rxjs/operators';
import {forkJoin, Subscription} from 'rxjs';
import {FormGroup, FormBuilder} from '@angular/forms';
import {CookieService} from 'angular2-cookie';
import {Router} from '@angular/router';
import {MsgService} from '../../../../services/sharedata';
import {ConfigurationService} from '../../configurations/configuration.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {EventInput} from '@fullcalendar/core';
import ruLocale from '@fullcalendar/core/locales/ru';
import moment from 'moment';

@Component({
  selector: 'all-projects',
  templateUrl: 'all-projects.view.html',
  styleUrls: ['all-projects.view.scss'],
})
export class AllProjectsView implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

  public formGroup: FormGroup;
  private _subsription: Subscription;
  public allStatuses: Array<Status> = [];
  public allCompanyTypes: Array<object> = [];
  public allPayMethods: Array<object> = [];
  public allProjectTypes: Array<object> = [];
  public allCities: Array<object> = [];
  public allCountries: Array<object> = [];
  public allEmployeeDepartments: Array<object> = [];
  public allDepartments: Array<object> = [];
  public allSphereActivity: Array<object> = [];
  public allSalesTypes: Array<object> = [];
  public allManagers: Array<object> = [];
  public allformatProject: Array<object> = [];
  public allAreasConduct: Array<object> = [];
  public allTaskProject: Array<object> = [];
  public allProjects: Array<object> = [];
  public allProjectsArray = [];
  public allCompany: Array<object> = [];
  public allEmployees: Array<object> = [];
  public allFormatByProjects: Array<object> = [];
  public projectEmployees = [];
  public indoor: Array<object> = [];
  public showFilterBar: boolean = true;
  public tender: Array<object> = [
    {
      key: 1,
      value: 'Да',
    },
    {
      key: 0,
      value: 'Нет',
    },
  ];
  dataByColor = [];
  public isProjectCreate = false;
  public Id;
  public positionId;
  public showCreateProject = true;
  public showEventCalendarTitle = false;
  public selectView = 'dayGridMonth';
  public formatProjects = [];
  public employies = [];
  public departments = [];

  public events = [];

  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  arrayLanguages = [ruLocale];

  constructor(
    private _projectsService: ProjectsService,
    private _formBuilder: FormBuilder,
    private _cookieService: CookieService,
    private _router: Router,
    private data: MsgService,
    private _configurationService: ConfigurationService,
    private cdr: ChangeDetectorRef,
  ) {
    this.Id = this._cookieService.get('Id');
    this.positionId = this._cookieService.get('PositionID');
  }

  ngOnInit() {
    this._validation();
    this._combineObservables();
    this.data.showProjects$.subscribe((data) => {
      if (data) {
        this.showCreateProject = true;
        this.showEventCalendarTitle = false;
      } else {
        this.showCreateProject = false;
        this.showEventCalendarTitle = true;
      }
    });
  }
  public logOut() {
    this._cookieService.remove('accessToken');
    this._cookieService.remove('refreshToken');
    this._router.navigate(['/login']);
  }

  private _combineObservables() {
    const combined = forkJoin(
      this._getAllStatuses(),
      this._getAllPayMethods(),
      this._getAllCompanyTypes(),
      this._getAllProjectTypes(),
      this._getAllCities(),
      this._getAllCountries(),
      this._getAllEmployeeDepartments(),
      this._getAllDepartments(),
      this._getAllSphereActivity(),
      this._getAllSalesTypes(),
      this._getAllManegers(),
      this._getAllFormatProject(),
      this._getAllAreasConduct(),
      this._getAllTaskProject(),
      this._getProjects(),
      this._getAllCompany(),
      this._getAllEmployees(),
      this._getAllIndoor(),
      this._getRightsAccess(this.Id),
      this.getProjectEmployee(),
      this._getAllFormatByProjects(),
    );
    this._subsription = combined.subscribe(() => {
      this.formatProjects = [{Id: 0, Name: 'Все'}, ...this.allformatProject];
      this.departments = [{Id: 0, Name: 'Все'}, ...this.allEmployeeDepartments];
      this.allProjects.forEach((item) => {
        this.setEvents(item);
      });
    });
  }

  private _validation() {
    this.formGroup = this._formBuilder.group({
      projectFormat: null,
      department: null,
      employee: null,
    });

    this.formGroup.valueChanges.subscribe((val) => {
      let projects = [];
      this.calendarEvents = [];

      if (val.projectFormat) {
        let filter = [];
        if (val.projectFormat.Id === 0) {
          filter = this.allFormatByProjects;
        } else {
          filter = this.allFormatByProjects.filter(
            (project) => project['FormatId'] === val.projectFormat.Id,
          );
        }
        const ids = filter.map((fil) => fil['ProjectId']);
        const array = [];
        ids.forEach((item) => {
          const find = this.allProjects.find(
            (project) => project['Id'] === item,
          );
          if (find) {
            if (!array.includes(find)) {
              array.push(find);
            }
          }
        });
        projects = [...projects, ...array];
      }

      if (val.department) {
        let findDepartment;
        if (val.department.Id === 0) {
          this.employies = [{Id: 0, FulName: 'Все'}, ...this.allEmployees];
          findDepartment = this.allDepartments;
          let filter = [];
          const ids = findDepartment.map((fil) => fil.Id);
          if (!projects.length) {
            ids.forEach((item) => {
              const find = this.allProjects.filter(
                (project) => project['DepartmentId'] === item,
              );
              if (find) {
                filter = [...filter, ...find];
              }
            });
          } else {
            ids.forEach((item) => {
              const find = projects.filter(
                (project) => project['DepartmentId'] === item,
              );
              if (find) {
                filter = [...filter, ...find];
              }
            });
          }
          console.log(filter);
          projects = [...filter];
        } else {
          this.employies = this.allEmployees.filter(
            (empl) => empl['DepartmentId'] === val.department.Id,
          );
          findDepartment = this.allDepartments.find(
            (department) => department['Name'] === val.department.Name,
          );
          if (findDepartment) {
            let filter = [];
            if (!projects.length) {
              filter = this.allProjects.filter(
                (project) => project['DepartmentId'] === findDepartment['Id'],
              );
            } else {
              filter = projects.filter(
                (project) => project['DepartmentId'] === findDepartment['Id'],
              );
            }
            projects = [...filter];
          }
        }
      }

      if (val.employee) {
        let filter = [];
        let filter1 = [];
        if (val.employee.Id === 0) {
          filter1 = this.projectEmployees;
        } else {
          filter1 = this.projectEmployees.filter(
            (empl) => empl.EmployeeId === val.employee.Id,
          );
        }
        const ids = filter1.map((fil) => fil.ProjectId);
        const array = [];
        let filter2 = [];
        if (!projects.length) {
          ids.forEach((item) => {
            const find = this.allProjects.find(
              (project) => project['Id'] === item,
            );
            if (find) {
              if (!array.includes(find)) {
                array.push(find);
              }
            }
          });
          filter2 = this.allProjects.filter(
            (proj) => proj['ManagerProjectId'] === val.employee.Id,
          );
        } else {
          ids.forEach((item) => {
            const find = projects.find((project) => project['Id'] === item);
            if (find) {
              if (!array.includes(find)) {
                array.push(find);
              }
            }
          });
          filter2 = projects.filter(
            (proj) => proj['ManagerProjectId'] === val.employee.Id,
          );
        }
        filter = [...array, ...filter2];
        projects = [...filter];
      }
      projects.forEach((item) => {
        this.setEvents(item);
      });
    });
  }

  handleDateClick(arg) {
    // if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
    //   this.calendarEvents = this.calendarEvents.concat({
    //     // add new event data. must create new array
    //     title: 'New Event',
    //     start: arg.date,
    //     allDay: arg.allDay,
    //   });
    // }
    console.log(arg);
  }

  changeView(view) {
    if (view === 'dayGridMonth') {
      this.selectView = 'dayGridMonth';
    } else if (view === 'timeGridWeek') {
      this.selectView = 'timeGridWeek';
    } else if (view === 'timeGridDay') {
      this.selectView = 'timeGridDay';
    }
    this.cdr.detectChanges();
    this.calendarComponent.getApi().render();
    this.calendarComponent.getApi().renderComponent();
  }

  setEvents(item) {
    let color;
    if (item['StatusId'] === 46) {
      color = '#ffe51d';
    } else if (
      item['StatusId'] === 47 ||
      item['StatusId'] === 48 ||
      item['StatusId'] === 49 ||
      item['StatusId'] === 50 ||
      item['StatusId'] === 51
    ) {
      color = '#ff48dc';
    } else if (item['StatusId'] === 53 || item['StatusId'] === 52) {
      color = '#32b970';
    } else if (item['StatusId'] === 54) {
      color = '#324cb9';
    } else if (item['StatusId'] === 55) {
      color = '#9b45e5';
    } else if (item['StatusId'] === 56 || item['StatusId'] === 57) {
      color = '#ff4851';
    } else if (item['StatusId'] === 58) {
      color = '#000000';
    }
    if (item['DatepartyId'] === 1) {
      if (item['Timetable']) {
        item['Timetable'].forEach((date) => {
          this.calendarEvents.push({
            start:
              moment(date.Timetable).format('YYYY-MM-DD') +
              ' ' +
              moment(date.StartTime).format('HH:mm'),
            end:
              moment(date.Timetable).format('YYYY-MM-DD') +
              ' ' +
              moment(date.EndTime).format('HH:mm'),
            title: item['Name'],
            backgroundColor: color,
            borderColor: color,
          });
        });
      }
    } else if (item['DatepartyId'] === 2) {
      if (item['Timetable']) {
        item['Timetable'].forEach((date) => {
          this.calendarEvents.push({
            start: new Date(
              moment(date.Timetable).format('YYYY-MM-DD') +
                ' ' +
                moment(date.StartTime).format('HH:mm'),
            ),
            end: new Date(
              moment(date.Timetable).format('YYYY-MM-DD') +
                ' ' +
                moment(date.EndTime).format('HH:mm'),
            ),
            title: item['Name'],
            backgroundColor: color,
            borderColor: color,
          });
        });
      }
    } else if (item['DatepartyId'] === 3) {
      if (item['Timetable']) {
        item['Timetable'].forEach((date) => {
          this.calendarEvents.push({
            start:
              moment(date.Timetable).format('YYYY-MM-DD') +
              ' ' +
              moment(date.StartTime).format('HH:mm'),
            end:
              moment(date.Timetable).format('YYYY-MM-DD') +
              ' ' +
              moment(date.EndTime).format('HH:mm'),
            title: item['Name'],
            backgroundColor: color,
            borderColor: color,
          });
        });
      }
    } else if (item['DatepartyId'] === 4) {
      if (item['Timetable']) {
        item['Timetable'].forEach((date) => {
          this.calendarEvents.push({
            start:
              moment(date.Timetable).format('YYYY-MM-DD') +
              ' ' +
              moment(date.StartTime).format('HH:mm'),
            end:
              moment(date.Timetable).format('YYYY-MM-DD') +
              ' ' +
              moment(date.EndTime).format('HH:mm'),
            title: item['Name'],
            backgroundColor: color,
            borderColor: color,
          });
        });
      }
    }
  }

  private _getRightsAccess(Id) {
    return this._configurationService.getRightsAccess(Id).pipe(
      map((res) => {
        const generalPosition = [16, 17, 22, 14];
        if (generalPosition.includes(Number(this.positionId))) {
          this.isProjectCreate = true;
        } else {
          if (res['message'][0].Rights) {
            this.isProjectCreate = res['message'][0].Rights.isProjectCreate;
          } else {
            this.isProjectCreate = false;
          }
        }
      }),
    );
  }

  private _replaceArray(array, key): Array<number> {
    let idArray: Array<number> = [];
    if (array) {
      array.forEach((element) => {
        idArray.push(element[key]);
      });
    }
    return idArray;
  }

  private getProjectEmployee() {
    return this._projectsService.getProjectAllEmployee().pipe(
      map((employee) => {
        this.projectEmployees = employee['message'];
      }),
    );
  }

  /**
   * return object with key message, which is array of statuses
   */
  private _getAllStatuses() {
    return this._projectsService.getAllStatuses().pipe(
      map((data: object) => {
        this.allStatuses = data['message'];
        return data;
      }),
    );
  }
  private _getAllEmployees() {
    return this._projectsService.getAllEmployee().pipe(
      map((data) => {
        this.allEmployees = data['message'];
        return data;
      }),
    );
  }

  private _getAllIndoor() {
    return this._projectsService.getIndoorOutdoor().pipe(
      map((data) => {
        this.indoor = data['message'];
        return data;
      }),
    );
  }
  /**
   *
   */
  private _getAllCompany() {
    return this._projectsService.getAllCompany().pipe(
      map((data: object) => {
        this.allCompany = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of types company
   */
  private _getAllCompanyTypes() {
    return this._projectsService.getAllCompanyTypes().pipe(
      map((data: object) => {
        this.allCompanyTypes = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of pay methods
   */
  private _getAllPayMethods() {
    return this._projectsService.getAllPayMethods().pipe(
      map((data: object) => {
        this.allPayMethods = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of types project
   */
  private _getAllProjectTypes() {
    return this._projectsService.getAllProjectTypes().pipe(
      map((data: object) => {
        this.allProjectTypes = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of cities
   */
  private _getAllCities() {
    return this._projectsService.getAllCities().pipe(
      map((data: object) => {
        this.allCities = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of countries
   */
  private _getAllCountries() {
    return this._projectsService.getAllCountries().pipe(
      map((data: object) => {
        this.allCountries = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of departament
   */
  private _getAllEmployeeDepartments() {
    return this._projectsService.getAllEmployeeDepartments().pipe(
      map((data: object) => {
        this.allEmployeeDepartments = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of sphere acrivity
   */
  private _getAllSphereActivity() {
    return this._projectsService.getAllSphereActivity().pipe(
      map((data: object) => {
        this.allSphereActivity = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of sales types
   */
  private _getAllSalesTypes() {
    return this._projectsService.getAllSalesTypes().pipe(
      map((data) => {
        this.allSalesTypes = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of manegers
   */
  private _getAllManegers() {
    return this._projectsService.getAllManager().pipe(
      map((data) => {
        this.allManagers = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of format project
   */
  private _getAllFormatProject() {
    return this._projectsService.getAllFormatProject().pipe(
      map((data) => {
        this.allformatProject = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of areas conduct
   */
  private _getAllAreasConduct() {
    return this._projectsService.getAllAreasConduct().pipe(
      map((data) => {
        this.allAreasConduct = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of task project
   */
  private _getAllTaskProject() {
    return this._projectsService.getAllProjectTask().pipe(
      map((data) => {
        this.allTaskProject = data['message'];
        return data;
      }),
    );
  }
  /**
   * return object with key message, which is array of all project
   */
  private _getProjects() {
    return this._projectsService.getProject().pipe(
      map((data) => {
        this.allProjects = data['message'];
        this.allProjectsArray = data['message'];
        this.data.changeMessage(this.allProjects);
        return data;
      }),
    );
  }

  private _getAllDepartments() {
    return this._projectsService.getAllDepartments().pipe(
      map((data) => {
        this.allDepartments = data['message'];
        return data;
      }),
    );
  }

  private _getAllFormatByProjects() {
    return this._projectsService.getAllFormatByProject().pipe(
      map((data) => {
        this.allFormatByProjects = data['message'];
        return data;
      }),
    );
  }

  ngOnDestroy() {
    this._subsription.unsubscribe();
  }
  /**
   * filter by colors
   */

  redFilter() {
    let t = 0;
    this.dataByColor = [];
    if (this.allProjectsArray !== undefined) {
      for (let i = 0; i < this.allProjectsArray.length; i++) {
        if (this.allProjectsArray[i].StatusId !== undefined) {
          if (
            this.allProjectsArray[i].StatusId === 56 ||
            this.allProjectsArray[i].StatusId === 57
          ) {
            this.dataByColor[t] = this.allProjectsArray[i];
            t++;
          }
        }
      }
    }
    this.data.changeMessage(this.dataByColor);
  }

  blueFilter() {
    let t = 0;
    this.dataByColor = [];
    if (this.allProjectsArray !== undefined) {
      for (let i = 0; i < this.allProjectsArray.length; i++) {
        if (this.allProjectsArray[i].StatusId !== undefined) {
          if (this.allProjectsArray[i].StatusId === 54) {
            this.dataByColor[t] = this.allProjectsArray[i];
            t++;
          }
        }
      }
    }
    this.data.changeMessage(this.dataByColor);
  }

  greenFilter() {
    let t = 0;
    this.dataByColor = [];
    if (this.allProjectsArray !== undefined) {
      for (let i = 0; i < this.allProjectsArray.length; i++) {
        if (this.allProjectsArray[i].StatusId !== undefined) {
          if (
            this.allProjectsArray[i].StatusId === 52 ||
            this.allProjectsArray[i].StatusId === 53
          ) {
            this.dataByColor[t] = this.allProjectsArray[i];
            t++;
          }
        }
      }
    }
    this.data.changeMessage(this.dataByColor);
  }

  pinkFilter() {
    let t = 0;
    this.dataByColor = [];
    if (this.allProjectsArray !== undefined) {
      for (let i = 0; i < this.allProjectsArray.length; i++) {
        if (this.allProjectsArray[i].StatusId !== undefined) {
          if (
            this.allProjectsArray[i].StatusId === 47 ||
            this.allProjectsArray[i].StatusId === 48 ||
            this.allProjectsArray[i].StatusId === 49 ||
            this.allProjectsArray[i].StatusId === 50 ||
            this.allProjectsArray[i].StatusId === 51
          ) {
            this.dataByColor[t] = this.allProjectsArray[i];
            t++;
          }
        }
      }
    }
    this.data.changeMessage(this.dataByColor);
  }

  orangeFilter() {
    let t = 0;
    this.dataByColor = [];
    if (this.allProjectsArray !== undefined) {
      for (let i = 0; i < this.allProjectsArray.length; i++) {
        if (this.allProjectsArray[i].StatusId !== undefined) {
          if (this.allProjectsArray[i].StatusId === 46) {
            this.dataByColor[t] = this.allProjectsArray[i];
            t++;
          }
        }
      }
    }
    this.data.changeMessage(this.dataByColor);
  }

  violetFilter() {
    let t = 0;
    this.dataByColor = [];
    if (this.allProjectsArray !== undefined) {
      for (let i = 0; i < this.allProjectsArray.length; i++) {
        if (this.allProjectsArray[i].StatusId !== undefined) {
          if (this.allProjectsArray[i].StatusId === 55) {
            this.dataByColor[t] = this.allProjectsArray[i];
            t++;
          }
        }
      }
    }
    this.data.changeMessage(this.dataByColor);
  }

  resetFilter() {
    this.data.changeMessage(this.allProjectsArray);
  }
}
