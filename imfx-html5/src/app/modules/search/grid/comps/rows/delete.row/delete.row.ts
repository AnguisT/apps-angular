import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy
} from '@angular/core';
import { AgRendererComponent } from 'ag-grid-ng2/main';

@Component({
    selector: 'delete-row-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default
})
export class DeleteRowComponent implements AgRendererComponent {
    params: any;
    data: any;
    api: any;
    constructor() {}

    // called on init
    agInit(params: any): void {
        this.params = params;
        this.data = this.params.data;
    }

    // called when the cell is refreshed
    refresh(params: any): void {
        this.params = params;
        this.data = this.params.data;
    }
    // delete row
    deleteRow() {
        let selectedNodes = this.params.api.getSelectedNodes();
        if (selectedNodes) {
            this.params.context.componentParent.deleteRow(selectedNodes[0].data.Id);
            this.params.api.removeItems(selectedNodes);
        }
    }
}

