/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {ViewsProvider} from "../../../../../modules/search/views/providers/views.provider";
// import {ProgressColumnModule} from '../../../../../modules/search/grid/comps/columns/progress';
// import {IconsColumnComponent} from "../../../../../modules/search/grid/comps/columns/icons/icons";
import {ViewsConfig} from "../../../../../modules/search/views/views.config";
import {ThumbnailFormatter} from "../../../../../modules/search/slick-grid/formatters/thumbnail/thumbnail.formatter";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {RESTColumSetup, SlickGridColumn} from "../../../../../modules/search/slick-grid/types";
import {StatusFormatter} from "../../../../../modules/search/slick-grid/formatters/status/status.formatter";
import {SettingsFormatter} from "../../../../../modules/search/slick-grid/formatters/settings/settings.formatter";
import {BasketFormatter} from "../../../../../modules/search/slick-grid/formatters/basket/basket.formatter";
import {IconsFormatter} from "../../../../../modules/search/slick-grid/formatters/icons/icons.formatter";
import {DatetimeFormatter} from "../../../../../modules/search/slick-grid/formatters/datetime/datetime.formatter";
import {DragDropFormatter} from "../../../../../modules/search/slick-grid/formatters/dragdrop/dragdrop.formatter";

export class MediaInsideMappingViewsProvider extends ViewsProvider {
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

        // Is Live
        // columns.unshift({
        //     isFrozen: true,
        //     id: -2,
        //     name: '',
        //     field: '*',
        //     width: 60,
        //     minWidth: 60,
        //     resizable: false,
        //     sortable: false,
        //     multiColumnSort: false,
        //     formatter: IsLiveFormatter,
        //     headerCssClass: "disable-reorder",
        //     __isCustom: true,
        //     __text_id: 'settings',
        //     __deps: {
        //         componentFactoryResolver: this.compFactoryResolver,
        //         appRef: this.appRef,
        //         injector: this.injector
        //     }
        // });

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

        // settings
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

        columns.unshift({
            isFrozen: true,
            id: -7,
            name: '',
            field: '*',
            width: 22,
            minWidth: 22,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: DragDropFormatter,
            headerCssClass: "disable-reorder",
            __isCustom: true,
            __text_id: 'drag-drop-control',
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector,
                data: {
                    ddSelector: '#version-inside-mapping-grid'
                }
            }
        });


        return columns;
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
                        resizable: true,
                        sortable: false,
                        multiColumnSort: false,
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
                default:
                    break;
            }
            // Date
            if (bn == 'created_dt' || bn == 'destroy_dt' || bn == 'modified_dt' || bn == 'last_tx_date') {
                // not sure MI_CHECKSUM_DT, MI_DELETED_DT, RETURN_DATE, TX_DATE, WIPE_DT
                colDef = $.extend(true, {}, colDef, {
                    isFrozen: false,
                    minWidth: 60,
                    resizable: true,
                    formatter: DatetimeFormatter,
                    enableColumnReorder: true,
                    __deps: {
                        componentFactoryResolver: this.compFactoryResolver,
                        appRef: this.appRef,
                        injector: this.injector
                    }
                });
            }
        }

        return colDef;
    }

    // /**
    //  * Return custom components for grid column
    //  * @returns {AgRendererComponent}
    //  */
    // getCustomColumnRenderer (field: string):any {
    //   if (field == "Status_text") {
    //     return StatusColumnComponent
    //   }
    //   if (field.toLowerCase() == "media_status_text") {
    //     return LabelStatusColumnComponent
    //   }
    //   if (field.toLowerCase() == "islive") {
    //     return LiveStatusColumnComponent
    //   }
    //   return null
    // }
}
