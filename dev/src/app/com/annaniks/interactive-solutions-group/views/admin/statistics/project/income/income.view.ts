import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DxDataGridComponent } from 'devextreme-angular';
import { Subscription, forkJoin, Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { ProjectsService } from '../../../projects/projects.service';
import { ServerResponse } from 'src/app/com/annaniks/interactive-solutions-group/types/types';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';

@Component({
    selector: 'app-income',
    templateUrl: './income.view.html',
    styleUrls: ['./income.view.scss']
})
export class IncomeView implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    projectFormat = [];
    projects;
    projectsTypes;
    salesTypes;
    expandedElement;
    dataSource;
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
            this._getAllProjectTypes(),
            this._getAllSalesTypes()
        );

        this._subscription = combined.pipe(finalize(() => this.loading = false)).subscribe(() => this._filter());
    }

    private filterData() {
        this.dataSource = this.projectFormat;
    }

    private _filter() {
        this.projectsTypes.forEach(type => {
            this.salesTypes.forEach(sale => {
                let tenderYes = 0, tenderNo = 0;
                const numberOfRequests = this.projects.filter((project) => {
                    if (type.Id === project.ProjectTypeId && sale.Id === project.SaleTypeId) {
                        return project;
                    }
                    return false;
                });
                const numberOfProject = this.projects.filter((project) => {
                    if ((type.Id === project.ProjectTypeId && sale.Id === project.SaleTypeId) &&
                        (project.StatusId === 52 || project.StatusId === 53 || project.StatusId === 54)) {
                        return project;
                    }
                    return false;
                });
                numberOfRequests.forEach(project => project.StatusId === 53 || project.StatusId === 54 ? tenderNo++ : tenderYes++);
                this.projectFormat.push({
                    Id: '',
                    Name: type.Name,
                    FindOut: sale.Name,
                    NumberOfRequests: numberOfRequests.length,
                    NumberOfProject: numberOfProject.length,
                    TenderYes: tenderYes,
                    TenderNo: tenderNo,
                    Conversion: numberOfRequests.length !== 0 ?
                        ((numberOfProject.length * 100) / numberOfRequests.length).toFixed(0) + '%' :
                        0 + '%',
                });
            });
        });
        this.filterData();
    }

    getCell(cell) {
        console.log(cell);
    }

    private _getAllProjectTypes(): Observable<object> {
        return this._projectService.getAllProjectTypes().pipe(
            map((data: ServerResponse) => {
                this.projectsTypes = data['message'];
                return data['message'];
            })
        );
    }

    private _getAllSalesTypes(): Observable<object> {
        return this._projectService.getAllSalesTypes().pipe(
            map((data: ServerResponse) => {
                this.salesTypes = data['message'];
                return data['message'];
            })
        );
    }

    private _getProjects() {
        return this._projectService.getProject()
            .pipe(map(data => {
                this.projects = data['message'];
                return data;
            }));
    }
}
