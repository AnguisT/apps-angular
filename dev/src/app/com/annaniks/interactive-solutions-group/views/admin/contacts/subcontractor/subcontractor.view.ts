import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { forkJoin, Subscription, Subject } from 'rxjs';
import { ProjectsService } from '../../projects/projects.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { map, takeUntil } from 'rxjs/operators';
import { DateFormatPipe } from '../../../../pipe/date.format.pipe';
import { MsgService } from '../../../../services/sharedata';
import { ExportService } from '../../../../services/export.service';
@Component({
    selector: 'subcontractor-view',
    templateUrl: 'subcontractor.view.html',
    styleUrls: ['subcontractor.view.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class SubcontractorView implements OnInit, OnDestroy {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    dataSource;
    public allSubcontractor = [];
    public queryParams;
    public loading = true;
    public activeUrl;
    public sphereActivityIdArray = [];
    public projects;
    private _subscription: Subscription;
    private $destroy: Subject<void> = new Subject<void>();
    constructor(
        private _contatcService: ContactsService,
        private _router: Router,
        private _projectsService: ProjectsService,
        private dateFormaPipe: DateFormatPipe,
        private data: MsgService,
        private _exportService: ExportService
    ) {
        this.activeUrl = this._router.url;
    }

    ngOnInit() {
        this._exportTable();
        this._combineObservables();
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    private _exportTable() {
        this.data.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
            this._contatcService.getCompanyExportExcel(1).subscribe(data => {
                this._exportService.exportExcel(data, 'Subcontractors');
            });
        });
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

    filterCompanyProjectDate() {
        this.dataSource.forEach((company) => {
            const arrayDateClient = [];
            const arrayDateCustomer = [];
            const resClient = this.projects.filter((project) => company.Id === project.ClientId);
            const resCustomer = this.projects.filter((project) => company.Id === project.CustomerId);
            resClient.map((project) => {
                arrayDateClient.push(project.Projectdate.split(',')[0]);
            });
            resCustomer.map((project) => {
                arrayDateCustomer.push(project.Projectdate.split(',')[0]);
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

    public doubleClickFunction(event): void {
        if (event) {
            this._router.navigate(['/contacts/subcontractor/' + event.data.Id + '/edit']);
        }
    }

    /**
     *function for get all subcontractor and filter for search
     */
    private _getAllCompany() {
        return this._contatcService.getAllCompany().pipe(
            map((data) => {
                this._filterSphereActivityId();
                const companies = data['message'];
                this.dataSource = companies.filter(company => company.Subcontractor === 1);
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
        this.sphereActivityIdArray = []
        if (this.queryParams && this.queryParams.sphereActivity) {
            for (let i of this.queryParams.sphereActivity) {
                this.sphereActivityIdArray.push(i.Id)
            }
        }

    }
}
