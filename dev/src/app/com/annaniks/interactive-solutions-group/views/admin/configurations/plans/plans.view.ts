import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddPlanDialog } from '../../../../dialogs/add-plan/add-plan.dialog';
import { Subject } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { takeUntil, map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { PlanView } from '../../statistics/plan/plan.view';
import { ProjectsService } from '../../projects/projects.service';


@Component({
    selector: 'plans',
    templateUrl: 'plans.view.html',
    styleUrls: ['plans.view.scss']
})
export class PlansView implements OnInit, OnDestroy {
    public plans = [];
    public dates = [];
    public datesTitle = [];
    public selectedPlan = -1;
    public preventSingleClick;
    public projects;
    public timer;
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
    loading = false;

    destroy$ = new Subject();

    constructor(
        private _matDialog: MatDialog,
        private _configurationService: ConfigurationService,
        private _projectsService: ProjectsService,
    ) { }

    ngOnInit() {
        this.loading = true;
        this._getAllPlans();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    openModal(data?) {
        const dialogRef = this._matDialog.open(AddPlanDialog, {
            disableClose: true,
            width: '50%',
            data: { data, dates: this.dates } || { data: null, dates: this.dates }
        });

        dialogRef.beforeClosed().subscribe((res) => {
            if (res) {
                this.plans = [];
                this.selectedPlan = -1;
                this.dates = [];
                this.datesTitle = [];
                this._getAllPlans();
            }
        });
    }

    singleClick(event) {
        this.preventSingleClick = false;
        const delay = 200;
        this.timer = setTimeout(() => {
            if (!this.preventSingleClick) {
                this.selectedPlan = event;
            }
        }, delay);
    }

    doubleClick(event) {
        this.preventSingleClick = true;
        clearTimeout(this.timer);
        this.selectedPlan = event;
        this.openModal({ id: this.plans[event].Id });
    }

    generateDatesTitles(plan, index) {
        const month = this.months[new Date(plan.DatePlan).getMonth()];
        const year = formatDate(plan.DatePlan, 'yyyy', 'en');
        this.datesTitle.push({ title: `${month} ${year}`, id: index });
    }

    filterProjectsByDate(plan) {
        let projectsProfitDigital = 0;
        let projectsProfitEvent = 0;
        const currentDate = formatDate(plan.DatePlan, 'MM-yyyy', 'en');
        this.projects.forEach((project) => {
            if (project.Projectdate) {
                const projectdate = formatDate(project.Projectdate.split(',')[0], 'MM-yyyy', 'en');
                if (projectdate === currentDate) {
                    if (project.StatusId === 53 || project.StatusId === 54) {
                        if (project.DepartmentId === 70) {
                            projectsProfitDigital += project.profitFact ? project.profitFact : 0;
                        } else if (project.DepartmentId === 69) {
                            projectsProfitEvent += project.profitFact ? project.profitFact : 0;
                        }
                    }
                }
            }
        });
        projectsProfitDigital = projectsProfitDigital - (projectsProfitDigital * 0.08);
        projectsProfitEvent = projectsProfitEvent - (projectsProfitEvent * 0.08);

        plan.DigitalPlanNow = projectsProfitDigital;
        plan.EventPlanNow = projectsProfitEvent;
        plan.DigitalPlanNowProcent = ((projectsProfitDigital / plan.DigitalPlan) * 100).toFixed(2);
        plan.EventPlanNowProcent = ((projectsProfitEvent / plan.EventPlan) * 100).toFixed(2);
        plan.CompanyPlanNow = plan.DigitalPlanNow + plan.EventPlanNow;
        plan.CompanyPlanNowProcent = (((plan.DigitalPlanNow + plan.EventPlanNow) / plan.CompanyPlan) * 100).toFixed(2);

        return plan;
    }

    private _getAllPlans() {
        this._configurationService.getAllPlans().subscribe(res => {
            this._projectsService.getProject().subscribe((data) => {
                this.projects = data['message'];
                this.plans = res['message'];
                console.log(this.plans);
                console.log(this.plans.sort());
                this.plans.map((plan, index) => {
                    this.dates.push(plan.DatePlan);
                    this.generateDatesTitles(plan, index);
                    this.plans[index] = this.filterProjectsByDate(plan);
                });
                this.loading = false;
            });
        });
    }
}
