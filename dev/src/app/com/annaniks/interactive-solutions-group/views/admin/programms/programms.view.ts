import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ProgrammsService } from './programms.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { MsgService } from '../../../services/sharedata';
import { Subject } from 'rxjs';
import { ExportService } from '../../../services/export.service';

@Component({
    selector: 'app-programms',
    templateUrl: 'programms.view.html',
    styleUrls: ['programms.view.scss']
})

export class ProgrammsViewComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public loading = true;
    public dataSource = [];
    private $destroy: Subject<void> = new Subject<void>();

    constructor(
        private _router: Router,
        private _programmsService: ProgrammsService,
        private data: MsgService,
        public _exportService: ExportService
    ) { }

    ngOnInit() {
        this.getAllProgramm();
    }

    ngAfterViewInit(): void {
        this._exportTable();
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    private _exportTable() {
        this.data.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
            this._programmsService.exportAllProgramm().subscribe(data => {
                this._exportService.exportExcel(data, 'Игровые программы');
            });
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

    showDetail(event) {
        if (event.key && event.rowType === 'data') {
            this._router.navigate(['/programms/' + event.key + '/edit']);
        }
    }

    calculatePresentation(data) {
        return `<a href="${data.Presentation}" target="_blank">Ссылка</a>`;
    }

    calculateCE(data) {
        return `<a href="${data.CE}" target="_blank">Ссылка</a>`;
    }

    private getAllProgramm() {
        this._programmsService.getAllProgramm().subscribe((data) => {
            const programs = data['message'];
            const program_ce = data['programm_ce']['message'];
            programs.forEach(program => {
                if (program.MinNumberPerson) {
                    program.NumberPerson = `от ${program.MinNumberPerson} до ${program.MaxNumberPerson}`;
                }
                program.ce = program_ce.filter(ce => ce.ProgrammId === program.Id);
                program.ce.forEach((ce, ind) => {
                    if (program.ce[ind - 1]) {
                        ce.ViewNumberPerson = `от ${program.ce[ind - 1].NumberPerson + 1} до ${ce.NumberPerson}`;
                    } else {
                        ce.ViewNumberPerson = `от ${0} до ${ce.NumberPerson}`;
                    }
                });
            });
            this.dataSource = programs.reverse();
            this.loading = false;
        });
    }
}
