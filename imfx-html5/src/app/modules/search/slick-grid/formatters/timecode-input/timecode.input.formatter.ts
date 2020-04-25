import {ChangeDetectionStrategy, Component, ElementRef, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridFormatterData, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {commonFormatter} from "../common.formatter";
import * as $ from "jquery";
import 'script-loader!../../../../controls/timecode/libs/jquery.maskedinput.js';
// import 'script-loader!jquery-mask-plugin/dist/jquery.mask.js';

@Component({
    selector: 'timecode-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
      './styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TimecodeInputFormatterComp {
    @ViewChild('timecodeElement') public timecodeElement: ElementRef;
    private params;
    public injectedData: SlickGridFormatterData;
    public timecode: string;
    public pattern = /^(?:(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d):)?([0-2]?\d)$/;

    constructor(private injector: Injector) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
        this.timecode = this.params.value;
    }
    ngAfterViewInit() {
        (<any>$(this.timecodeElement.nativeElement)).mask('99:99:99:99', { placeholder: '-', autoclear: false});
    }
    onKeyPress($event) {
        switch ($event.which) {
            case 13: {// enter
                this.params.columnDef.__contexts.provider.componentContext.onTimecodeEdit.emit({
                    timecode: this.timecodeElement.nativeElement.value,
                    type: this.params.columnDef.name
                });
                break;
            }
            default: {
                break;
            }
        }
    }
}

export function TimecodeInputFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    let ctxs = columnDef.__contexts;

    return commonFormatter(TimecodeInputFormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    });
}



