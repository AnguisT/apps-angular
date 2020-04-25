/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {SlickGridProvider} from "../../../modules/search/slick-grid/providers/slick.grid.provider";
import {SlickGridEventData, SlickGridResp} from "../../../modules/search/slick-grid/types";
import {SlickGridComponent} from "../../../modules/search/slick-grid/slick-grid";
import {TitlesComponent} from "../titles.component";
import {VersionsInsideTitlesComponent} from "../modules/versions/versions.component";
import {TitlesVersionsSlickGridProvider} from "../modules/versions/providers/titles.versions.slickgrid.provider";
import {TitlesSlickGridService} from "../modules/versions/services/slickgrid.service";
import {SearchModel} from "../../../modules/search/grid/models/search/search";

export class TitlesSlickGridProvider extends SlickGridProvider {
    get service(): TitlesSlickGridService {
        return (<TitlesSlickGridService>this._config.service);
    }

    /**
     * On row changed
     * @param data
     */
    onRowChanged(data: SlickGridEventData): any {
        let comp: TitlesComponent = (<TitlesComponent>this.config.componentContext);
        let versionsGrid: VersionsInsideTitlesComponent = comp.versionsGridRef;
        if(versionsGrid){
            let provider: TitlesVersionsSlickGridProvider = versionsGrid.slickGridComp.provider;
            comp.clearResultForVersionsGrid();
            comp.clearResultForMediaGrid();
            if(data && data.row) {
                provider.showOverlay();
                this.service.getRowsByIdTitlesToVerions(data.row.ID).subscribe((resp: any) => {
                    provider.buildPageByData(resp);
                }, () => {
                    provider.hideOverlay();
                }, () => {
                    provider.hideOverlay();
                });
            }
        }
    }

    // buildPageByData(resp) {
    //     // this.showOverlay();
    //     this.hidePlaceholder();
    //     this.clearData(true);
    //     this.afterRequestData(resp);
    //     // this.hideOverlay();
    // }

    // onRowDoubleClicked(data: SlickGridEventData) {
    //     // canceled
    // }
}
