import {MediaViewsProvider} from "../../../../../../media/providers/views.provider";
import {Injectable} from "@angular/core";
import { ThumbnailFormatter } from '../../../../../../../modules/search/slick-grid/formatters/thumbnail/thumbnail.formatter';
import { IconsFormatter } from '../../../../../../../modules/search/slick-grid/formatters/icons/icons.formatter';

@Injectable()
export class VersionWizardMediaViewsProvider extends MediaViewsProvider {

    getCustomColumns(){
        let columns = [];


        // icons
        columns.unshift({
            isFrozen: true,
            id: -3,
            name: '',
            field: '*',
            width: 70,
            minWidth: 70,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: IconsFormatter,
            headerCssClass: "disable-reorder",
            __isCustom: true,
            __text_id: 'icons',
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
            }
        });

        // thumbs
        columns.unshift({
            isFrozen: true,
            id: -4,
            name: 'Thumbnail',
            field: '*',
            width: 175,
            minWidth: 175,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: ThumbnailFormatter,
            headerCssClass: "disable-reorder",
            cssClass: 'thumb-wrapper',
            __isCustom: true,
            __text_id: 'thumbnails',
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
            }
        });



        return columns;
    }
}
