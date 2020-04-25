import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ProjectsService } from '../../../projects/projects.service';
import { IProject } from '../../../../../types/types';
import { forkJoin, Subscription, Subject } from 'rxjs';
import { map, tap, find, finalize, takeUntil } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DxDataGridComponent } from 'devextreme-angular';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.view.html',
    styleUrls: ['./customers.view.scss']
})
export class CustomersView implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    projects: IProject[];
    companies;
    expandedElement;
    dataSource;
    columnsToDisplay: string[] = ['Id', 'Denomination', 'NumberOfRequests', 'NumberOfProjects', 'Conversion'];
    fields = [];
    loading = true;

    private _subscription: Subscription;
    private $destroy: Subject<void> = new Subject<void>();

    constructor(private _projectService: ProjectsService, private data: MsgService) {
    }

    ngOnInit() {
        this._combineObservables();
    }

    ngAfterViewInit(): void {
        this._exportTable();
    }

    private _exportTable() {
        this.data.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
            this.dataGrid.instance.exportToExcel(false);
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

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
        this.$destroy.next();
        this.$destroy.complete();
    }

    private _combineObservables() {
        const combined = forkJoin(
            this._getProjects(),
            this._getCompanies()
        );

        this._subscription = combined.pipe(finalize(() => this.loading = false)).subscribe(() => this._filter());
    }

    private _filter() {
        this.projects.forEach(project => {
            const findCompany = this.companies.find(company => company.Denomination === project.CustomerName);
            if (findCompany) {
                findCompany.NumberOfRequests ? findCompany.NumberOfRequests++ : findCompany.NumberOfRequests = 1;
                if (project.StatusId === 53) {
                    findCompany.NumberOfProjects ? findCompany.NumberOfProjects++ : findCompany.NumberOfProjects = 1;
                }
                findCompany.Conversion = (((findCompany.NumberOfProjects || 0) / (findCompany.NumberOfRequests || 0)) * 100).toFixed(0) + '%';
            }
        });

        this.dataSource = this.companies;
    }


    private _getProjects() {
        return this._projectService.getProject()
            .pipe(map(data => {
                this.projects = data['message'];
                return data;
            }));
    }

    private _getCompanies() {
        return this._projectService.getAllCompany()
            .pipe(map(data => {
                this.companies = data['message'];
                return data;
            }));
    }

}
