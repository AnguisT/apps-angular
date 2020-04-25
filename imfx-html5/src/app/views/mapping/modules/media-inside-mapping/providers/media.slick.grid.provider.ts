/**
 * Created by Sergey Trizna on 27.12.2017.
 */
import {Inject, Injector} from "@angular/core";
import {SlickGridEventData, SlickGridRowData} from "../../../../../modules/search/slick-grid/types";
import {MediaSlickGridProvider} from "../../../../media/providers/media.slick.grid.provider";
import {MediaInsideMappingComponent} from "../media.component";
import * as Cookies from 'js-cookie';
export class MediaInsideMappingSlickGridProvider extends MediaSlickGridProvider {
    public dragRows: SlickGridRowData = [];
    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
        // this.onDragStartCell.subscribe((data: { row: SlickGridRowData }) => {
        //
        //     this.dragRow = data.row
        // })
        // this.onDropCell.subscribe((data: { row: SlickGridRowData }) => {
        //     console.log('media - onDropCell');
        //     this.dragRow = null
        // })
    }

    onDragRowStart() {
        this.dragRows = this.getSelectedRows();
        console.log('media - onDragStartCell');
    }

    onDragRowDrop() {
        console.log('media - onDragRowDrop');
        this.dragRows = [];
    }

    setSelectedRow(rowId: number = null, eventData?, suppressDataUpdated: boolean = false) {
        Cookies.set('forceBackRoute', 'mapping', { expires: 365 });
        let mappingComp = (<MediaInsideMappingComponent>this.config.componentContext).mappingComp;
        let msgp: any = mappingComp.slickGridComp.provider;
        if (rowId == null) {
            this.getSlick().setSelectedRows([]);
            this._selectedRowsIds = [];
            this.prevRowId = null
        } else {
            msgp.setSelectedRow();
            this.getSlick().setSelectedRows([rowId]);
            this._selectedRowsIds = [rowId];
            if (rowId != this.prevRowId) {
                this.prevRowId = rowId;
                if (!suppressDataUpdated) {
                    // emit data updated
                    let d = this.getSelectedRowData();
                    let c = 0;
                    if (eventData) {
                        c = eventData.cell;
                    }
                    mappingComp.onDataUpdatedForDetail(<SlickGridEventData>{
                        row: d,
                        cell: c,
                    }, 'media-inside-mapping');
                    this.onSelectRow.emit([rowId])
                }
            }
        }

    }

    setSelectedRows(rowIds: number[]) {
        let mappingComp = (<MediaInsideMappingComponent>this.config.componentContext).mappingComp;
        this.getSlick().setSelectedRows(rowIds);
        this._selectedRowsIds = rowIds;
        // setTimeout(() => {
        this.onSelectRow.emit(rowIds)
        // })
        if(rowIds.length > 1) {
            mappingComp.onDataUpdatedForDetail(<SlickGridEventData>{
                row: null,
                cell: null,
            }, 'media-inside-mapping');
        }

    }
}
