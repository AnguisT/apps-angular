/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {ViewsProvider} from "../../../../../modules/search/views/providers/views.provider";
import {ViewsConfig} from "../../../../../modules/search/views/views.config";
import {LabelStatusColumnComponent} from "../../../../../modules/search/grid/comps/columns/label.status/label.status";
import {StatusColumnComponent} from "../../../../../modules/search/grid/comps/columns/status/status";
import {LiveStatusColumnComponent} from "../../../../../modules/search/grid/comps/columns/live.status/live.status";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector} from "@angular/core";
import {IconsFormatter} from "../../../../../modules/search/slick-grid/formatters/icons/icons.formatter";
import {ThumbnailFormatter} from "../../../../../modules/search/slick-grid/formatters/thumbnail/thumbnail.formatter";
import {BasketFormatter} from "../../../../../modules/search/slick-grid/formatters/basket/basket.formatter";
import {RESTColumSetup, SlickGridColumn} from "../../../../../modules/search/slick-grid/types";
import {StatusFormatter} from "../../../../../modules/search/slick-grid/formatters/status/status.formatter";
@Injectable()
export class TitlesMediaViewsProvider extends ViewsProvider {
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

        // Basket
        columns.unshift({
            isFrozen: true,
            id: -5,
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


        return columns;
    }

    /**
     * Return custom components for grid column
     * @returns {AgRendererComponent}
     */
    getCustomColumnRenderer(field: string): any {
        if (field == "Status_text") {
            return StatusColumnComponent
        }
        if (field.toLowerCase() == "media_status_text") {
            return LabelStatusColumnComponent
        }
        if (field.toLowerCase() == "islive") {
            return LiveStatusColumnComponent
        }
        return null
    }

    getFormatterByName(bindingName: string, col: RESTColumSetup, colDef: SlickGridColumn): SlickGridColumn {
        if (bindingName) {
            let bn = bindingName.toLowerCase();
            switch (bn) {
                // Loc status
                case 'status_text':
                    colDef = $.extend(true, {}, colDef, {
                        isFrozen: false,
                        minWidth: 60,
                        formatter: StatusFormatter,
                        enableColumnReorder: true,
                        // __text_id: 'status',
                        __deps: {
                            componentFactoryResolver: this.compFactoryResolver,
                            appRef: this.appRef,
                            injector: this.injector
                        }
                    });
                    break;
                //need for display 'description' field data in 'Notes' column
                case 'description_nobreaks':
                    colDef = $.extend(true, {}, colDef, {
                        field: "DESCRIPTION"
                    });
                    break;
                default:
                    break;
            }
        }

        return colDef;
    }
}
