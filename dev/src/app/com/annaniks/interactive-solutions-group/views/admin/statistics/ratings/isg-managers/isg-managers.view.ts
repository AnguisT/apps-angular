import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { finalize, map, find, takeUntil } from 'rxjs/operators';
import { ProjectsService } from '../../../projects/projects.service';
import { IEmployee, IProject, Message as Employee } from '../../../../../types/types';
import { forkJoin, Subscription, Subject } from 'rxjs';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';

@Component({
    selector: 'app-isq-managers',
    templateUrl: './isg-managers.view.html',
    styleUrls: ['./isg-managers.view.scss']
})
export class IsgManagersView implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    projects: IProject[];
    allEmployee: Employee[];
    departments: any[];
    managers: any[] = [];
    dataSource;
    loading = true;

    private _subscription: Subscription;
    private $destroy: Subject<void> = new Subject<void>();

    constructor(private _projectService: ProjectsService,
                private _configurationService: ConfigurationService,
                private data: MsgService) {
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
            this._getAllEmployee(),
            this._getDepartments()
        );

        this._subscription = combined
            .pipe(finalize(() => {
                this.loading = false;
            }))
            .subscribe(() => this._filter());
    }

    private _filter() {
        this.allEmployee.forEach(employee => {
            let NumberOfRequests = 0, NumberOfProjects = 0;
            this.projects.forEach(project => {
                if (project.SaleManagerId === employee.Id) {
                    NumberOfRequests++;
                    if (project.StatusId === 53) {
                        NumberOfProjects++;
                    }
                }
            });
            const findDepartment = this.departments.find(depart => depart.Id === employee.DepartmentId);
            this.managers.push({
                Fio: employee.FulName,
                Department: findDepartment ? findDepartment.Name : '',
                NumberOfRequests,
                NumberOfProjects,
                Conversion: (((NumberOfProjects / NumberOfRequests) * 100) || 0).toFixed(2) + '%'
            });
        });
        this.dataSource = this.managers;
    }

    private _getProjects() {
        return this._projectService.getProject()
            .pipe(map(data => {
                this.projects = data['message'];
                return data;
            }));
    }

    private _getAllEmployee() {
        return this._configurationService.getAllEmployee()
            .pipe(map((employees: IEmployee) => {
                this.allEmployee = employees.message;
                return employees;
            }));
    }

    private _getDepartments() {
        return this._projectService.getAllEmployeeDepartments()
            .pipe(map(res => {
                this.departments = res['message'];
                return res;
            }));
    }
}
