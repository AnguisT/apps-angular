import {
    Input,
    Component,
    ViewEncapsulation
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'grid-column-label-status-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class LabelStatusColumnComponent implements AgRendererComponent {
    private params:any;
    private colorHex:string;
    
    @Input('params') set setParams(params) {
        this.params = $.extend(true, this.params, params);
    }
    ngOnInit() {
        this.setStatus(this.params.data.MEDIA_STATUS_color);
    }
    // called on init
    agInit(params:any):void {
        this.params = params;
     //   this.setStatus(this.params.value);
    }

    // called when the cell is refreshed
    refresh(params:any):void {
        this.params = params;
        this.setStatus(this.params.data.MEDIA_STATUS_color);
    }

    private setStatus(colorHex) {
        this.colorHex = colorHex;
    }
}

