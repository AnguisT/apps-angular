import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { CookieService } from 'angular2-cookie';
import { map, takeUntil } from 'rxjs/operators';
import { ProjectsService } from '../../../projects/projects.service';
import { forkJoin, Subject } from 'rxjs';
import { DxDataGridComponent } from 'devextreme-angular';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';
import { AddAccountEventDialog } from 'src/app/com/annaniks/interactive-solutions-group/dialogs/add-account-event/add-account-event.dialog';

@Component({
    selector: 'app-processing',
    templateUrl: './processing.view.html',
    styleUrls: ['./processing.view.scss']
})
export class ProcessingView implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    expandedElement;
    loading = false;
    userId;
    positionId;
    accountProcessing;
    projects;
    generalPosition = [16, 17, 22, 14];
    status = [
        { Id: 0, Name: 'Не получено' },
        { Id: 1, Name: 'Получено' }
    ];
    months = [
        '01_Январь',
        '02_Февраль',
        '03_Март',
        '04_Апрель',
        '05_Май',
        '06_Июнь',
        '07_Июль',
        '08_Август',
        '09_Сентябрь',
        '10_Октябрь',
        '11_Ноябрь',
        '12_Декабрь'
    ];
    private $destroy: Subject<void> = new Subject<void>();

    constructor(
        private _configurationService: ConfigurationService,
        private _cookieService: CookieService,
        private _projectsService: ProjectsService,
        private data: MsgService,
        private _matDialog: MatDialog
    ) {
        this.userId = this._cookieService.get('Id');
        this.positionId = Number(this._cookieService.get('PositionID'));
    }

    ngOnInit() {
        this.loading = true;
        this._getProjects().subscribe(() => {
            this._getAllProcessing();
        });
    }

    ngOnDestroy() {
        this.$destroy.next();
        this.$destroy.complete();
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

    updateProcessing(event) {
        if (!this.generalPosition.includes(this.positionId)) {
            return;
        }
        const dialogRef = this._matDialog.open(AddAccountEventDialog, {
            disableClose: true,
            width: '500px',
            data: {data: event.data, userId: event.data.EmpId}
        });
        dialogRef.beforeClosed()
            .subscribe((res) => {
                if (res) {
                    if (res.deleteId) {
                        this._configurationService.deleteAccountProcessing(res.deleteId)
                            .pipe(takeUntil(this.$destroy)).subscribe(() => {
                                this._getAllProcessing();
                            });
                    } else {
                        res.Prod = res.Prod.Id;
                        res.Stat = res.Stat.Id;
                        res.EmployeeId = parseInt(this.userId, 0);
                        this._configurationService.updateAccountProcessing(event.data.id, res)
                            .pipe(takeUntil(this.$destroy)).subscribe(() => {
                                this._getAllProcessing();
                            });
                    }
                }
            });
    }

    private _getAllProcessing() {
        if (!this.generalPosition.includes(this.positionId)) {
            return this._configurationService.getAccountProcessing(this.userId).subscribe((item: any) => {
                this.accountProcessing = item.message;
                this.accountProcessing.forEach((data) => {
                    const findStatus = this.status.find(itemStatus => itemStatus.Id === data.stat);
                    const nameProject = this.projects.find(itemProject => itemProject.Id === data.prod);
                    const dateParty = nameProject.SingleParty || nameProject.MultiDatePartyPause
                        || nameProject.MultiDateParty || nameProject.MultiDateParty;

                    let date;
                    if (dateParty) {
                        const dates = dateParty.split(',');
                        date = dates.reduce((a, b) => new Date(a).getTime() - new Date(data.CreateDate).getTime() >
                            new Date(b).getTime() - new Date(data.CreateDate).getTime() ? a : b);
                    }

                    let year;
                    let month;
                    if (date) {
                        year = new Date(date).getFullYear();
                        month = this.months[new Date(date).getMonth()];
                    }
                    if (nameProject) {
                        data.Number = nameProject.Number;
                        data.Name = nameProject.Name;
                        data.Status = findStatus.Name;
                        data.Day = data.day;
                        data.Money = data.money;
                        data.Year = year;
                        data.Month = month;
                    }
                });
                this.loading = false;
                return item;
            });
        } else {
            return this._configurationService.getAllAccountProcessing().subscribe((item: any) => {
                this.accountProcessing = item.message;
                this.accountProcessing.forEach((data) => {
                    const findStatus = this.status.find(itemStatus => itemStatus.Id === data.stat);
                    const nameProject = this.projects.find(itemProject => itemProject.Id === data.prod);
                    const dateParty = nameProject.SingleParty || nameProject.MultiDatePartyPause
                        || nameProject.MultiDateParty || nameProject.MultiDateParty;

                    let date;
                    if (dateParty) {
                        const dates = dateParty.split(',');
                        date = dates.reduce((a, b) => new Date(a).getTime() - new Date(data.CreateDate).getTime() >
                            new Date(b).getTime() - new Date(data.CreateDate).getTime() ? a : b);
                    }

                    let year;
                    let month;
                    if (date) {
                        year = new Date(date).getFullYear();
                        month = this.months[new Date(date).getMonth()];
                    }
                    if (nameProject) {
                        data.Number = nameProject.Number;
                        data.Name = nameProject.Name;
                        data.Status = findStatus.Name;
                        data.Day = data.day;
                        data.Money = data.money;
                        data.Year = year;
                        data.Month = month;
                    }
                });
                this.loading = false;
                return item;
            });
        }
    }

    private _getProjects() {
        return this._projectsService.getProject()
            .pipe(map((item: any) => {
                this.projects = item.message;
                return item;
            }));
    }
}
