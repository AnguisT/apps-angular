/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {DetailProvider} from '../../../../../modules/search/detail/providers/detail.provider';
import {MediaInsideMappingComponent} from "../media.component";
import {MappingComponent} from "../../../mapping.component";
import {appRouter} from "../../../../../constants/appRouter";
import {SessionStorageService} from "ng2-webstorage";
import {TranslateService} from "ng2-translate";
import {ActivatedRoute, Router} from "@angular/router";
import {Inject, Injector} from "@angular/core";
import {Location} from "@angular/common";

export class MediaDetailInsideMappingProvider extends DetailProvider {
  constructor(@Inject(ActivatedRoute) public route: ActivatedRoute,
              @Inject(Location) public location: Location,
              @Inject(SessionStorageService) public storage: SessionStorageService,
              @Inject(Router) public router: Router,
              @Inject(TranslateService) public translate: TranslateService,
              @Inject(Injector) public injector: Injector) {
      super(route,location, storage, router, translate, injector);
      this.inducingComponent = 'mapping';
  }
    isEmptyOverlay(): boolean {
        let res: boolean = true;
        let sgp = (<MappingComponent>this.config.componentContext).mediaInsideMapping.slickGridComp.provider;
        if(this.detailInfoForUpdate && this.detailInfoForUpdate.ID){
            if(sgp.getSelectedRowsIds().length == 1 ){
                res = false
            } else {
                res = true;
            }
        } else {
            res = true;
        }
        //
        // if(res == true) {
        //     console.log(res);
        //     sgp.onSelectRow.emit(sgp.getSelectedRowsIds());
        // }

        return res;
    }

    getEmptyOverlayText() {
        let sgp = (<MappingComponent>this.config.componentContext).mediaInsideMapping.slickGridComp.provider;
        let rowsCount = sgp.getSelectedRowsIds().length;
        if (rowsCount == 0) {
            return this.translate.instant('details_item.select_item');
        } else if (rowsCount > 1) {
            return this.translate.instant('details_item.select_one_item_only', {countSelectedRows: rowsCount});
        }
    }
}
