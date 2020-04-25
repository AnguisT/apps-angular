/**
 * Created by Sergey Trizna on 25.05.2017.
 */
import {
    Component, ViewChild, Injector, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter
} from '@angular/core';
import * as $ from 'jquery';
import { HttpService } from '../../services/http/http.service';
import { ModalConfig } from '../../modules/modal/modal.config';
import { ArrayProvider } from '../../providers/common/array.provider';
import { BsModalService } from 'ngx-bootstrap';


@Component({
    selector: 'report-params',
    templateUrl: './tpl/params.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [
        './styles/params.scss'
    ],
})

export class ReportParamsModalComponent {
    public data;
    public context;
    private buildedParams: Array<any> = [];
    private paramsFilled: boolean = true;
    private generateEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(private injector: Injector,
                private arrayProvider: ArrayProvider,
                private cdr: ChangeDetectorRef,
                private modalService: BsModalService) {
        this.data = this.injector.get('modalRef');
    }

    afterViewInit() {
        let self = this;
        this.modalService.onShown.subscribe(() => {
            self.checkControlsValues();
        });
        // this.data.refs.modal.onShown.subscribe((res) => {
        //     this.checkControlsValues();
        // });
    }

    buildParams(params = []) {
        this.buildedParams = [];
        $.each(params, (key, obj) => {
            this.buildedParams.push(obj);
        });
        this.afterViewInit();
    }

    isControlType(type, controlType) {
        let types = {
            number: [
                'System.Decimal', 'System.Double', 'System.Byte',
                'System.SByte', 'System.Single', 'System.Int16',
                'System.Int32', 'System.Int64', 'System.UInt16',
                'System.UInt32', 'System.UInt64',
            ],
            datetime: [
                'System.DateTime'
            ],
            rangedatetime: [
                'System.TimeSpan'
            ],
            text: [
                'System.Char', 'System.String'
            ],
            checkbox: [
                'System.Boolean'
            ]
        };

        return this.arrayProvider.inArray(types[controlType], type);
    }

    private prepareParams(key, $event) {
        let param = this.buildedParams[key];
        if (this.isControlType(this.buildedParams[key].ParamType, 'number')) {
            param.Value = $event.valueAsNumber;
        } else if (this.isControlType(this.buildedParams[key].ParamType, 'datetime')) {
            param.Value = $event.getTime();
        } else if (this.isControlType(this.buildedParams[key].ParamType, 'text')) {
            param.Value = $event.target.value;
        } else if (this.isControlType(this.buildedParams[key].ParamType, 'checkbox')) {
            param.Value = $event.target.checked;
        } else if (this.isControlType(this.buildedParams[key].ParamType, 'rangedatetime')) {
            param.Value = $event.range;
        } else {
            console.warn(
                this.buildedParams[key].ParamType + ' has not associated with web-control'
            );
        }

        this.checkControlsValues();
    }

    private startGenerateReport() {
        console.log(this.paramsFilled);
        if (!this.paramsFilled) {
            this.generateEvent.emit(this.buildedParams);
        }
    }

    private checkControlsValues(): void {
        // this.paramsFilled = true;
        $.each(this.buildedParams, (key, obj) => {
            if (obj.Value !== null && obj.Value !== '') {
                this.paramsFilled = false;
                return false;
            }
        });

        this.cdr.detectChanges();
    }
}
