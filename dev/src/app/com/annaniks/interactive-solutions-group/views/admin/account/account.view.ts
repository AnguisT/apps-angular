import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services';
import { ProjectsService } from '../projects/projects.service';
import { map, switchMap, takeUntil, finalize } from 'rxjs/operators';
import { forkJoin, pipe, Subject, Subscription } from 'rxjs';
import { ConfigurationService } from '../configurations/configuration.service';
import { FormControl } from '@angular/forms';
import { AddAccountEventDialog } from '../../../dialogs/add-account-event/add-account-event.dialog';
import { MatDialog } from '@angular/material';
import { formatDate } from '@angular/common';
import { AddDayOffDialogComponent } from '../../../dialogs/add-day-off/add-day-off.dialog';
import { AddVacationDialogComponent } from '../../../dialogs';


@Component({
    selector: 'app-account',
    templateUrl: 'account.view.html',
    styleUrls: ['account.view.scss']
})
export class AccountView implements OnInit, OnDestroy {

    fio: any;
    email: any;
    birthday: any;
    image: string;
    imgurl: string;
    positionEmployee: any[];
    position: string;
    gender: string;
    dateStartWork: string;
    salary: number;
    vacationDays: number;
    vacationDaysLeft: number;
    description: string;
    phoneNumber: any;
    accountProcessing = [];
    accountTrip = [];
    accountDayOff = [];
    accountVacation = [];
    projects;
    dataPlan = {
        IndividualPlan: 0,
        PlanDepartment: 0,
        PlanCompany: 0,
        PlanNow: 0,
        BalancePlan: 0,
    };
    individualPlan;
    departmentId;
    projectsByDate = [];
    allProfit = 0;
    allEmployees: any[];
    contacts: any[];
    loaded = false;

    private _subscription: Subscription;
    private _destroy = new Subject();
    private userId;
    isTrip: boolean;
    isProcess: boolean;
    isVacation: boolean;
    isDayOff: boolean;
    positionId;
    idPosition: any;
    Id;
    selectedPosition: string;

    control: FormControl;
    positionList: any;

    public currentYear = new Date().getFullYear();
    public currentYearDayOff = new Date().getFullYear();
    public currentYearVacation = new Date().getFullYear();
    public selectedMonth = new Date().getMonth();
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

    constructor(private _router: Router,
        private _cookieService: CookieService,
        private _projectsService: ProjectsService,
        private _configurationService: ConfigurationService,
        private _matDialog: MatDialog,
        private _cookiesService: CookieService) {
            this.positionId = this._cookiesService.get('PositionID');
            this.Id = this._cookieService.get('Id');
    }

    /**
     * return logged in person array
     */
    public _sendToAccountComponent(data) {
        this.fio = data.FulName;
        this.image = data.Image;
        this.imgurl = 'https://crm.i-s-group.ru:3000/static/' + this.image;
        this.birthday = data.Birthday.substring(8, 10) + '.' +
            data.Birthday.substring(5, 7) + '.' + data.Birthday.substring(0, 4);
        this.email = data.Email;
        this.idPosition = data.PositionId;
        this.departmentId = data.DepartmentId;
        if (data.GenderId === 1) {
            this.gender = 'Мужской';
        } else if (data.GenderId === 2) {
            this.gender = 'Женский';
        } else if (data.GenderId === 3) {
            this.gender = 'Не определился';
        }
        this.salary = data.Salary;
        this.dateStartWork = data.DateStartWork && data.DateStartWork.substring(8, 10) + '.' +
        data.DateStartWork.substring(5, 7) + '.' + data.DateStartWork.substring(0, 4);
        this.description = data.Description;
        this.individualPlan = data.IndividualPlan;
        const phoneNumber = this.contacts.find(contact => contact.ContactTypeId === 14);
        if (phoneNumber) {
            this.phoneNumber = phoneNumber.ContactValue;
        }
        this.vacationDays = data.VacationDays;
    }

    ngOnInit() {
        this.userId = Number(this._cookieService.get('Id'));
        this._combineObservables();
    }

    private _combineObservables() {
        const combined = forkJoin(
            this._getOneEmployee(),
            this._getProjects(),
            this._getAccountProcessing(),
            this._getAccountTrip(),
            this._getAccountDayOff(this.currentYearDayOff),
            this._getAccountVacation(this.currentYearVacation),
            this._getRightsAccess(this.Id),
        ).pipe(map(() => {
            this._getPositionEmployee(),
            this.getProjectById({ process: true, trip: true });
        }));
        let month: any = this.selectedMonth + 1;
        if (month < 10) {
            month = `0${this.selectedMonth + 1}`;
        }
        this._subscription = combined.pipe(finalize(() => this.loaded = true)).subscribe(() => {
            this.getPlanByDate(`${month}-${this.currentYear}`);
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
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
        this.getPlanByDate(`${month}-${this.currentYear}`);
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
        this.getPlanByDate(`${month}-${this.currentYear}`);
    }

    filterProjectsByDate(date) {
        this.allProfit = 0;
        this.projectsByDate = [];
        this.projects.forEach(project => {
            if (project.Projectdate) {
                const dates = project.Projectdate.split(',');
                const projectDate = formatDate(dates[0], 'MM-yyyy', 'en');
                if (projectDate === date && project.ManagerProjectId === this.userId) {
                    this.projectsByDate.push(project);
                }
            }
        });
        this.projectsByDate.forEach((project) => {
            if (typeof project.profitFact === 'number') {
                console.log(project.profitFact);
                this.allProfit = this.allProfit + project.profitFact;
            }
        });
        if (typeof this.allProfit === 'number') {
            this.allProfit = this.allProfit - (this.allProfit * 0.08);
        }
    }

    uploadAvatar(e) {
        const reader = new FileReader();
        reader.onload = (file: any) => {
            this.imgurl = 'url(' + file.target.result + ')';
        };
        reader.readAsDataURL(e.target.files[0]);
        this.createStaffImage(e, this.userId);
    }

    getProjectById({ process = false, trip = false }) {
        if (process) {
            this.accountProcessing.forEach((data) => {
                const nameProject = this.projects.find(itemProject => itemProject.Id === data.prod);
                data.Name = nameProject.Name;
            });
        }
        if (trip) {
            this.accountTrip.forEach((data) => {
                const nameProject = this.projects.find(itemProject => itemProject.Id === data.prod);
                data.Name = nameProject.Name;
            });
        }
    }

    openModalAccountProcessing(data?) {
        if (data && !this.isProcess) {
            return;
        }
        const dialogRef = this._matDialog.open(AddAccountEventDialog, {
            disableClose: true,
            width: '500px',
            data: {data: data || null, userId: this.userId}
        });

        dialogRef.beforeClosed()
            .subscribe((res) => {
                if (res) {
                    if (res.deleteId) {
                        const findIndex = this.accountProcessing.findIndex(item => item.id === res.deleteId);
                        this.accountProcessing.splice(findIndex, 1);
                        this._configurationService.deleteAccountProcessing(res.deleteId)
                            .pipe(takeUntil(this._destroy))
                            .subscribe();
                    } else {
                        res.Prod = res.Prod.Id;
                        res.Stat = res.Stat.Id;
                        res.EmployeeId = parseInt(this.userId, 0);
                        if (data) {
                            this._configurationService.updateAccountProcessing(data.id, res)
                                .pipe(takeUntil(this._destroy),
                                    switchMap(() => this._getAccountProcessing()))
                                .subscribe(() => {
                                    this.getProjectById({ process: true });
                                });
                        } else {
                            this.accountProcessing.push(res);
                            this._configurationService.saveAccountProcessing(this.userId, res)
                                .pipe(takeUntil(this._destroy),
                                    switchMap(() => this._getAccountProcessing()))
                                .subscribe(() => {
                                    this.getProjectById({ process: true });
                                });
                        }
                    }
                }
            });
    }

    openModalAccountTrip(data?) {
        if (data && !this.isTrip) {
            return;
        }
        const dialogRef = this._matDialog.open(AddAccountEventDialog, {
            disableClose: true,
            width: '500px',
            data: {data: data || null, userId: this.userId}
        });

        dialogRef.beforeClosed()
            .subscribe((res) => {
                if (res) {
                    if (res.deleteId) {
                        const findIndex = this.accountTrip.findIndex(item => item.id === res.deleteId);
                        this.accountTrip.splice(findIndex, 1);
                        this._configurationService.deleteAccountTrip(res.deleteId)
                            .pipe(takeUntil(this._destroy))
                            .subscribe();
                    } else {
                        res.Prod = res.Prod.Id;
                        res.Stat = res.Stat.Id;
                        res.EmployeeId = parseInt(this.userId, 0);
                        if (data) {
                            this._configurationService.updateAccountTrip(data.id, res)
                                .pipe(takeUntil(this._destroy),
                                    switchMap(() => this._getAccountTrip()))
                                .subscribe(() => {
                                    this.getProjectById({ trip: true });
                                });
                        } else {
                            this.accountTrip.push(res);
                            this._configurationService.saveAccountTrip(this.userId, res)
                                .pipe(takeUntil(this._destroy),
                                    switchMap(() => this._getAccountTrip()))
                                .subscribe(() => {
                                    this.getProjectById({ trip: true });
                                });
                        }
                    }
                }
            });
    }

    openModalAccountDayOff(data?) {
        if (data && !this.isDayOff) {
            return;
        }
        const dialogRef = this._matDialog.open(AddDayOffDialogComponent, {
            disableClose: true,
            width: '500px',
            data: {data: data || null, userId: this.userId}
        });

        dialogRef.beforeClosed()
            .subscribe((res) => {
                if (res) {
                    if (res.deleteId) {
                        this._configurationService.deleteAccountDayOff(res.deleteId)
                            .pipe(takeUntil(this._destroy),
                                switchMap(() => this._getAccountDayOff(this.currentYearDayOff)))
                            .subscribe();
                    } else {
                        res.Date = formatDate(res.Date, 'yyyy-MM-dd', 'en');
                        res.EmployeeId = parseInt(this.userId, 0);
                        if (data) {
                            res.Status = res.Status.Id;
                            res.Id = data.Id;
                            this._configurationService.updateAccountDayOff(res)
                                .pipe(takeUntil(this._destroy),
                                    switchMap(() => this._getAccountDayOff(this.currentYearDayOff)))
                                .subscribe();
                        } else {
                            this._configurationService.saveAccountDayOff(res)
                                .pipe(takeUntil(this._destroy),
                                    switchMap(() => this._getAccountDayOff(this.currentYearDayOff)))
                                .subscribe();
                        }
                    }
                }
            });
    }

    openModalAccountVacation(data?) {
        if (data && !this.isVacation) {
            return;
        }
        const dialogRef = this._matDialog.open(AddVacationDialogComponent, {
            disableClose: true,
            width: '500px',
            data: {data: data || null, userId: this.userId}
        });

        dialogRef.beforeClosed()
            .subscribe((res) => {
                if (res) {
                    console.log(res);
                    if (res.deleteId) {
                        this._configurationService.deleteAccountVacation(res.deleteId)
                            .pipe(takeUntil(this._destroy))
                            .subscribe(() => {
                                this._getAccountVacation(this.currentYearVacation).subscribe();
                                this._getOneEmployee().subscribe();
                            });
                    } else {
                        res.DateStart = formatDate(res.Date[0], 'yyyy-MM-dd', 'en');
                        res.DateEnd = formatDate(res.Date[1], 'yyyy-MM-dd', 'en');
                        res.EmployeeId = parseInt(this.userId, 0);
                        if (data) {
                            res.Status = res.Status.Id;
                            res.Id = data.Id;
                            this._configurationService.updateAccountVacation(res)
                                .pipe(takeUntil(this._destroy))
                                .subscribe(() => {
                                    this._getAccountVacation(this.currentYearVacation).subscribe();
                                    this._getOneEmployee().subscribe();
                                });
                        } else {
                            this._configurationService.saveAccountVacation(res)
                                .pipe(takeUntil(this._destroy))
                                .subscribe(() => {
                                    this._getAccountVacation(this.currentYearVacation).subscribe();
                                    this._getOneEmployee().subscribe();
                                });
                        }
                    }
                }
            });
    }

    nextYearDayOff() {
        this.currentYearDayOff = this.currentYearDayOff + 1;
        this._getAccountDayOff(this.currentYearDayOff).subscribe();
    }

    prevYearDayOff() {
        this.currentYearDayOff = this.currentYearDayOff - 1;
        this._getAccountDayOff(this.currentYearDayOff).subscribe();
    }

    nextYearVacation() {
        this.currentYearVacation = this.currentYearVacation + 1;
        this._getAccountVacation(this.currentYearVacation).subscribe();
    }

    prevYearVacation() {
        this.currentYearVacation = this.currentYearVacation - 1;
        this._getAccountVacation(this.currentYearVacation).subscribe();
    }

    public _getOneEmployee() {
        return this._configurationService.getEmployeeById(this.userId).pipe(
            map((data) => {
                this.allEmployees = data['data']['message'];
                this.contacts = data['data']['Contact'];
                this.vacationDaysLeft = data['data']['VacationDaysLeft'];
                this._sendToAccountComponent(data['data']['message'][0]);
                return data;
            })
        );
    }

    private _getRightsAccess(Id) {
        return this._configurationService.getRightsAccess(Id).pipe(map(res => {
            const generalPosition = [16, 17, 22, 14];
            if (generalPosition.includes(Number(this.positionId))) {
                this.isTrip = true;
                this.isProcess = true;
                this.isVacation = true;
                this.isDayOff = true;
            } else {
                if (res['message'][0].Rights) {
                    this.isTrip = res['message'][0].Rights.isTrip;
                    this.isProcess = res['message'][0].Rights.isProcess;
                    this.isVacation = res['message'][0].Rights.isVacation;
                    this.isDayOff = res['message'][0].Rights.isDayOff;
                } else {
                    this.isTrip = false;
                    this.isProcess = false;
                    this.isVacation = false;
                    this.isDayOff = false;
                }
            }
        }));
    }

    private _getProjects() {
        return this._projectsService.getProject()
            .pipe(map((item: any) => {
                this.projects = item.message;
                return item;
            }));
    }

    private _getAccountProcessing() {
        return this._configurationService.getAccountProcessing(this.userId)
            .pipe(map((item: any) => {
                this.accountProcessing = item.message;
                return item;
            }));
    }

    private _getAccountTrip() {
        return this._configurationService.getAccountTrip(this.userId)
            .pipe(map((item: any) => {
                this.accountTrip = item.message;
                return item;
            }));
    }

    /**
     * return object with key message, which is array of position employee
     */
    private _getPositionEmployee() {
        return this._configurationService.getOnePosition(this.idPosition).subscribe((data) => {
            this.position = data['message'][0].Name;
        });
    }

    private createStaffImage(event, id) {
        if (event) {
            const fileList: FileList = event.target.files;
            if (fileList.length > 0) {
                const file: File = fileList[0];
                const formData: FormData = new FormData();
                formData.append('file', file, file.name);
                this._configurationService.addImage(id, formData)
                    .subscribe((data) => {
                        this._router.navigate(['']);
                    });

            }
        }
    }

    private getPlanByDate(date) {
        return this._configurationService.getOnePlanByDate({date}).subscribe((data) => {
            const plan = data['message'][0];
            this.filterProjectsByDate(date);
            if (plan) {
                let planDepartament: number;
                if (this.departmentId === 1) {
                    planDepartament = plan.DigitalPlan;
                } else {
                    planDepartament = plan.EventPlan;
                }
                console.log('all profit', this.allProfit);
                let planNow;
                if (typeof this.allProfit === 'number') {
                    planNow = (this.allProfit - (this.allProfit * 0.08));
                } else {
                    planNow = 0;
                }
                this.dataPlan = {
                    IndividualPlan: this.individualPlan,
                    PlanDepartment: planDepartament,
                    PlanCompany: plan.CompanyPlan,
                    PlanNow: planNow.toFixed(0),
                    BalancePlan: Number((this.individualPlan - planNow).toFixed(0)),
                };
            } else {
                this.dataPlan = {
                    IndividualPlan: 0,
                    PlanDepartment: 0,
                    PlanCompany: 0,
                    PlanNow: 0,
                    BalancePlan: 0,
                };
            }
        });
    }

    private _getAccountDayOff(year) {
        return this._configurationService.getAccountDayOffByYear(this.userId, year).pipe(map((data: any) => {
            this.accountDayOff = data.message;
            return data;
        }));
    }

    private _getAccountVacation(year) {
        return this._configurationService.getAccountVacationByYear(this.userId, year).pipe(map((data: any) => {
            this.accountVacation = data.message;
            return data;
        }));
    }
}
