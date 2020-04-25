import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DxDataGridComponent } from 'devextreme-angular';
import { MsgService } from '../../../../services/sharedata';
import { ProjectsService } from '../../projects/projects.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ExportService } from '../../../../services/export.service';
@Component({
    selector: 'manager-view',
    templateUrl: 'managers.vew.html',
    styleUrls: ['managers.vew.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ManagersView implements OnInit, OnDestroy {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    dataSource;
    contacts;
    public allManagers = [];
    public queryParams;
    public loading = true;
    public activeUrl;
    public sphereActivityIdArray = [];
    private $destroy: Subject<void> = new Subject<void>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _contactsService: ContactsService,
        private data: MsgService,
        private _exportService: ExportService
    ) {
        _activatedRoute.queryParams.subscribe(data => {
            if (data && data.q) {
                this.queryParams = JSON.parse(data.q);
                // console.log(this.queryParams);
                this._getAllManagers();
            }
        });
        this.activeUrl = this._router.url;
    }
    ngOnInit() {
        this._exportTable();
        this._getAllManagers();
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    private _exportTable() {
        this.data.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
            this._contactsService.getManagerExportExcel().subscribe(data => {
                this._exportService.exportExcel(data, 'Managers');
            });
        });
    }

    public doubleClickFunction(event): void {
        if (event) {
            this._router.navigate(['/contacts/managers/' + event.data.Id + '/edit']);
        }
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

    filterContactsManager() {
        this.allManagers.forEach((manager) => {
            manager.PhoneNumber = '';
            const contactsManager = this.contacts.filter((contact) => contact.UserId === manager.UserId);
            contactsManager.map(contact => {
                if (contact.ContactType === 2) {
                    manager.Email = contact.ContactValue;
                } else if (contact.ContactType === 13 || contact.ContactType === 14) {
                    manager.PhoneNumber += contact.ContactValue + ', ';
                }
            });
        });
    }

    private _getAllManagers() {
        this._contactsService.getAllManagers().subscribe(data => {
            this._filterSphereActivityId();
            this.allManagers = data['message'];
            this.contacts = data['Contacts']['data']['message'];
            this.filterContactsManager();
            this.dataSource = this.allManagers;
            this.loading = false;
            console.log(this.dataSource);
        });
    }

    private _filterSphereActivityId() {
        this.sphereActivityIdArray = []
        if (this.queryParams && this.queryParams.sphereActivity) {
            for (let i of this.queryParams.sphereActivity) {
                this.sphereActivityIdArray.push(i.Id);
            }
            // console.log(this.sphereActivityIdArray);
        }

    }
}
