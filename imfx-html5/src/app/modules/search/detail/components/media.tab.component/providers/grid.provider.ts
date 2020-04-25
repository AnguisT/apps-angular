/**
 * Created by Sergey Trizna on 11.11.2017.
 */
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {appRouter} from "../../../../../../constants/appRouter";
import * as Cookies from 'js-cookie';
import {MediaSlickGridProvider} from "../../../../../../views/media/providers/media.slick.grid.provider";
import {Inject, Injector} from "@angular/core";
import {MediaGridService} from "../../../../../../views/titles/modules/media/services/grid.service";
import {MediaTabGridService} from "../services/grid.service";

export class DetailMediaTabGridProvider extends MediaSlickGridProvider {

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
    }

    /**
     * get rows by id
     * @param id
     * @returns {Observable<Subscription>}
     */
    getRowsById(id: number): Observable<Subscription> {
        return Observable.create((observer) => {
            this.showOverlay();
            // this.clearData();
            if (this.componentContext.slickGridComp) {
                (<MediaTabGridService | MediaGridService>this.componentContext.slickGridComp.service).getRowsById(id).subscribe((resp: any) => {
                    this.buildPageByData(resp);
                    this.hideOverlay();
                });
            }
            // let dataSource = {
            //     getRows: (params) => {
            //         this.config.componentContext.searchGridService.getRowsById(id).subscribe(
            //             (resp: any) => {
            //                 // If empty resp - build empty page
            //                 if (!resp.Data || resp.Data.length == 0) {
            //                     this.buildEmptyPage();
            //                     return;
            //                 }
            //
            //                 // Update data in table
            //                 params.successCallback(resp.Data, resp.Data.length); // Rows instend
            //
            //                 // Set selected first row
            //                 this.setSelectedRow('first');
            //
            //                 // Setup data to rows
            //                 this.config.gridOptions.rowData = resp.Data;
            //             });
            //     }
            // };
            //
            // this.config.options.gridRef.api.setDatasource(dataSource);

            return observer.next();
        });
    }


    /**
     * On double click by row
     * @param $event
     */
    onRowDoubleClicked(data): any {
        // if (event.target['tagName'] == 'IMG' && (event.target['className'] == 'settings-icon' || event.target['className'] == 'media-basket-icon')) {
        //     return;
        // }

        let force = this.config.componentContext ? this.config.componentContext.config.typeDetails : 'version-details';
        Cookies.set('forceBackRoute', force, {expires: 365});
        let destination = this.config.options.type.replace('inside-', '').toLowerCase();
        this.router.navigate(
            [
                appRouter[destination].detail.substr(
                    0,
                    appRouter[destination].detail.lastIndexOf('/')),
                (<any>data.row).ID
            ]
        );
    }
}
