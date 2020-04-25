import {ChangeDetectionStrategy, Component, Injector, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridFormatterData, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {commonFormatter} from "../common.formatter";
import {SlickGridProvider} from "../../providers/slick.grid.provider";

@Component({
    selector: 'delete-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
      'styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DeleteFormatterComp {
    private params;
    public injectedData: SlickGridFormatterData;
    private provider: SlickGridProvider;
    private column: SlickGridColumn;

    constructor(private injector: Injector) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
        this.column = (<any>this.injectedData).data.columnDef;
        this.provider = this.column.__contexts.provider;
    }
    // delete row
    deleteRow() {
      this.provider.deleteRow({data: this.params});
    }
}

export function DeleteFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    let ctxs = columnDef.__contexts;

    return commonFormatter(DeleteFormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    });
}



