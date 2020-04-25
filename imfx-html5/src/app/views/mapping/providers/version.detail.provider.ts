import {DetailProvider} from "../../../modules/search/detail/providers/detail.provider";
import {MappingComponent} from "../mapping.component";
import { appRouter } from '../../../constants/appRouter';

export class VersionDetailProvider extends DetailProvider {
    isEmptyOverlay(): boolean {
        let sgp = (<MappingComponent>this.config.componentContext).slickGridComp.provider;
        return (this.detailInfoForUpdate && this.detailInfoForUpdate.ID) || sgp.getSelectedRowsIds().length == 1 ? false : true;
    }

    getEmptyOverlayText() {
        let sgp = (<MappingComponent>this.config.componentContext).slickGridComp.provider;
        let rowsCount = sgp.getSelectedRowsIds().length;
        if (rowsCount == 0) {
            return this.translate.instant('details_item.select_item');
        } else if (rowsCount > 1) {
            return this.translate.instant('details_item.select_one_item_only', {countSelectedRows: rowsCount});
        }
    }
}
