import {MediaViewsProvider} from "../../../../../../views/media/providers/views.provider";
import {SettingsFormatter} from "../../../../slick-grid/formatters/settings/settings.formatter";
import {BasketFormatter} from "../../../../slick-grid/formatters/basket/basket.formatter";
import {ThumbnailFormatter} from "../../../../slick-grid/formatters/thumbnail/thumbnail.formatter";
import {IconsFormatter} from "../../../../slick-grid/formatters/icons/icons.formatter";
import {PlayButtonFormatter} from "../../../../slick-grid/formatters/play-button/play-button.formatter";

export class DetailMediaTabViewsProvider extends MediaViewsProvider {

    /**
     * @inheritDoc
     * @returns {Array}
     */
    getCustomColumns() {
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
        // play
        columns.unshift({
            isFrozen: true,
            id: -5,
            name: '',
            field: '*',
            width: 75,
            minWidth: 75,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: PlayButtonFormatter,
            headerCssClass: "disable-reorder",
            __isCustom: true,
            __text_id: 'play-button',
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
            }
        });

        // Basket
        columns.unshift({
            isFrozen: true,
            id: -6,
            name: '',
            field: '*',
            width: 50,
            minWidth: 50,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: BasketFormatter,
            headerCssClass: "disable-reorder",
            __isCustom: true,
            __text_id: 'basket',
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
            }
        });

        // settings
        columns.unshift({
            isFrozen: true,
            id: -7,
            name: '',
            field: '*',
            width: 50,
            minWidth: 50,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: SettingsFormatter,
            headerCssClass: "disable-reorder",
            __isCustom: true,
            __text_id: 'settings',
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
            }
        });


        return columns;
    }

}
