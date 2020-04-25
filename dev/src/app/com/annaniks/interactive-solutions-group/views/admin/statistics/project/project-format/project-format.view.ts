import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { forkJoin, Observable, Subscription, Subject } from 'rxjs';
import { map, finalize, takeUntil } from 'rxjs/operators';
import { IProject, ServerResponse } from '../../../../../types/types';
import { ProjectsService } from '../../../projects/projects.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DxDataGridComponent } from 'devextreme-angular';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';

@Component({
    selector: 'app-project-format',
    templateUrl: './project-format.view.html',
    styleUrls: ['./project-format.view.scss']
})
export class ProjectFormatView implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    projectFormat = [];
    projects;
    projectsFormats;
    salesTypes;
    expandedElement;
    dataSource;
    loading = true;
    formats;

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
            this._getAllSalesTypes(),
            this._getFormat(),
        );

        this._subscription = combined.pipe(finalize(() => this.loading = false)).subscribe(() => this._filter());
    }

    private filterData() {
        this.dataSource = this.projectFormat;
    }

    private _filter() {
        this.projectsFormats.forEach(format => {
            this.salesTypes.forEach(sale => {
                let tenderYes = 0, tenderNo = 0;
                const numberOfRequests = this.formats.filter((project) => {
                    if (format.Id === project.FormatId && sale.Id === project.SaleTypeId) {
                        return project;
                    }
                    return false;
                });
                const numberOfProject = this.formats.filter((project) => {
                    if ((format.Id === project.FormatId && sale.Id === project.SaleTypeId) &&
                        (project.StatusId === 52 || project.StatusId === 53 || project.StatusId === 54)) {
                        return project;
                    }
                    return false;
                });
                numberOfRequests.forEach(project => project.StatusId === 53 || project.StatusId === 54 ? tenderNo++ : tenderYes++);
                this.projectFormat.push({
                    Id: '',
                    Name: format.Name,
                    FindOut: sale.Name,
                    NumberOfRequests: numberOfRequests.length,
                    NumberOfProject: numberOfProject.length,
                    TenderYes: tenderYes,
                    TenderNo: tenderNo,
                    Conversion: numberOfRequests.length  !== 0 ?
                        ((numberOfProject.length * 100) / numberOfRequests.length).toFixed(0) + '%' :
                        0 + '%',
                });
            });
        });
        console.log(this.projectFormat);
        this.filterData();
    }

    getCell(cell) {
        console.log(cell);
    }

    private _getAllProjectTypes(): Observable<object> {
        return this._projectService.getAllFormatProject().pipe(
            map((data: ServerResponse) => {
                this.projectsFormats = data.message;
                return data.message;
            })
        );
    }

    private _getAllSalesTypes(): Observable<object> {
        return this._projectService.getAllSalesTypes().pipe(
            map((data: ServerResponse) => {
                this.salesTypes = data.message;
                return data.message;
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

    private _getFormat() {
        return this._projectService.getAllFormatByProject()
            .pipe(map(data => {
                this.formats = data['message'];
                return data;
            }));
    }
}
