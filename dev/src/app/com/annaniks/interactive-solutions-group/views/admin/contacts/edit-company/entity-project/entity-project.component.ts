import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { Subscription, forkJoin, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../../contacts.service';
import { ProjectsService } from '../../../projects/projects.service';
import { map, takeUntil } from 'rxjs/operators';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';

@Component({
  selector: 'app-entity-project',
  templateUrl: './entity-project.component.html',
  styleUrls: ['./entity-project.component.scss']
})
export class EntityProjectComponent implements OnInit, OnDestroy {

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
      this._getLegalEntities(),
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
      const findProjects = this.projects.filter((project) => project.CustomerMainLegalPersonId === manager.Id ||
        project.ClientMainLegalPersonId === manager.Id);
      findProjects.forEach((project) => {
        project.FIO = `${manager.AbbrName}`;
      });
      projects.push(...findProjects);
    });
    this.dataSource = projects;
  }

  private _getLegalEntities() {
    if (this.id) {
      return this._contactsService.getLegalEntities(this.id).pipe(map(
        (data) => {
          this.managers = data;
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
