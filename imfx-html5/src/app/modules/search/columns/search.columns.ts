/**
 * Created by Sergey Klimenko on 08.03.2017.
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, ViewEncapsulation} from '@angular/core';
import {SearchColumnsConfig} from './search.columns.config';
import {SearchColumnsProvider} from './providers/search.columns.provider';
import {SearchColumnsService} from './services/search.columns.service';
import * as $ from 'jquery';
import {SlickGridProvider} from '../slick-grid/providers/slick.grid.provider';
import {SlickGridColumn} from '../slick-grid/types';
import {IMFXModalComponent} from "../../imfx-modal/imfx-modal";

@Component({
    selector: 'search-modal',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SearchColumnsService,
        SearchColumnsProvider,
        SlickGridProvider
    ]
})

export class SearchColumnsComponent {
    columns: SlickGridColumn[] = [];
    selectedAll: boolean = false;
    private isDefault: boolean = false;
    private isGlobal: boolean = false;
    private config = <SearchColumnsConfig>{
        componentContext: <any>null,
        options: {},
    };

    private sgp: SlickGridProvider;
    private modalRef: IMFXModalComponent;

    constructor(protected service: SearchColumnsService,
                protected provider: SearchColumnsProvider,
                private cdr: ChangeDetectorRef,
                private injector: Injector) {
        this.modalRef = this.injector.get('modalRef');
        let modalData: { compContext: any } = this.modalRef.getData();
        this.sgp = modalData.compContext.slickGridComp.provider;
    }

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    ngAfterViewInit() {
        // this.columns = _cols.sort(function(a:SlickGridColumn, b: SlickGridColumn){
        //     if(a.name < b.name) return -1;
        //     if(a.name > b.name) return 1;
        //     return 0;
        // });
        this.columns = this.sgp.getGlobalColumns();

        this.cdr.detectChanges();
    }

    public isActiveColumn(col: SlickGridColumn): boolean {
        let actualColumns: SlickGridColumn[] = this.sgp.getActualColumns();
        let res = false;
        $.each(actualColumns, (k, c: SlickGridColumn) => {
            if (c.field === col.field) {
                res = true;
                return false;
            }
        });
        return res;
    }

    onOk() {
        this.modalRef.modalEvents.emit({
            name: 'ok', state: {
                isGlobal: this.isGlobal,
                isDefault: this.isDefault
            }
        });
    }

    onOkAndSave() {
        if(!this.viewHasColumns()){
            return false;
        }
        this.modalRef.modalEvents.emit({
            name: 'ok_and_save', state: {
                isGlobal: this.isGlobal,
                isDefault: this.isDefault
            }
        });
    }

    hide() {
        this.modalRef.hide();
        this.modalRef.modalEvents.emit({
            name: 'hide',
        });
    }

    private viewHasColumns(): boolean {
        return this.sgp.getSlick().getColumns().length>0?true:false;
    }

    private setCheckbox(event, col): void {
        let $inputElement = $(event.target.parentElement).find('input');
        let input = $inputElement[0];
        let check = (<HTMLInputElement>input).checked;
        if (event.target.checked || ((event.target.className === 'modal-col') && !check)) {
            this.sgp.addActualColumn(col);
        } else {
            this.sgp.removeActualColumn(col);
        }
        this.sgp.applyColumns();
    }

    private selectAll(): void {
        let frozenColumns = this.sgp.getFrozenColumns();
        if (this.selectedAll) { // deselect all
            this.sgp.setActualColumns(frozenColumns);
        } else {
            let cols = this.sgp.getGlobalColumns();
            this.sgp.setActualColumns(frozenColumns.concat(cols));
        }
        this.selectedAll = !this.selectedAll;
        this.sgp.applyColumns();
    }
}
