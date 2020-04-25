import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  AfterContentInit,
  AfterContentChecked,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import {ProjectsService} from '../../views/admin/projects/projects.service';
import {CookieService} from 'angular2-cookie/core';
import {Router} from '@angular/router';
import {MsgService} from '../../services/sharedata';
import {ConfigurationService} from '../../views/admin/configurations/configuration.service';
import {MbscCalendarComponent, MbscCalendarOptions} from '@mobiscroll/angular';
import moment from 'moment';
import 'moment/locale/ru';

@Component({
  selector: 'app-calendar-birthday',
  templateUrl: './calendar-birthday.component.html',
  styleUrls: ['./calendar-birthday.component.scss'],
})
export class CalendarBirthdayComponent implements OnInit, OnChanges {
  @Input('markedDays') markedDays;
  @Input('employies') employies;
  @Output('selectDate') selectDate: EventEmitter<Date> = new EventEmitter();

  public maxDays = 7;
  public minDate = new Date(1940, 0, 1);
  public firstDay = new Date();
  public lastDay = moment(this.firstDay).add(this.maxDays - 1, 'days');
  public selectedDay = moment(new Date()).toDate();
  public month;
  public year;
  public weeks;

  calendarOneWeek: Date;
  positionId: string;
  Id: string;
  russiaSettings: MbscCalendarOptions = {
    lang: 'ru',
  };

  constructor(
    private _projectsService: ProjectsService,
    private _cookieService: CookieService,
    private _shareService: MsgService,
    private _router: Router,
    private _configurationService: ConfigurationService,
  ) {}

  ngOnInit() {
    moment.locale('ru');
    this.buildDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.markedDays);
  }

  checkBirthday(date) {
    const momentDate = `${date.getMonth() + 1}/${date.getDate()}`;
    const findDate = this.markedDays.find((marked) => marked.d === momentDate);
    return findDate;
  }

  setSelectDay(date) {
    this.selectedDay = date.value;
    this.buildDates();
    this.selectDate.emit(date.value);
  }

  nextDays = function () {
    this.firstDay = moment(this.lastDay).add(1, 'days');
    this.lastDay = moment(this.firstDay).add(this.maxDays - 1, 'days');
    this.buildDates();
  };

  previousDays = function () {
    this.firstDay = moment(this.firstDay).subtract(this.maxDays, 'days');
    this.lastDay = moment(this.firstDay).subtract(1, 'days');
    this.buildDates();
  };

  buildDates() {
    this.month = moment(this.firstDay).format('MMMM');
    this.year = moment(this.firstDay).format('YYYY');
    this.weeks = [];

    let index = 0;
    let dates = [];
    do {
      const dateAux = moment(this.firstDay).add(index, 'days');
      const date = {
        dayName: dateAux.format('ddd'),
        day:
          dateAux.format('D').length === 1
            ? '0' + dateAux.format('D')
            : dateAux.format('D'),
        value: dateAux.toDate(),
        active:
          this.selectedDay && dateAux.isSame(moment(this.selectedDay), 'day'),
        disabled: dateAux.isBefore(moment(this.minDate), 'day'),
      };
      dates.push(date);
      index++;
      if (index % 7 === 0) {
        this.weeks.push({dates});
        dates = [];
      }
    } while (index < this.maxDays);
  }
}
