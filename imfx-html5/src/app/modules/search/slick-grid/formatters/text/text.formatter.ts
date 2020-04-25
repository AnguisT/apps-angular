import {ChangeDetectionStrategy, Component, ElementRef, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridFormatterData, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {commonFormatter} from "../common.formatter";
import {SlickGridProvider} from "../../providers/slick.grid.provider";
import {Observer} from "rxjs/Observer";

@Component({
    selector: 'texty-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None
})
export class TextFormatterComp {
    @ViewChild('textControl') private textControl: ElementRef;
    @ViewChild('textControlWrap') private textControlWrap: ElementRef;
    private params: SlickGridFormatterData;
    private column: SlickGridColumn;
    private provider: SlickGridProvider;
    private isValid: boolean = true;
    public injectedData: { data: SlickGridFormatterData };
    private validationEnabled: boolean = false;

    constructor(private injector: Injector) {
        this.injectedData = this.injector.get('data');
        this.params = this.injectedData.data;
        this.provider = (<any>this.injectedData).data.columnDef.__contexts.provider;
        this.column = (<any>this.injectedData).data.columnDef;
        this.validationEnabled = this.column.__deps.data.validationEnabled;
    }

    ngOnInit() {
        // this.provider.onGetValidation.subscribe((callback) => {
        //     callback(this.isValid);
        // });
    }

    ngAfterViewInit() {
        // remove selection
        $(this.textControlWrap.nativeElement).parent().parent().addClass('skipSelection');
        // set value
        $(this.textControl.nativeElement).val(this.params.data[this.column.field]);
        if (this.validationEnabled) {
            if (!this.params.data[this.column.field] || this.params.data[this.column.field] == '') {
                $(this.textControl.nativeElement).parent().addClass('error-validation');
                this.isValid = false;
            } else {
                $(this.textControl.nativeElement).parent().removeClass('error-validation');
                this.isValid = true;
            }
        }
        // event
        $(this.textControl.nativeElement).on('keyup', (e) => {
            this.params.columnDef.__contexts.provider.formatterTextOnChange.emit({data: this.params, value: (<any>e.target).value})
            if (this.validationEnabled) {
                if (!(<any>e.target).value || (<any>e.target).value == '') {
                    $((<any>e.target).parentElement).addClass('error-validation');
                    this.isValid = false;
                } else {
                    $((<any>e.target).parentElement).removeClass('error-validation');
                    this.isValid = true;
                }
            }
        });
        // this.subscription = this.provider.onGetValidation.subscribe((callback) => {
        //     callback(this.isValid);
        // });
    }
}
export function TextFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {
    return commonFormatter(TextFormatterComp, {
        rowNumber: rowNumber,
        cellNumber: cellNumber,
        value: value,
        columnDef: columnDef,
        data: dataContext
    });
}


