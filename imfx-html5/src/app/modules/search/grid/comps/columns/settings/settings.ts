import {
    Component,
    ViewEncapsulation,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';
import {Router} from '@angular/router';
import {BasketService} from "../../../../../../services/basket/basket.service";
import * as $ from 'jquery';
@Component({
    selector: 'grid-column-settings-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
})
export class SettingsColumnComponent implements AgRendererComponent {
    params: any;
    url: string;
    componentConfig: any;
    searchType: string;
    rowData = {};

    constructor(private router: Router, private cdr: ChangeDetectorRef, private basketService?: BasketService) {
    }

    // called on init
    agInit(params: any): void {
        this.params = params;
        this.searchType = params.colDef.searchType;
        this.url = this.params.value;
    }

    // called when the cell is refreshed
    refresh(params: any): void {
        this.params = params;
        this.url = this.params.value;
    }
}

