import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, AfterContentChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ProgrammsService } from '../../../../programms.service';
import {
    AddProgrammCeDialogComponent
} from 'src/app/com/annaniks/interactive-solutions-group/dialogs/add-programm-ce/add-programm-ce.dialog';
import { forkJoin, Subscription, Subject } from 'rxjs';
import { ConfirmDialog } from 'src/app/com/annaniks/interactive-solutions-group/dialogs';
import { ProgramCETemplateDialogComponent } from 'src/app/com/annaniks/interactive-solutions-group/dialogs/program_ce_template/program-ce-template.dialog';
import { MsgService } from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';
import { ExportService } from 'src/app/com/annaniks/interactive-solutions-group/services/export.service';
import { formatDate } from '@angular/common';
import { CookieService } from 'angular2-cookie/core';

@Component({
    selector: 'app-estimate',
    templateUrl: './estimate.component.html',
    styleUrls: ['./estimate.component.scss']
})

export class EstimateComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit {

    @Input('programmId') programmId: number;
    @Input('data') data;
    @Input('validError') validError;
    @Input('programmName') programmName;
    @Output('ondestroy') ondestroy: EventEmitter<any> = new EventEmitter();
    @Output('onestiamtebody') onestiamtebody: EventEmitter<any> = new EventEmitter();
    @Output('onupdatenumberperson') onupdatenumberperson: EventEmitter<any> = new EventEmitter();

    public estimateForm: FormGroup;
    public estimate;
    public programm_ce = [];
    public projectWithCE = [];
    public prevProgramm = null;

    private _subscription: Subscription = new Subscription();
    private $destroy: Subject<void> = new Subject<void>();

    public unitTypes = [
        {
            Id: 1,
            Name: 'Шт'
        },
        {
            Id: 2,
            Name: 'Услуга'
        }
    ];
    public numberPersonTypes = [
        {
            Id: 1,
            Name: 'Фиксировано'
        },
        {
            Id: 2,
            Name: 'Человек'
        }
    ];
    public coefficientTypes = [
        {
            Id: 1,
            Name: 'Да'
        },
        {
            Id: 2,
            Name: 'Нет'
        }
    ];

    constructor(
        private _fb: FormBuilder,
        private _programmsService: ProgrammsService,
        private _matDialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private msgService: MsgService,
        private _exportService: ExportService,
        private _cookieService: CookieService
    ) {}

    ngOnInit() {
        this.initForm();
        const combined = forkJoin(
            this.getProgrammCE()
        );
        this._subscription = combined.subscribe(() => {
            if (this.data) {
                this.estimate = this.data;
                this.estimateForm = this.data;
            }
        });
    }

    ngAfterContentChecked() {
        this.cdr.detectChanges();
    }

    ngAfterViewInit(): void {
        this._exportTable();
    }

    private _exportTable() {
        this.msgService.exportTable$.pipe(takeUntil(this.$destroy)).subscribe(() => {
            const body = {
                ...this.estimateForm.value,
                executorId: this._cookieService.get('Id'),
                programmName: this.programmName,
            };
            body.dateExport = formatDate(new Date(), 'yyyy-MM-dd', 'en');
            this._programmsService.exportEstimate(body).subscribe(res => {
                const buffer = new Uint8Array(res['data']);
                const date = formatDate(new Date(), 'yyyyMMdd', 'en');
                this._exportService.saveExcelFile(buffer, `${date}_CE_IN_OUT_${this.programmName}`);
            });
        });
    }

    public initForm() {
        this.estimateForm = this._fb.group({
            sections: new FormArray([]),
            SelectedProgramm: new FormControl(null),
            Total: new FormControl(0),
            TotalCommission: new FormControl(0),
            TotalNalog: new FormControl(0),
            TotalProfit: new FormControl(0),
            TotalProfitability: new FormControl(0),
            isCommission: new FormControl(false),
            Commission: new FormControl(null),
            Nalog: new FormControl(7),
            CommingAccount: new FormControl(0),
        });
        this.estimateForm.get('SelectedProgramm').valueChanges.subscribe((data) => {
            if (this.prevProgramm) {
                const body = this.generateBody();
                body.ProgrammSubId = this.prevProgramm.Id;
                this._programmsService.updateProgrammSA(body).subscribe(() => {
                    this.getProgrammCE().subscribe(() => {
                        if (!this.data) {
                            if (data && this.programmId) {
                                this._programmsService.getOneSAByCEId(data.Id).subscribe(res => {
                                    this.setCE(data, res['message']);
                                    this.prevProgramm = data;
                                });
                            }
                        }
                    });
                });
            } else {
                if (data && this.programmId) {
                    this._programmsService.getOneSAByCEId(data.Id).subscribe(res => {
                        this.setCE(data, res['message']);
                        this.prevProgramm = data;
                    });
                }
            }
        });
    }

    public setCE(programm, data?) {
        this.estimateForm.patchValue({
            isCommission: programm.isCommission === 0 ? false : true,
            Commission: programm.Commission,
            Nalog: programm.Nalog,
        });
        this.setSection(data);
    }

    public setSection(data) {
        const sections = this.estimateForm.get('sections') as FormArray;
        sections.controls = [];
        sections.push(
            new FormGroup({
                selected: new FormControl(false),
                NameSection: new FormControl('Стоимость игры', Validators.required),
                articles: new FormArray(this.setArticle(data.filter(article => article.Section === 1))),
                TotalSection: new FormControl(0, Validators.required),
            })
        );
        sections.push(
            new FormGroup({
                selected: new FormControl(false),
                NameSection: new FormControl('Расходы', Validators.required),
                articles: new FormArray(this.setArticle(data.filter(article => article.Section === 2))),
                TotalSection: new FormControl(0, Validators.required),
            })
        );
    }

    public setArticle(articles: Array<any>) {
        const arr = [];
        const license = articles.find(article => article.Section === 1 && article.NameArticle === 'Лицензия');
        if (license) {
            articles = articles.filter(article => license.Id !== article.Id);
            articles.unshift(license);
        }
        articles.forEach((article, ind) => {
            if (ind === 0 && article.Section === 1) {
                arr.push(new FormGroup({
                    NameArticle: new FormControl(article.NameArticle, Validators.required),
                    Rate: new FormControl(article.Rate, Validators.required),
                    UnitType: new FormControl(this.unitTypes.find(type => type.Id === article.UnitType), Validators.required),
                    Unit: new FormControl(article.Unit, Validators.required),
                    NumberPersonType: new FormControl(
                        this.numberPersonTypes.find(type => type.Id === article.NumberPersonType), Validators.required
                    ),
                    NumberPerson: new FormControl(article.NumberPerson, Validators.required),
                    CoefficientType: new FormControl(
                        this.coefficientTypes.find(type => type.Id === article.CoefficientType), Validators.required
                    ),
                    Coefficient: new FormControl(article.Coefficient, Validators.required),
                    TotalArticle: new FormControl(article.Total),
                }));
            } else {
                arr.push(new FormGroup({
                    selected: new FormControl(false),
                    NameArticle: new FormControl(article.NameArticle, Validators.required),
                    Rate: new FormControl(article.Rate, Validators.required),
                    UnitType: new FormControl(this.unitTypes.find(type => type.Id === article.UnitType), Validators.required),
                    Unit: new FormControl(article.Unit, Validators.required),
                    NumberPersonType: new FormControl(
                        this.numberPersonTypes.find(type => type.Id === article.NumberPersonType), Validators.required
                    ),
                    NumberPerson: new FormControl(article.NumberPerson, Validators.required),
                    CoefficientType: new FormControl(
                        this.coefficientTypes.find(type => type.Id === article.CoefficientType), Validators.required
                    ),
                    Coefficient: new FormControl(article.Coefficient, Validators.required),
                    TotalArticle: new FormControl(article.Total),
                }));
            }
        });
        return arr;
    }

    public createArticle() {
        return new FormGroup({
            selected: new FormControl(false),
            NameArticle: new FormControl(null, Validators.required),
            Rate: new FormControl(0, Validators.required),
            UnitType: new FormControl(null, Validators.required),
            Unit: new FormControl(0, Validators.required),
            NumberPersonType: new FormControl(null, Validators.required),
            NumberPerson: new FormControl(0, Validators.required),
            CoefficientType: new FormControl(null, Validators.required),
            Coefficient: new FormControl(0, Validators.required),
            TotalArticle: new FormControl(0, Validators.required),
        });
    }

    public addArticle(section) {
        const articles = section.controls.articles as FormArray;
        articles.push(this.createArticle());
    }

    public deleteArticle(section) {
        const articles = section.controls.articles as FormArray;
        const indArray = [];
        articles.controls.forEach((article, ind) => {
            if (article.get('selected')) {
                if (article.get('selected').value) {
                    indArray.push(ind);
                }
            }
        });
        indArray.reverse().forEach((item) => {
            articles.removeAt(item);
        });
    }

    public calculate(article) {
        if (article.get('UnitType').value) {
            article.get('Unit').setValue(article.get('UnitType').value.Id === 2 ? 1 : article.get('Unit').value);
        }
        if (article.get('NumberPersonType').value) {
            if (article.get('NumberPersonType').value.Id === 1 && article.get('selected')) {
                article.get('NumberPerson').setValue(1);
            }
        }
        if (article.get('CoefficientType').value) {
            article.get('Coefficient').setValue(article.get('CoefficientType').value.Id === 2 ? 1 : article.get('Coefficient').value);
        }
        if (article.get('UnitType').value && article.get('NumberPersonType').value && article.get('CoefficientType').value) {
            if (article.get('Rate').value !== 0 && article.get('Unit').value !== 0 &&
            article.get('NumberPerson').value !== 0 && article.get('Coefficient').value !== 0) {
                const unit = article.get('UnitType').value.Id === 2 ? 1 : article.get('Unit').value;
                const numberPerson = article.get('NumberPersonType').value.Id === 1 ? 1 : article.get('NumberPerson').value;
                const coeff = article.get('CoefficientType').value.Id === 2 ? 1 : article.get('Coefficient').value;
                article.get('TotalArticle').setValue(
                    (article.get('Rate').value * unit * numberPerson * coeff).toFixed(2)
                );
            }
        }
    }

    public getTotalSection(section, field, totalField) {
        const articles = section.controls.articles as FormArray;
        let total = 0;
        articles.controls.forEach((article) => {
            total += Number(article.get(field).value);
        });
        section.get(totalField).setValue(total);
        return total;
    }

    public getTotal(field, totalField) {
        const sections = this.estimateForm.get('sections') as FormArray;
        let total = 0;
        sections.controls.forEach((article) => {
            total += Number(article.get(field).value);
        });
        this.estimateForm.get(totalField).setValue(total);
        return total;
    }

    public getCommission() {
        const total = this.getTotal('TotalSection', 'Total');
        if (this.estimateForm.get('isCommission').value) {
            this.estimateForm.get('TotalCommission').setValue((this.estimateForm.get('Commission').value / 100 * total).toFixed(2));
        } else {
            this.estimateForm.get('TotalCommission').setValue(0);
        }
        return this.estimateForm.get('TotalCommission').value;
    }

    public getNalog() {
        const nalog = this.estimateForm.get('CommingAccount').value * (this.estimateForm.get('Nalog').value / 100);
        this.estimateForm.get('TotalNalog').setValue(nalog.toFixed(2));
        return nalog.toFixed(2);
    }

    public getCommingAccount() {
        const commingAccont = this.estimateForm.get('Total').value - this.estimateForm.get('TotalCommission').value;
        this.estimateForm.get('CommingAccount').setValue(commingAccont);
        return commingAccont;
    }

    public getProfit() {
        const sections = this.estimateForm.get('sections') as FormArray;
        if (sections.controls.length) {
            const totalSection = sections.controls[sections.controls.length - 1].get('TotalSection').value;
            const profit = this.estimateForm.get('Total').value - this.estimateForm.get('TotalCommission').value -
                this.estimateForm.get('TotalNalog').value - totalSection;
            this.estimateForm.get('TotalProfit').setValue(profit);
            return profit;
        }
        return 0;
    }

    getProfitability() {
        let res;
        if (this.estimateForm.get('TotalProfit').value !== 0 && this.estimateForm.get('Total').value !== 0) {
            res = (this.estimateForm.get('TotalProfit').value / this.estimateForm.get('Total').value).toFixed(2);
        } else {
            res = 0;
        }
        this.estimateForm.get('TotalProfitability').setValue(res);
        return res;
    }

    public addCE() {
        const dialogRef = this._matDialog.open(AddProgrammCeDialogComponent, {
            width: '300px',
            height: 'auto',
            data: {programm_ce: this.programm_ce}
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                if (this.programmId) {
                    this._programmsService.addProgrammCE({NumberPerson: data, ProgrammId: this.programmId}).subscribe(() => {
                        this.getProgrammCE().subscribe(() => {
                            const newCE = this.programm_ce.find(ce => Number(ce.NumberPerson) === Number(data));
                            this.estimateForm.get('SelectedProgramm').setValue(newCE);
                            this.onupdatenumberperson.emit();
                        });
                    });
                }
            }
        });
    }

    public deleteCE(Id) {
        const dialogRef = this._matDialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this._programmsService.deleteProgrammCE(Id).subscribe(() => {
                    this.getProgrammCE().subscribe(() => {
                        this.initForm();
                        this.onupdatenumberperson.emit();
                    });
                });
            }
        });
    }

    openCETemplateDialog() {
        const dialogRef = this._matDialog.open(ProgramCETemplateDialogComponent, {
            width: '350px',
            height: 'auto',
            data: {Id: this.programmId, programm_ce: this.programm_ce}
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this.getProgrammCE().subscribe(() => {
                    const res = this.programm_ce.find(ce => ce.Id === data);
                    this.estimateForm.get('SelectedProgramm').setValue(res);
                    this.onupdatenumberperson.emit();
                });
            }
        });
    }

    public generateBody() {
        const arr = [];
        const sections = this.estimateForm.get('sections') as FormArray;
        sections.controls.forEach((section, ind) => {
            const articles = section.get('articles') as FormArray;
            articles.controls.forEach((article) => {
                arr.push({
                    Section: ind + 1,
                    ...article.value,
                    ...{
                        UnitType: article.value.UnitType ? article.value.UnitType.Id : null,
                        NumberPersonType: article.value.NumberPersonType ? article.value.NumberPersonType.Id : null,
                        CoefficientType: article.value.CoefficientType ? article.value.CoefficientType.Id : null,
                    }});
            });
        });
        const id = this.estimateForm.get('SelectedProgramm').value ? this.estimateForm.get('SelectedProgramm').value.Id : null;
        return {
            articles: arr,
            ProgrammSubId: id,
            isCommission: this.estimateForm.get('isCommission').value === false ? 0 : 1,
            Commission: this.estimateForm.get('Commission').value,
            Nalog: this.estimateForm.get('Nalog').value,
            Total: this.estimateForm.get('Total').value,
        };
    }

    private getProgrammCE() {
        return this._programmsService.getProgrammCE(this.programmId).pipe(map((data) => {
            this.programm_ce = data['message'];
            return data;
        }));
    }

    ngOnDestroy() {
        this.ondestroy.emit(this.estimateForm);
        this.onestiamtebody.emit(this.generateBody());
        this._subscription.unsubscribe();
        this.$destroy.next();
        this.$destroy.complete();
    }
}
