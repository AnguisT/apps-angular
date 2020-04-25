/**
 * Created by Sergey Trizna on 9.12.2017.
 */

import {ChangeDetectionStrategy, Component, Injector, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridFormatterData, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {commonFormatter} from "../common.formatter";

@Component({
    selector: 'thumbnail-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
      'styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ThumbnailFormatterComp {
    // @ViewChild('thumbComp') private compRef: ThumbComponent;
    private params;
    public injectedData: SlickGridFormatterData;

    constructor(private injector: Injector) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(){
        console.log('destroed', this);
        // debugger;

    }
}

export function ThumbnailFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    let ctxs = columnDef.__contexts;
    if (!ctxs.provider.isThumbnails()) {
        return;
    }

    return commonFormatter(ThumbnailFormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    });
}



