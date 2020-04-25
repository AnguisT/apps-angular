import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { Subscription, forkJoin, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { ProjectsService } from '../../../projects/projects.service';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.view.html',
  styleUrls: ['./managers.view.scss']
})
export class ManagersView implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    expandedElement;
    dataSource;
    loading = false;
    projects;
    managers;
    private _subscription = new Subscription();
    private $destroy: Subject<void> = new Subject<void>();

    constructor(private _projectService: ProjectsService, private data: MsgService) {
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

    ngOnInit() {
      this.loading = true;
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

    ngOnDestroy() {
      this.$destroy.next();
      this.$destroy.complete();
    }

    private _combineObservables() {
      const combined = forkJoin(
        this._getProjects(),
        this._getManagers(),
      );

      this._subscription = combined.pipe(finalize(() => this.loading = false)).subscribe(() => this._filter());
    }

    _filter() {
      this.managers.forEach(manager => {
        const NumberOfRequests = this.projects.filter(project => project.CustomerMainManagerId === manager.Id ||
          project.ClientMainManagerId === manager.Id);

        const NumberOfProject = this.projects.filter(project => (project.CustomerMainManagerId === manager.Id ||
          project.ClientMainManagerId === manager.Id) &&
          (project.StatusId === 52 || project.StatusId === 53 || project.StatusId === 54));

        manager.NumberOfRequests = NumberOfRequests.length;
        manager.NumberOfProject = NumberOfProject.length;
        if (NumberOfRequests.length !== 0) {
          manager.Conversion = ((NumberOfProject.length * 100) / NumberOfRequests.length).toFixed(0) + '%';
        } else {
          manager.Conversion = 0 + '%';
        }
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

    private _getManagers() {
      return this._projectService.getAllManager()
        .pipe(map(data => {
            this.managers = data['message'];
            return data;
        }));
    }
}
