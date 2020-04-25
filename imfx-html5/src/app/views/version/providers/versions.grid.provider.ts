/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {Observable, Subscription} from "rxjs";
import {GridProvider} from "../../../modules/search/grid/providers/grid.provider";
import {GridConfig} from "../../../modules/search/grid/grid.config";

export class VersionsGridProvider extends GridProvider {
    /**
     * On mouse down event
     * @param $event
     */
    onRowMousedown(node): any {
        let moduleTitleContext = this.config.componentContext.moduleTitleContext;
        if(!moduleTitleContext){
            return;
        }
        let mediaGridRef = this.config.componentContext.moduleTitleContext.mediaGridRef;
        if (mediaGridRef) {
            if (this.config.options.selectedRowDataId != node.data.ID){
                this.config.options.selectedRowDataId = node.data.ID;
                mediaGridRef.searchGridConfig.options.provider.getRowsById(node.data.ID).subscribe(
                    (resp) => {
                        // On complete
                    }
                )
            }
        }
    }

    /**
     * get rows by id
     * @param id
     * @returns {Observable<Subscription>}
     */
    getRowsById(id: number): Observable<Subscription> {
        return Observable.create((observer) => {
            let dataSource = {
                getRows: (params) => {
                    this.config.componentContext.searchGridService.getRowsById(id).subscribe(
                        (resp: any) => {
                            // If empty resp - build empty page
                            if (!resp.Data || resp.Data.length == 0) {
                                // if (!resp.Data || !resp.Rows || resp.Data.length == 0 || resp.Rows <= 0) {
                                this.buildEmptyPage();
                                return;
                            }

                            // Update data in table
                            params.successCallback(resp.Data, resp.Data.length); // Rows instend

                            // Set selected first row
                            this.setSelectedRow('first');

                            // Setup data to rows
                            this.config.gridOptions.rowData = resp.Data;
                        });
                }
            };

            this.config.options.gridRef.api.setDatasource(dataSource);
            let moduleTitleContext = this.config.componentContext.moduleTitleContext;
            if(!moduleTitleContext){
                return;
            }
            let mediaGridRef = this.config.componentContext.moduleTitleContext.mediaGridRef;
            if (mediaGridRef) {
                mediaGridRef.searchGridConfig.options.provider.buildEmptyPage();
            }
            return observer.next();
        });
    }
}
