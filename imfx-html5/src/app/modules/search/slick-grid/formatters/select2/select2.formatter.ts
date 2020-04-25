import {ChangeDetectionStrategy, Component, ElementRef, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {
    SlickGridColumn, SlickGridFormatterData, SlickGridRowData,
    SlickGridTreeRowData
} from "../../types";
import {commonFormatter} from "../common.formatter";
import {IMFXControlsSelect2Component} from "../../../../controls/select2/imfx.select2";
import {SlickGridProvider} from "../../providers/slick.grid.provider";

@Component({
    selector: 'select2-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Select2FormatterComp {
    @ViewChild('select2Control') private select2Control: IMFXControlsSelect2Component;
    @ViewChild('select2ControlWrap') private select2ControlWrap: ElementRef;
    private params: SlickGridFormatterData;
    private column: SlickGridColumn;
    private provider: SlickGridProvider;
    public injectedData: {data: SlickGridFormatterData};
    private validationEnabled: boolean = false;

    constructor(private injector: Injector) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
        this.provider = (<any>this.injectedData).data.columnDef.__contexts.provider;
        this.column = (<any>this.injectedData).data.columnDef;
        this.validationEnabled = this.column.__deps.data.validationEnabled;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        $(this.select2ControlWrap.nativeElement).parent().parent().addClass('skipSelection');
        let select2data = this.select2Control.turnArrayOfObjectToStandart(this.column.__deps.data.values, this.column.__deps.data.rule);
        this.select2Control.setData(select2data, true);
        this.select2Control.setSelectedByIds([this.params.value]);
        this.provider.onGetValidation.subscribe((callback) => {
            let isValid = this.getValidation();
            callback(isValid);
        });
    }

    onUpdateControl() {
        let selected = this.select2Control.getSelectedObject();
        this.params.columnDef.__contexts.provider.formatterSelect2OnSelect.emit({data: this.params, value: selected});
        this.select2Control.checkValidation(selected);
    }

    getValidation() {
        return this.select2Control.getValidation();
    }
}
export function Select2Formatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    return commonFormatter(Select2FormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    });
}


