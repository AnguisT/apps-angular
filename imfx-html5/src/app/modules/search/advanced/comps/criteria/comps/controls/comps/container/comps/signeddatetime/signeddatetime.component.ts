/**
 * Created by Sergey Trizna on 09.12.2016.
 */
import {ChangeDetectorRef, Component, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {AdvancedSearchDataForControlType, AdvancedSearchDataFromControlType} from "../../../../../../../../types";
import {SearchAdvancedCriteriaProvider} from "../../../../../../providers/provider";
import {IMFXControlsDateTimePickerComponent} from "../../../../../../../../../../controls/datetimepicker/imfx.datetimepicker";
import {IMFXControlsSelect2Component} from "../../../../../../../../../../controls/select2/imfx.select2";
import {
    AdvancedCriteriaControlSignedDateTimeDirtyValueType,
    AdvancedCriteriaControlSignedDateTimeOptionType
} from "./types";
import {DatePipe} from "@angular/common";
import {TranslateService} from "ng2-translate";
@Component({
    selector: 'advanced-criteria-control-singledatetime',
    templateUrl: "tpl/index.html",
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})

export class IMFXAdvancedCriteriaControlSignedDateTimeComponent {
    public data: AdvancedSearchDataForControlType;
    @ViewChild('control') private control: IMFXControlsDateTimePickerComponent;
    @ViewChild('controlSelector') private controlSelector: IMFXControlsSelect2Component;
    @ViewChild('controlInput') private controlInput: any; // input

    // private defaultDate = new Date();
    private modeAbs: boolean = true;
    private intervals = [
        {id: 'd', text: 'Days'},
        {id: 'h', text: 'Hours'}
    ];
    private selectedInterval = 'd';
    private relativeToInt = (10000 * 1000 * 60 * 60);
    private opts: any;
    constructor(private injector: Injector,
                private transfer: SearchAdvancedCriteriaProvider,
                private translate: TranslateService,
                protected cdr: ChangeDetectorRef) {
        this.data = this.injector.get('data');

        this.transfer.onSelectedOperator.subscribe(() => {
            this.setFocus();
        });
        // this.defaultDate.setHours(0);
        // this.defaultDate.setMinutes(0);
        // this.defaultDate.setSeconds(0);
    }

    ngAfterViewInit() {
        let value: AdvancedSearchDataFromControlType = this.data.criteria.data.value;
        if (value) {
            let v = typeof value.value == "string" ? parseInt(value.value) : value.value;
            let dv: AdvancedCriteriaControlSignedDateTimeDirtyValueType = value.dirtyValue;
            if (!dv) {
                let isRelative = this.isRelative(v);
                this.setAbsMode(!isRelative, true);
                if (isRelative) {
                    let ctrlVal = v / this.relativeToInt;
                    if (ctrlVal >= 24 || ctrlVal <= -24 && (ctrlVal % 24) == 0) {
                        this.selectedInterval = 'd';
                        ctrlVal = ctrlVal / 24;
                    } else {
                        this.selectedInterval = 'h'
                    }
                    this.controlInput.nativeElement.value = ctrlVal;
                } else {
                    let ts = this.ticksToMilliseconds(v);
                    if (ts) {
                        this.control.setValue(this.dateToUTC(new Date(ts)));
                    }
                }
            } else {
                if(value.options){
                    this.opts = value.options;
                    this.modeAbs = value.options.modeAbs;
                    if(this.modeAbs == false) {
                        this.selectedInterval = value.options.selectedInterval;
                        let ctrlVal = v / this.relativeToInt;
                        if (ctrlVal >= 24 || ctrlVal <= -24 && (ctrlVal % 24) == 0) {
                            this.selectedInterval = 'd';
                            ctrlVal = ctrlVal / 24;
                        } else {
                            this.selectedInterval = 'h'
                        }
                        this.controlInput.nativeElement.value = ctrlVal;
                    } else {
                        let dt = this.dateToUTC(new Date(value.dirtyValue));
                        if(value.options.withTime == false) {
                            dt.setHours(0);
                            dt.setMinutes(0);
                            dt.setSeconds(0);
                            dt.setMilliseconds(0);
                            dt.setUTCHours(0);
                            dt.setUTCMinutes(0);
                            dt.setUTCSeconds(0);
                            dt.setUTCMilliseconds(0);
                        }
                        this.control.setValue(this.dateToUTC(dt));
                    }
                }
            }
            this.transferData();
        }

        this.setFocus();
    }

    /**
     * Send data to parent comp
     */
    transferData() {
        setTimeout(() => {
            let val: Date | number;
            let intervalType: 'd' | 'h';
            let reqVal;
            if (this.modeAbs) {
                let date: Date = this.control.getValue();
                if (!date) {
                    return;
                }
                if(!this.opts){
                    val = this.dateToUTC(date);
                } else {
                    val = date;
                }

                if (val) {
                    reqVal = this.timestampToTicks(val.getTime());
                }
            } else {
                let modificator = 1;
                intervalType = this.controlSelector.getSelected();
                val = <number>parseInt(this.controlInput.nativeElement.value);
                if (val !== undefined) {
                    if (intervalType == 'd') {
                        modificator = 24;
                    }
                    reqVal = val * 10000 * 1000 * 60 * 60 * modificator
                }
            }

            this.transfer.onSelectValue(<AdvancedSearchDataFromControlType>{
                value: reqVal,
                dirtyValue: <AdvancedCriteriaControlSignedDateTimeDirtyValueType>{
                    mode: <AdvancedCriteriaControlSignedDateTimeOptionType>{
                        abs: this.modeAbs,
                        intervalType: intervalType,
                    },
                    value: <Date>val
                },
                humanValue: this.getHumanValue(val)
            });
        })
    }

    /**
     * Validation
     * @param $event
     */
    validate($event) {
        let allowKeys = [
            // 190, 188, // comma and point
            // 110, // point in small keyboard
            8, 46, // backspace and delete
            37, 39, // left and right buttons
            45 // minus
        ];
        let regexp = new RegExp(/[0-9\+\-]$/);
        if (!regexp.test($event.key) && allowKeys.indexOf($event.keyCode) == -1) {
            $event.preventDefault();
        }
    }

    /**
     * Return human value
     */
    getHumanValue(val) {
        if (!val) {
            return "";
        }
        let res = null;
        if (this.modeAbs) {
            let locale = this.translate.instant('common.locale');
            let datePipe = new DatePipe(locale);
            // datePipe = new DatePipe((<any>window).navigator.userLanguage || (<any>window).navigator.language);
            let format = this.translate.instant('common.date_full_format_datepipe')||'dd.MM.yyyy hh:mm';
            res = datePipe.transform(val, format);
        } else {
            res = val + ' ' + this.intervals[this.selectedInterval == 'h' ? 1 : 0].text;
        }

        return res;
    }

    /**
     * Switch mode
     */
    switchMode() {
        this.setAbsMode(!this.modeAbs);
    }

    /**
     * Set abs mode
     * @param absMode
     * @param silent
     */
    setAbsMode(absMode: boolean, silent: boolean = false) {
        this.modeAbs = absMode;
        this.cdr.detectChanges();
        if (!absMode) {
            setTimeout(() => {
                this.controlSelector.setData(this.intervals);
                this.controlSelector.setSelected(this.selectedInterval);
            })
        }

        if (!silent) {
            this.transferData();
        }
    }

    onSelectInterval() {
        this.selectedInterval = this.controlSelector.getSelected();
        this.transferData();
    }

    setFocus() {
        setTimeout(() => {
            if (this.modeAbs == false) {
                this.controlInput.nativeElement.focus();
            } else {
                // this.control.setFocus();
            }
        })
    }

    timestampToTicks(val: number) {
        return ((val * 10000) + 621355968000000000);
    }

    ticksToMilliseconds(v) {
        return ((v / 10000) - (621355968000000000 / 10000));
    };

    isRelative(v) {
        return (v < 0) || (Math.abs(v) < 10000 * 1000 * 60 * 60 * 24 * 365)
    }

    dateToUTC(d:Date): Date {
        return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getHours(), d.getMinutes(), d.getSeconds())
    }
}
