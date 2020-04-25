import {
    Input,
    Component,
    ViewEncapsulation
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'status-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class StatusComponent implements AgRendererComponent {
    private params:any
    
    @Input('params') set setParams(params) {
        this.params = $.extend(true, this.params, params);
    }
    ngOnInit() {
    }
    // called on init
    agInit(params:any):void {
        this.params = params;
    }

    // called when the cell is refreshed
    refresh(params:any):void {
        this.params = params;
    }
}

