/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {ViewsProvider} from "../../../../../modules/search/views/providers/views.provider";
import {ViewsConfig} from "../../../../../modules/search/views/views.config";
import {ThumbnailFormatter} from "../../../../search/slick-grid/formatters/thumbnail/thumbnail.formatter";

export class VersionsUploadViewsProvider extends ViewsProvider {
    config: ViewsConfig;

    /**
     * @inheritDoc
     * @returns {Array}
     */
    getCustomColumns() {
        let columns = [];
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

        // columns.push({
        //     cellRendererFramework: ThumbColumnComponent,
        //     $$id: -2,
        //     field: "THUMBURL",
        //     headerName: "Thumbnail", // TODO Translates ?
        //     width: 175,
        //     sortable: false,
        //     suppressMenu: true,
        //     suppressSorting: true,
        //     hide: !this.config.componentContext.searchGridProvider.config.options.isThumbnails,
        //     suppressMovable: true,
        //     pinned: this.shouldPinColumn(),
        //     setupCol: false
        // });
        //
        // columns.unshift({
        //     cellRendererFramework: null,
        //     $$id: 0,
        //     cellRenderer: 'group',
        //     field: "_tree",
        //     headerName: "",
        //     width: 55,
        //     sortable: false,
        //     resizeable: false,
        //     pinned: this.shouldPinColumn(),
        //     suppressMovable: true,
        //     setupCol: false,      //for setup modal
        //     suppressSorting: true //can't sort
        // });
        //
        // columns.unshift({
        //     cellRendererFramework: null,
        //     $$id: 0,
        //     cellRenderer: 'group',
        //     field: "_tree",
        //     headerName: "",
        //     width: 55,
        //     sortable: false,
        //     resizeable: false,
        //     pinned: this.shouldPinColumn(),
        //     suppressMovable: true,
        //     setupCol: false,      //for setup modal
        //     suppressSorting: true //can't sort
        // });
        //
        // columns.push({
        //   cellRendererFramework: ThumbColumnComponent,
        //   $$id: -2,
        //   field: "THUMBURL",
        //   headerName: "Thumbnail", // TODO Translates ?
        //   width: 175,
        //   sortable: false,
        //   suppressMenu: true,
        //   suppressSorting: true,
        //   hide: !this.config.componentContext.searchGridProvider.config.options.isThumbnails,
        //   suppressMovable: true,
        //   pinned: this.shouldPinColumn(),
        //   setupCol: false
        // });

        return columns;
    }
}
