import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';

// Loading jQuery
import * as $ from 'jquery';
@Component({
    selector: 'status-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default
})
export class GridRowsDetailComponent implements AgRendererComponent {
    params:any;
    data:any;
    api:any;
    constructor() {}

    // called on init
    agInit(params:any):void {
        this.params = params;
        this.data = this.params.data;
    }

    // called when the cell is refreshed
    refresh(params:any):void {
        this.params = params;
        this.data = this.params.data;
    }

    resizeColumnHeight(params?){
      let parameters = params?params:this.params;
      let height = $("[id='container-" + parameters.data.ID + "']").height();
      params.node.setRowHeight(height);

      setTimeout(() => {parameters.api.onRowHeightChanged(),0});
    }
}

