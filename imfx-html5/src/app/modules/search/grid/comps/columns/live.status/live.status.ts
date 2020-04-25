import {
    Input,
    Component,
    ViewEncapsulation
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'grid-column-live-status-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class LiveStatusColumnComponent implements AgRendererComponent {
    private params:any;
    private isLive:string;
    
    @Input('params') set setParams(params) {
        this.params = $.extend(true, this.params, params);
    }
    ngOnInit() {
        this.setStatus(this.params.data.IsLive);
    }
    // called on init
    agInit(params:any):void {
        this.params = params;
     //   this.setStatus(this.params.value);
    }

    // called when the cell is refreshed
    refresh(params:any):void {
        this.params = params;
        this.setStatus(this.params.data.IsLive);
    }

    private setStatus(live) {
        this.isLive = live;
    }
}

