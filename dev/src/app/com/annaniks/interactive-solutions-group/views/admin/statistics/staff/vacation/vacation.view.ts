import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { CookieService } from 'angular2-cookie';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { ProjectsService } from '../../../projects/projects.service';
import { Subject } from 'rxjs';
import { DxDataGridComponent } from 'devextreme-angular';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';
import { AddVacationDialogComponent } from 'src/app/com/annaniks/interactive-solutions-group/dialogs';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-vacation',
    templateUrl: './vacation.view.html',
    styleUrls: ['./vacation.view.scss']
})
export class VacationView implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    expandedElement;
    loading = false;
    userId;
    positionId;
    accountVacation;
    projects;
    generalPosition = [16, 17, 22, 14];
    status = [
        { Id: 0, Name: 'Не завершен' },
        { Id: 1, Name: 'Завершен' }
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
        private data: MsgService,
        private _matDialog: MatDialog
    ) {
        this.userId = this._cookieService.get('Id');
        this.positionId = Number(this._cookieService.get('PositionID'));
    }

    ngOnInit() {
        this.loading = true;
        this._getAllVacation();
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

    updateVacation(event) {
        if (!this.generalPosition.includes(this.positionId)) {
            return;
        }
        const dialogRef = this._matDialog.open(AddVacationDialogComponent, {
            disableClose: true,
            width: '500px',
            data: {data: event.data, userId: this.userId}
        });

        dialogRef.beforeClosed()
            .subscribe((res) => {
                if (res) {
                    console.log(res);
                    if (res.deleteId) {
                        this._configurationService.deleteAccountVacation(res.deleteId)
                            .pipe(takeUntil(this.$destroy))
                            .subscribe(() => {
                                this._getAllVacation();
                            });
                    } else {
                        res.DateStart = formatDate(res.Date[0], 'yyyy-MM-dd', 'en');
                        res.DateEnd = formatDate(res.Date[1], 'yyyy-MM-dd', 'en');
                        res.EmployeeId = parseInt(this.userId, 0);
                        res.Status = res.Status.Id;
                        res.Id = event.data.Id;
                        this._configurationService.updateAccountVacation(res)
                            .pipe(takeUntil(this.$destroy))
                            .subscribe(() => {
                                this._getAllVacation();
                            });
                    }
                }
            });
    }

    private _getAllVacation() {
        if (!this.generalPosition.includes(this.positionId)) {
            return this._configurationService.getAccountVacation(this.userId).subscribe((item: any) => {
                this.accountVacation = item.message;
                this.accountVacation.forEach((data) => {
                    const findStatus = this.status.find(itemStatus => itemStatus.Id === data.Status);
                    data.StatusName = findStatus.Name;
                    const dateStartVacation = new Date(data.DateStart);
                    const dateEndVacation = new Date(data.DateEnd);
                    data.Date = `${data.DateStart} - ${data.DateEnd}`;
                    data['MonthStart'] = this.months[dateStartVacation.getMonth()];
                    data['MonthEnd'] = this.months[dateEndVacation.getMonth()];
                    data['Year'] = dateStartVacation.getFullYear();
                });
                this.loading = false;
                return item;
            });
        } else {
            return this._configurationService.getAllAccountVacation().subscribe((item: any) => {
                this.accountVacation = item.message;
                this.accountVacation.forEach((data) => {
                    const findStatus = this.status.find(itemStatus => itemStatus.Id === data.Status);
                    data.StatusName = findStatus.Name;
                    const dateStartVacation = new Date(data.DateStart);
                    const dateEndVacation = new Date(data.DateEnd);
                    data.Date = `${data.DateStart} - ${data.DateEnd}`;
                    data['MonthStart'] = this.months[dateStartVacation.getMonth()];
                    data['MonthEnd'] = this.months[dateEndVacation.getMonth()];
                    data['Year'] = dateStartVacation.getFullYear();
                });
                this.loading = false;
                return item;
            });
        }
    }
}
