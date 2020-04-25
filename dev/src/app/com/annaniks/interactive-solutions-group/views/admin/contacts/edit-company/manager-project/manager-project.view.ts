import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProjectsService } from '../../../projects/projects.service';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../../contacts.service';
import { forkJoin, Subscription, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DxDataGridComponent } from 'devextreme-angular';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';

@Component({
    selector: 'app-manager-project',
    templateUrl: './manager-project.view.html',
    styleUrls: ['./manager-project.view.scss']
})
export class ManagerProjectView implements OnInit, OnDestroy {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    dataSource;
    id;
    managers;
    projects;
    loading = true;

    private _subscription = new Subscription;
    private $destroy: Subject<void> = new Subject<void>();

    constructor(
        public route: ActivatedRoute,
        private _contactsService: ContactsService,
        private _projectsService: ProjectsService,
        private data: MsgService) {
        this.route.parent.params.subscribe(params => {
            this.id = params['id'];
        });
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
            this.dataGrid.instance.exportToExcel(false);
        });
    }

    private _combineObservables() {
        const combined = forkJoin(
            this._getCompanyById(),
            this._getAllProject(),
        );
        this._subscription = combined.subscribe(data => {
            this.filterProject();
            this.loading = false;
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

    filterProject() {
        let projects = [];
        this.managers.forEach((manager) => {
            const findProjects = this.projects.filter((project) => project.CustomerMainManagerId === manager.Id ||
                project.ClientMainManagerId === manager.Id);
            findProjects.forEach((project) => {
                project.FIO = `${manager.Name} ${manager.Surname}`;
            });
            projects.push(...findProjects);
        });
        this.dataSource = projects;
    }

    private _getCompanyById() {
        if (this.id) {
            return this._contactsService.getCompanyById(this.id).pipe(map(
                (data) => {
                    console.log(data);
                    this.managers = data['data']['message']['managerResult'];
                    return data;
                })
            );
        }
    }

    private _getAllProject() {
        return this._projectsService.getProject().pipe(map(data => {
            this.projects = data['message'];
            return data;
        }));
    }
}
