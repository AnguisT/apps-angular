import {
    Component,
    ViewEncapsulation
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'grid-column-status-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class LinkColumnComponent implements AgRendererComponent {
    private params:any;
    private status:string;

    // called on init
    agInit(params:any):void {
        this.params = params;
    }

    // called when the cell is refreshed
    refresh(params:any):void {
        this.params = params;
    }
}

