import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, forkJoin, Subject } from 'rxjs';
import { ContactsService } from '../contacts.service';
import { map } from 'rxjs/internal/operators/map';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProjectsService } from '../../projects/projects.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { DateFormatPipe } from '../../../../pipe/date.format.pipe';
import { MsgService } from '../../../../services/sharedata';
import { takeUntil } from 'rxjs/operators';
import { ExportService } from '../../../../services/export.service';

@Component({
    selector: 'app-companies',
    templateUrl: 'companies.view.html',
    styleUrls: ['companies.view.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    providers: [DateFormatPipe]
})
export class CompaniesView implements OnInit, OnDestroy {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    dataSource;
    companies;
    private _subscription: Subscription;
    public allTypeContact: Array<object>;
    public allCompany: Array<object> = [];
    public queryParams;
    public loading = true;
    public activeUrl;
    public sphereActivityIdArray = [];
    public projects = [];
    private $destroy: Subject<void> = new Subject<void>();
    constructor(
        private _contactServices: ContactsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _projectsService: ProjectsService,
        private data: MsgService,
        private dateFormaPipe: DateFormatPipe,
        private _exportService: ExportService) { }

    ngOnInit() {
        this._exportTable();
        this._combineObservables();
        this._activatedRoute.queryParams.subscribe((data) => {
            if (data && data.q) {
                this.queryParams = JSON.parse(data.q);
                this._getAllCompany().subscribe();
            }
        });
        this.activeUrl = this._router.url;
    }

    private _combineObservables() {
        const combined = forkJoin(
            this._getAllCompany(),
            this._getAllProjects(),
        );
        this._subscription = combined.subscribe(data => {
            this.loading = false;
            this.filterCompanyProjectDate();
        });
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

    public doubleClickFunction(event): void {
        if (event) {
            this._router.navigate(['/contacts/companies/' + event.data.Id + '/edit']);
        }
    }

    filterCompanyProjectDate() {
        this.dataSource.forEach((company) => {
            const arrayDateClient = [];
            const arrayDateCustomer = [];
            const resClient = this.projects.filter((project) => company.Id === project.ClientId);
            const resCustomer = this.projects.filter((project) => company.Id === project.CustomerId);
            resClient.map((project) => {
                if (project.Projectdate) {
                    arrayDateClient.push(project.Projectdate.split(',')[0]);
                }
            });
            resCustomer.map((project) => {
                if (project.Projectdate) {
                    arrayDateCustomer.push(project.Projectdate.split(',')[0]);
                }
            });
            const dateClient = this.dateFormaPipe.transform(arrayDateClient.sort().reverse()[0]);
            const dateCustomer = this.dateFormaPipe.transform(arrayDateCustomer.sort().reverse()[0]);
            let res = '';
            if (typeof dateClient === 'string') {
                res += `${dateClient}_К `;
            }
            if (typeof dateCustomer === 'string') {
                res += `${dateCustomer}_З`;
            }
            company.DatesProject = res;
        });
        this.dataSource.reverse();
    }

    /**
    * return object with key message, which is array of type company
    * and check condition for search request
    */
    private _getAllCompany() {
        return this._contactServices.getAllCompany().pipe(
            map((data) => {
                this._filterSphereActivityId();
                const companies = data['message'];
                this.dataSource = companies.filter(company => company.Customer === 1 ||
                    (company.Customer === 0 && company.Subcontractor === 0));
                return data;
            })
        );
    }

    private _getAllProjects() {
        return this._projectsService.getProject().pipe(
            map((data) => {
                this.projects = data['message'];
                return data;
            })
        );
    }

    private _filterSphereActivityId() {
        this.sphereActivityIdArray = [];
        if (this.queryParams && this.queryParams.sphereActivity) {
            for (let i of this.queryParams.sphereActivity) {
                this.sphereActivityIdArray.push(i.Id);
            }
        }
    }

    private _exportTable() {
        this.data.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
            this._contactServices.getCompanyExportExcel(0).subscribe(data => {
                this._exportService.exportExcel(data, 'Companies');
            });
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
        this.$destroy.next();
        this.$destroy.complete();
    }
}
