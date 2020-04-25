/**
 * Created by Sergey Trizna on 26.12.2017.
 */

import {ChangeDetectionStrategy, Component, Injector, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridFormatterData, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {commonFormatter} from "../common.formatter";


@Component({
    selector: 'settings-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SettingsFormatterComp {
    private params;
    public injectedData: SlickGridFormatterData;
    private status: string;

    constructor(private injector: Injector) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
    }

    ngOnInit() {
        // this.setStatus(this.params.value);
    }

    ngAfterViewInit() {
    }
}

export function SettingsFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    return commonFormatter(SettingsFormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    })
}



