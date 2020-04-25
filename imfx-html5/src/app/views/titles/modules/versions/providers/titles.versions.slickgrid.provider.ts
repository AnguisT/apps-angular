/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {Subscription} from "rxjs";
import {VersionsInsideTitlesComponent} from "../versions.component";
import {MediaInsideTitlesComponent} from "../../media/media.component";
import {TitlesMediaSlickGridProvider} from "../../media/providers/titles.media.slickgrid.provider";

import {TitlesSlickGridService} from "../services/slickgrid.service";
import {TitlesComponent} from "../../../titles.component";
import {SlickGridProvider} from "../../../../../modules/search/slick-grid/providers/slick.grid.provider";
import {SlickGridEventData} from "../../../../../modules/search/slick-grid/types";

export class TitlesVersionsSlickGridProvider extends SlickGridProvider {
    /**
     * On row changed
     * @param data
     */
    onRowChanged(data: SlickGridEventData): void {
        let comp: TitlesComponent = (<VersionsInsideTitlesComponent>this.config.componentContext).moduleTitleContext;
        if (!comp) {
            return;
        }
        let titleService: TitlesSlickGridService = (<TitlesSlickGridService>comp.slickGridComp.service);
        let mediaGridRef: MediaInsideTitlesComponent = comp.mediaGridRef;
        let provider: TitlesMediaSlickGridProvider = mediaGridRef.slickGridComp.provider;
        comp.clearResultForMediaGrid();
        if (mediaGridRef && data.row) {
            provider.showOverlay();
            titleService.getRowsByIdVersionsToMedia(data.row.ID).subscribe((resp: any) => {
                provider.buildPageByData(resp);
            }, () => {
                provider.hideOverlay();
            }, () => {
                provider.hideOverlay();
            });
        }
    }

    /**
     * get rows by id
     * @param id
     * @returns {Observable<Subscription>}
     */
    // getRowsById(id: number): Observable<Subscription> {
    //     return Observable.create((observer) => {
    //         debugger;
    //         // let dataSource = {
    //         //     getRows: (params) => {
    //         //         this.config.componentContext.searchGridService.getRowsById(id).subscribe(
    //         //             (resp: any) => {
    //         //                 // If empty resp - build empty page
    //         //                 if (!resp.Data || resp.Data.length == 0) {
    //         //                     // if (!resp.Data || !resp.Rows || resp.Data.length == 0 || resp.Rows <= 0) {
    //         //                     this.buildEmptyPage();
    //         //                     return;
    //         //                 }
    //         //
    //         //                 // Update data in table
    //         //                 params.successCallback(resp.Data, resp.Data.length); // Rows instend
    //         //
    //         //                 // Set selected first row
    //         //                 this.setSelectedRow('first');
    //         //
    //         //                 // Setup data to rows
    //         //                 this.config.gridOptions.rowData = resp.Data;
    //         //             });
    //         //     }
    //         // };
    //         //
    //         // this.config.options.gridRef.api.setDatasource(dataSource);
    //         // let moduleTitleContext = this.config.componentContext.moduleTitleContext;
    //         // if(!moduleTitleContext){
    //         //   return;
    //         // }
    //         // let mediaGridRef = this.config.componentContext.moduleTitleContext.mediaGridRef;
    //         // if (mediaGridRef) {
    //         //   mediaGridRef.searchGridConfig.options.provider.buildEmptyPage();
    //         // }
    //         return observer.next();
    //     });
    // }
}
