import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ProjectsService} from '../../views/admin/projects/projects.service';
import {CookieService} from 'angular2-cookie/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {MsgService} from '../../services/sharedata';
import {ConfigurationService} from '../../views/admin/configurations/configuration.service';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {formatDate} from '@angular/common';

@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  calendarOneWeek: Date;
  user;
  positionId: string;
  Id;
  imgUrl = 'https://crm.i-s-group.ru:3000/static/';
  flag = true;
  showLiteExport = true;
  showExportAll = false;
  isShow = false;
  isShowCalendar = false;
  isShowEventCalendar = false;
  isShowProjects = false;
  globalRoute;
  employies = [];
  todayBirthday = false;
  markedDays = [];
  currentDate = new Date();
  filterEmployies = [];

  constructor(
    private _projectsService: ProjectsService,
    private _cookieService: CookieService,
    private _shareService: MsgService,
    private _router: Router,
    private _configurationService: ConfigurationService,
    private cdr: ChangeDetectorRef,
  ) {
    this.positionId = this._cookieService.get('PositionID');
    this.Id = this._cookieService.get('Id');
    this._router.events.subscribe((url) => {
      if (url instanceof NavigationEnd) {
        if (url.urlAfterRedirects) {
          const items = url.urlAfterRedirects.split('/');
          if (!items.includes('task')) {
            this.flag = true;
          } else {
            this.flag = false;
          }
          if (items.includes('edit') && items.includes('projects')) {
            this.showLiteExport = true;
          } else {
            this.showLiteExport = false;
          }
          if (items.includes('all-projects')) {
            if (this._shareService.showProjects$.getValue() === true) {
              this.isShowProjects = false;
              this.isShowEventCalendar = true;
            } else {
              this.isShowProjects = true;
              this.isShowEventCalendar = false;
            }
          }
          this.globalRoute = items;
        }
      }
    });
  }

  ngOnInit() {
    const combined = forkJoin(this._getUsers(), this._getAllEmployee());

    combined.subscribe(() => {
      this._configurationService.getRightsAccess(this.Id).subscribe((res) => {
        if (this.positionId === '17' || this.positionId === '22') {
          this.isShow = true;
          if (this.globalRoute) {
            if (this.globalRoute.includes('finance')) {
              this.showExportAll = true;
            }
          }
        } else {
          if (res['message'][0].Rights) {
            this.isShow = res['message'][0].Rights.isConfigurator;
            if (this.globalRoute) {
              if (this.globalRoute.includes('finance')) {
                this.showExportAll = res['message'][0].Rights.isFinanceVisible;
              }
            }
          } else {
            this.isShow = false;
            this.showExportAll = false;
          }
        }
      });
      this.employies.forEach((item) => {
        const date = new Date(item.Birthday);
        const birthday = formatDate(new Date(item.Birthday), 'dd.MM', 'en');
        const selectDate = formatDate(
          new Date(this.currentDate),
          'dd.MM',
          'en',
        );
        this.markedDays.push({
          d: `${date.getMonth() + 1}/${date.getDate()}`,
          color: '#ea4986',
        });
        if (birthday === selectDate) {
          this.todayBirthday = true;
          this.filterEmployies.push(item);
        }
      });
      this._shareService.showProjects$.subscribe((data) => {
        if (this.globalRoute) {
          if (this.globalRoute.includes('all-projects')) {
            if (data) {
              this.isShowProjects = false;
              this.isShowEventCalendar = true;
            } else {
              this.isShowProjects = true;
              this.isShowEventCalendar = false;
            }
          }
        }
      });
    });
  }

  showEventCalendar() {
    this._shareService.showProjects$.next(false);
  }

  showProjects() {
    this._shareService.showProjects$.next(true);
  }

  logOut() {
    this._router.navigate(['/login']);
  }

  saveGrid() {
    this._shareService.exportTable$.next(true);
  }

  liteExport() {
    this._shareService.exportLiteTable$.next(true);
  }

  exportAll() {
    this._shareService.exportAllTable$.next(true);
  }

  showCalendarBirthday() {
    this.isShowCalendar = !this.isShowCalendar;
  }

  selectDate(event) {
    this.filterEmployies = [];
    this.employies.forEach((item) => {
      const date = formatDate(new Date(item.Birthday), 'dd.MM', 'en');
      const selectDate = formatDate(new Date(event), 'dd.MM', 'en');
      if (date === selectDate) {
        this.filterEmployies.push(item);
      }
    });
    this.cdr.detectChanges();
  }

  private _getUsers() {
    return this._projectsService.getAllEmployee().pipe(
      map((res) => {
        const id = this._cookieService.get('Id');
        this.user = res['message'].find((item) => item.Id === parseInt(id));
      }),
    );
  }

  private _getAllEmployee() {
    return this._configurationService.getAllEmployee().pipe(
      map((data) => {
        this.employies = data['message'];
        return data;
      }),
    );
  }
}
