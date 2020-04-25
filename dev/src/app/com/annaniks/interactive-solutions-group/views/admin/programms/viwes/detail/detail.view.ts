import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, RoutesRecognized } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ProgrammsService } from '../../programms.service';
import { map, filter, pairwise } from 'rxjs/operators';
import { EstimateComponent } from './comps/estimate/estimate.component';
import { ConfirmDialog } from 'src/app/com/annaniks/interactive-solutions-group/dialogs';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-detail-programm',
    templateUrl: './detail.view.html',
    styleUrls: ['./detail.view.scss']
})

export class DetailViewComponent implements OnInit, OnDestroy {

    @ViewChild(EstimateComponent) estimate: EstimateComponent;

    public loading = true;

    public programmForm: FormGroup;
    public programm_id: number;
    public _programmInfo;
    public switchValue = 2;
    public error;
    public validationError;
    public formats = [];
    public nameFilePresentation;
    public nameFileCE;
    public validError = false;
    public estimateData;
    public estimateBody;
    public numberPerson;
    public disabledDurations = true;
    public disabledNumberPerson = true;

    private fromNew = false;

    private _subscription: Subscription = new Subscription();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _fb: FormBuilder,
        private _programmsService: ProgrammsService,
        private _router: Router,
        private _matDialog: MatDialog
    ) {
        this._activatedRoute.params.subscribe((params: Params) => {
            console.log(params);
            if (params && params.id) {
                this.programm_id = params.id;
            }
        });
        this._activatedRoute.queryParams.subscribe((qparams) => {
            if (qparams && qparams.new) {
                this.fromNew = qparams.new;
            }
        });
    }

    ngOnInit() {
        if (!this.fromNew) {
            this.switchValue = 1;
        }
        this.initForm();
        this._combineObservables();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    public saveEstimate(event) {
        this.estimateData = event;
    }

    public saveEstimateBody(event) {
        this.estimateBody = event;
    }

    private _combineObservables(): void {
        const combined = forkJoin(
            this._getAllFormats(),
            this.getProgrammCE(),
        );
        this._subscription = combined.subscribe(() => {
            if (this.programm_id) {
                this.getProgrammById(this.programm_id).subscribe(() => {
                    this.setProgrammValues();
                });
            } else {
                this.loading = false;
            }
        });

    }

    initForm() {
        this.programmForm = this._fb.group({
            Name: [null, Validators.required],
            Duration: [null],
            DurationSwitch: [false],
            DurationFirst: [null],
            DurationSecond: [null],
            NumberPersonSwitch: [null],
            NumberPersonFirst: [null],
            NumberPersonSecond: [null],
            Format: [[], Validators.required],
            NumberPerson: [''],
            Venue: [null, Validators.required],
            Presentation: [null, Validators.compose([
                Validators.required,
                Validators.pattern(
                    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
                )
            ])],
            CE: [null, Validators.compose([
                Validators.required,
                Validators.pattern(
                    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
                )
            ])]
        });
        this.programmForm.get('Duration').setValidators(Validators.required);
        this.programmForm.get('Duration').updateValueAndValidity();
        this.programmForm.get('DurationSwitch').valueChanges.subscribe(data => {
            this.programmForm.get('Duration').clearValidators();
            this.programmForm.get('DurationFirst').clearValidators();
            this.programmForm.get('DurationSecond').clearValidators();
            if (data) {
                this.disabledDurations = false;
                this.programmForm.get('DurationFirst').setValidators(Validators.required);
                this.programmForm.get('DurationSecond').setValidators(Validators.required);
                this.programmForm.get('DurationFirst').updateValueAndValidity();
                this.programmForm.get('DurationSecond').updateValueAndValidity();
            } else {
                this.disabledDurations = true;
                this.programmForm.get('Duration').setValidators(Validators.required);
                this.programmForm.get('Duration').updateValueAndValidity();
            }
            this.programmForm.get('Duration').setValue(null);
            this.programmForm.get('DurationFirst').setValue(null);
            this.programmForm.get('DurationSecond').setValue(null);
        });

        this.programmForm.get('NumberPersonSwitch').valueChanges.subscribe(data => {
            this.programmForm.get('NumberPersonFirst').clearValidators();
            this.programmForm.get('NumberPersonSecond').clearValidators();
            if (data) {
                this.disabledNumberPerson = false;
                this.programmForm.get('NumberPersonFirst').setValidators(Validators.required);
                this.programmForm.get('NumberPersonSecond').setValidators(Validators.required);
                this.programmForm.get('NumberPersonFirst').updateValueAndValidity();
                this.programmForm.get('NumberPersonSecond').updateValueAndValidity();
            } else {
                this.disabledNumberPerson = true;
            }
            this.programmForm.get('NumberPersonFirst').setValue(null);
            this.programmForm.get('NumberPersonSecond').setValue(null);
        });

        this.programmForm.get('DurationFirst').valueChanges.subscribe(data => {
            if (data > this.programmForm.get('DurationSecond').value) {
                this.programmForm.get('DurationSecond').setValue(data);
            }
        });

        this.programmForm.get('DurationSecond').valueChanges.subscribe(data => {
            if (data < this.programmForm.get('DurationFirst').value) {
                this.programmForm.get('DurationSecond').setValue(this.programmForm.get('DurationFirst').value);
            }
        });
    }

    checkDisabled() {
        return this.disabledDurations;
    }

    checkDisabledNumberPerson() {
        return this.disabledNumberPerson;
    }

    changeSwitchValue(val) {
        this.switchValue = val;
    }

    onClickSave() {
        this.loading = true;
        if (this.programmForm.valid) {
            if (!this.programm_id) {
                const body = {...this.programmForm.value};
                if (!body.Duration) {
                    body.Duration = `${body.DurationFirst}-${body.DurationSecond}`;
                }
                body.FormatIds = body.Format.map(ell => ell.Id);
                this._programmsService.addNewProgramm(body).subscribe(data => {
                    this._router.navigate([`/programms/${data['message']}/edit`], {replaceUrl: true, queryParams: {new: true}});
                });
            } else {
                let estimate;
                if (this.estimate) {
                    if (this.estimate.estimateForm.invalid) {
                        this.validError = true;
                        this.validationError = 'Заполните все поля.';
                        this.loading = false;
                        return;
                    }
                    estimate = this.estimate.generateBody();
                } else if (this.estimateData) {
                    if (this.estimateData.invalid) {
                        this.validError = true;
                        this.validationError = 'Заполните все поля.';
                        this.loading = false;
                        return;
                    }
                    estimate = this.estimateBody;
                }
                const body = {...this.programmForm.value, Id: this.programm_id};
                if (!body.Duration) {
                    body.Duration = `${body.DurationFirst}-${body.DurationSecond}`;
                }
                if (body.NumberPersonSwitch) {
                    body.NumberPerson = `${body.NumberPersonFirst}-${body.NumberPersonSecond}`;
                } else {
                    body.NumberPerson = null;
                }
                body.FormatIds = body.Format.map(ell => ell.Id);
                this._programmsService.updateProgramm(body).subscribe(() => {
                    this._programmsService.updateProgrammSA(estimate).subscribe(() => {
                        setTimeout(() => {
                            this.validError = false;
                            this.loading = false;
                        }, 1000);
                    });
                });
            }
        } else {
            this.validError = true;
            this.validationError = 'Заполните все поля.';
            this.loading = false;
        }
    }

    onClickDelete() {
        const dialogRef = this._matDialog.open(ConfirmDialog, {
            width: '350px',
            panelClass: 'padding24'
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this._programmsService.deleteProgramm(this.programm_id).subscribe(() => {
                    this._router.navigate([`/programms`], {replaceUrl: true});
                });
            }
        });
    }

    setProgrammValues() {
        const arrDuration = this._programmInfo['Duration'].split('-');
        const arrNumberPerson = this._programmInfo['NumberPerson'].split('-');
        let switchDurationVal = false;
        let switchNumberPersonVal = false;
        if (arrDuration.length === 2) {
            switchDurationVal = true;
        }
        if (arrNumberPerson.length === 2) {
            switchNumberPersonVal = true;
        }
        this.programmForm.patchValue({
            DurationSwitch: switchDurationVal,
            NumberPersonSwitch: switchNumberPersonVal,
        });
        this.programmForm.patchValue({
            Name: this._programmInfo['Name'],
            Duration: !switchDurationVal ? arrDuration[0] : null,
            DurationFirst: switchDurationVal ? arrDuration[0] : null,
            DurationSecond: switchDurationVal ? arrDuration[1] : null,
            Format: this.findObject(this.formats, 'Id', this._programmInfo['Formats']),
            NumberPersonFirst: switchNumberPersonVal ? arrNumberPerson[0] : null,
            NumberPersonSecond: switchNumberPersonVal ? arrNumberPerson[1] : null,
            Venue: this._programmInfo['Venue'],
            Presentation: this._programmInfo['Presentation'],
            CE: this._programmInfo['CE']
        });
        this.loading = false;
    }

    updateNumberPerson() {
        this.getProgrammCE().subscribe();
    }

    getNumberPerson() {
        return this.programmForm.get('NumberPerson').value;
    }

    public findObject(array: Array<object>, value: string, value1: string | number | Array<number>): Array<object> {
        let filteredArray: Array<object> = [];
        if (array && value && value1) {
            filteredArray = array.filter((element) => {
                return element[value] === value1 || (Array.isArray(value1) && value1.includes(element[value]));
            });
        }
        return filteredArray;
    }

    private getProgrammCE() {
        return this._programmsService.getProgrammCE(this.programm_id).pipe(map((data) => {
            const programm_ce: Array<any> = data['message'];
            let min = 0;
            let max = 0;
            if (programm_ce.length) {
                max = Math.max(...programm_ce.map(pr => Number(pr.NumberPerson)));
                min = Math.min(...programm_ce.map(pr => Number(pr.NumberPerson)));
            }
            this.programmForm.get('NumberPerson').setValue(`от ${min} до ${max}`);
            return data;
        }));
    }

    private _getAllFormats(): Observable<object> {
        return this._programmsService.getAllFormats().pipe(
            map((data) => {
                this.formats = data['message'];
                return data['message'];
            })
        );
    }

    private getProgrammById(Id) {
        return this._programmsService.getOneProgrammById(Id).pipe(
            map((data) => {
                this._programmInfo = data['message'][0];
                return data['message'][0];
            })
        );
    }
}
