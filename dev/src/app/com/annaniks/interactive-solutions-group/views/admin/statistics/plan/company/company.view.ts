import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Subscription, forkJoin, Subject } from 'rxjs';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { ProjectsService } from '../../../projects/projects.service';
import { map, takeUntil } from 'rxjs/operators';
import { DxDataGridComponent } from 'devextreme-angular';
import { formatDate } from '@angular/common';
import { MsgService } from '../../../../../services/sharedata';

@Component({
    selector: 'app-company',
    templateUrl: './company.view.html',
    styleUrls: ['./company.view.scss'],
})
export class CompanyView implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    loading = true;
    plan;
    plans = [];
    selectedMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    allProjects;
    projectsByDate = [];
    digitalProfit = 0;
    eventProfit = 0;
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

    private _subscription: Subscription = new Subscription();
    private $destroy: Subject<void> = new Subject<void>();

    constructor(
        private _configurationService: ConfigurationService,
        private _projectsService: ProjectsService,
        private data: MsgService
    ) { }

    ngOnInit() {
        let month: any = this.selectedMonth + 1;
        if (month < 10) {
            month = `0${this.selectedMonth + 1}`;
        }
        const combined = forkJoin(
            this._getOnePlanByDate(`${month}-${this.currentYear}`),
            this._getProjects(`${month}-${this.currentYear}`),
        );
        this._subscription = combined.subscribe(() => {
            this.filterPlans();
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        });
    }

    ngAfterViewInit(): void {
        this._exportTable();
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                text: 'Сброс',
                onClick: this.clearAllFilters.bind(this)
            }
        });
    }

    clearAllFilters() {
        this.dataGrid.instance.clearFilter();
        this.dataGrid.instance.clearSorting();
        this.dataGrid.instance.clearGrouping();
    }

    private _exportTable() {
        this.data.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
            this.dataGrid.instance.exportToExcel(false);
        });
    }

    customizeExportData (columns, rows) {
        rows.forEach(data => {
            const plan = data.data.Plan.Plan;
            const planNow = data.data.Plan.PlanNow;
            const percentPlan = (planNow / plan) * 100;
            if (percentPlan > 100) {
                data.values[2] = `${percentPlan.toFixed(2)}%`;
            } else if (percentPlan === 100) {
                data.values[2] = `${percentPlan}%`;
            } else if (percentPlan < 100) {
                data.values[2] = `${percentPlan.toFixed(2)}%`;
            }
            const amountPlan = plan - planNow;
            if (amountPlan < 0) {
                data.values[3] = `${amountPlan.toFixed(2).toString().slice(1)}`;
            } else if (amountPlan === 0) {
                data.values[3] = `${amountPlan.toFixed(0)}`;
            } else if (amountPlan > 0) {
                data.values[3] = `${amountPlan.toFixed(2)}`;
            }
        });
        console.log(rows);
    }

    onExported(e) {
        console.log(e);
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
        this._getPlanByDate(`${month}-${this.currentYear}`);
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
        this._getPlanByDate(`${month}-${this.currentYear}`);
    }

    filterProjectsByDate(date) {
        if (!this.plan) {
            return;
        }
        this.digitalProfit = 0;
        this.eventProfit = 0;
        this.projectsByDate = [];
        this.allProjects.forEach(project => {
            if (project.Projectdate) {
                const dates = project.Projectdate.split(',');
                const projectDate = formatDate(dates[0], 'MM-yyyy', 'en');
                if (projectDate === date) {
                    if (project.StatusId === 53 || project.StatusId === 54) {
                        this.projectsByDate.push(project);
                    }
                }
            }
        });
        this.projectsByDate.forEach((project) => {
            if (typeof project.profitFact === 'number') {
                if (project.DepartamentName === 'Digital') {
                    this.digitalProfit = this.digitalProfit + project.profitFact;
                } else if (project.DepartamentName === 'Event') {
                    this.eventProfit = this.eventProfit + project.profitFact;
                }
            }
        });
        if (typeof this.digitalProfit === 'number') {
            this.digitalProfit = this.digitalProfit - (this.digitalProfit * 0.08);
        }
        if (typeof this.eventProfit === 'number') {
            this.eventProfit = this.eventProfit - (this.eventProfit * 0.08);
        }
        this.plan.DigitalPlanNow = this.digitalProfit;
        this.plan.EventPlanNow = this.eventProfit;
        this.plan.CompanyPlanNow = this.digitalProfit + this.eventProfit;
    }

    filterPlans() {
        if (this.plan) {
            for (let i = 0; i < 3; i++) {
                if (i === 0) {
                    const performance = this.plan.DigitalPlan - this.plan.DigitalPlanNow;
                    this.plans.push({
                        Type: 'План Digital-департамента',
                        Performance: performance > 0 ? 'Нет' : 'Да',
                        Plan: { Plan: this.plan.DigitalPlan, PlanNow: this.plan.DigitalPlanNow }
                    });
                } else if (i === 1) {
                    const performance = this.plan.EventPlan - this.plan.EventPlanNow;
                    this.plans.push({
                        Type: 'План Event-департамента',
                        Performance: performance > 0 ? 'Нет' : 'Да',
                        Plan: { Plan: this.plan.EventPlan, PlanNow: this.plan.EventPlanNow }
                    });
                } else if (i === 2) {
                    const performance = this.plan.CompanyPlan - this.plan.CompanyPlanNow;
                    this.plans.push({
                        Type: 'План компании',
                        Performance: performance > 0 ? 'Нет' : 'Да',
                        Plan: { Plan: this.plan.CompanyPlan, PlanNow: this.plan.CompanyPlanNow }
                    });
                }
            }
        }
    }

    generatePercentSucess(cell) {
        const plan = cell.data.Plan.Plan;
        const planNow = cell.data.Plan.PlanNow;
        const percentPlan = (planNow / plan) * 100;
        if (percentPlan > 100) {
            return `${percentPlan.toFixed(2)}%`;
        } else if (percentPlan === 100) {
            return `${percentPlan}%`;
        }
    }

    generatePercentDanger(cell) {
        const plan = cell.data.Plan.Plan;
        const planNow = cell.data.Plan.PlanNow;
        const percentPlan = (planNow / plan) * 100;
        if (percentPlan < 100) {
            return `${(100 - percentPlan).toFixed(2)}%`;
        }
    }

    generateAmountSucess(cell) {
        const plan = cell.data.Plan.Plan;
        const planNow = cell.data.Plan.PlanNow;
        const amountPlan = plan - planNow;
        if (amountPlan < 0) {
            return `${amountPlan.toFixed(2).toString().slice(1)}`;
        } else if (amountPlan === 0) {
            return `${amountPlan.toFixed(0)}`;
        }
    }

    generateAmountDanger(cell) {
        const plan = cell.data.Plan.Plan;
        const planNow = cell.data.Plan.PlanNow;
        const amountPlan = plan - planNow;
        if (amountPlan > 0) {
            return `${amountPlan.toFixed(2)}`;
        }
    }

    _getPlanByDate(date) {
        this._configurationService.getOnePlanByDate({ date }).subscribe((data) => {
            this.plan = data['message'][0];
            this.plans = [];
            this.filterProjectsByDate(date);
            this.filterPlans();
        });
    }

    private _getOnePlanByDate(date) {
        return this._configurationService.getOnePlanByDate({ date }).pipe(
            map((data) => {
                this.plan = data['message'][0];
                return data['message'];
            })
        );
    }

    private _getProjects(date) {
        return this._projectsService.getProject().pipe(
            map((data) => {
                this.allProjects = data['message'];
                this.filterProjectsByDate(date);
                return data;
            })
        );
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
        this.$destroy.next();
        this.$destroy.complete();
    }
}
