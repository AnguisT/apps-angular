import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {AgRendererComponent} from "ag-grid-ng2/main";

@Component({
    selector: 'grid-column-thumb-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ThumbColumnComponent implements AgRendererComponent {
    private params: any;

    @Input('params') set setParams(params) {
        if (params instanceof Object) {
            this.params = $.extend(true, this.params, params);
        }
        else {
            this.params = {
                value: params
            };
        }

    }

    constructor() {
    };

    // called on init
    agInit(params: any): void {
        this.params = params;
    }

    // called when the cell is refreshed
    refresh(params: any): void {
        this.params = params;
    };
}

