import {SlickGridProvider} from "../../../../slick-grid/providers/slick.grid.provider";
import {Injectable} from "@angular/core";
import {Observable, Subscription} from "rxjs/Rx";
import {SlickGridResp, SlickGridRowData} from "../../../../slick-grid/types";

@Injectable()
export class VersionsTabSlickGridProvider extends SlickGridProvider {
    /**
     * On mouse down event
     * @param $event
     */
    onRowMousedown(node): any {
        // let moduleTitleContext = this.config.componentContext.moduleTitleContext;
        // if(!moduleTitleContext){
        //     return;
        // }
        // let mediaGridRef = this.config.componentContext.moduleTitleContext.mediaGridRef;
        // if (mediaGridRef) {
        //     if (this.config.options.selectedRowDataId != node.data.ID){
        //         this.config.options.selectedRowDataId = node.data.ID;
        //         mediaGridRef.searchGridConfig.options.provider.getRowsById(node.data.ID).subscribe(
        //             (resp) => {
        //                 // On complete
        //             }
        //         )
        //     }
        // }
    }

    /**
     * get rows by id
     * @param id
     * @returns {Observable<Subscription>}
     */
    getRowsById(id: number): Observable<SlickGridResp> {
        return Observable.create((observer) => {
            this.config.componentContext.searchGridService.getRowsById(id).subscribe(
                (resp: SlickGridRowData[]) => {
                    return observer.next(resp);
                });
        });
    }
}
