import {Inject, Injector} from "@angular/core";
import {SlickGridEventData, SlickGridRowData} from "../../../modules/search/slick-grid/types";
import {VersionSlickGridProvider} from "../../version/providers/version.slick.grid.provider";
import {MappingComponent} from "../mapping.component";
import {NotificationService} from "../../../modules/notification/services/notification.service";
import {TranslateService} from "ng2-translate";

export class MappingSlickGridProvider extends VersionSlickGridProvider {
    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
        let notificator = injector.get(NotificationService);
        let translate = injector.get(TranslateService);
        this.onDropCell.subscribe((data: { row: SlickGridRowData }) => {
            let mediaInsideMapping = (<MappingComponent>this.config.componentContext).mediaInsideMapping;
            let mimsgp: any = mediaInsideMapping.slickGridComp.provider;
            // setTimeout(() => {

                // this.setSelectedRow();
            // });

            let midIds = mimsgp.dragRows.map((row: SlickGridRowData) => {
                return row.ID;
            });
            mimsgp.dragRows = [];

            (<MappingComponent>this.config.componentContext).mappingService.bindMediaToVersion(data.row.ID, midIds).subscribe((resp: any) => {
                // debugger
                mimsgp.refreshGrid();
                mimsgp.setSelectedRow();
                notificator.notifyShow(1, translate.instant('mapping.bindSuccess'));
            }, (err) => {
                notificator.notifyShow(1, translate.instant('mapping.bindError'));
                console.error(err);
            });
        })

    }

    setSelectedRow(rowId: number = null, eventData?, suppressDataUpdated: boolean = false) {
        let mediaInsideMapping = (<MappingComponent>this.config.componentContext).mediaInsideMapping;
        let mimsgp: any = mediaInsideMapping.slickGridComp.provider;
        if (rowId == null) {
            this.getSlick().setSelectedRows([]);
            this._selectedRowsIds = [];
            this.prevRowId = null
        } else {
            mimsgp.setSelectedRow();
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

                    (<MappingComponent>this.config.componentContext).onDataUpdatedForDetail(<SlickGridEventData>{
                        row: d,
                        cell: c,
                    }, 'mapping');
                    // setImmediate(() => {
                    //     this.onDataUpdated.emit(<SlickGridEventData>{
                    //         row: d,
                    //         cell: c,
                    //     });
                    // })

                    this.onSelectRow.emit([rowId])
                }

            }
        }

    }

}
