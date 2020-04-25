/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {ViewsProvider} from '../../../../../modules/search/views/providers/views.provider';
import {ViewsConfig} from "../../../../../modules/search/views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {TreeFormatter} from "../../../../../modules/search/slick-grid/formatters/tree/tree.formatter";
import {ThumbnailFormatter} from "../../../../../modules/search/slick-grid/formatters/thumbnail/thumbnail.formatter";

export class VersionsViewsProvider extends ViewsProvider {
    config: ViewsConfig;
    constructor(@Inject(ComponentFactoryResolver) public compFactoryResolver: ComponentFactoryResolver,
                @Inject(ApplicationRef) public appRef: ApplicationRef,
                @Inject(Injector) public injector: Injector) {
        super(compFactoryResolver, appRef, injector);
    }
    /**
     * @inheritDoc
     * @returns {Array}
     */
    getCustomColumns() {
        let columns = [];
        columns.push({
            isFrozen: true,
            id: -99,
            name: '',
            field: '*',
            width: 60,
            resizable: false,
            __isCustom: true,
            __text_id: 'tree',
            sortable: false,
            multiColumnSort: false,
            formatter: TreeFormatter,
            enableColumnReorder: false,
            headerCssClass: "disable-reorder",
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
