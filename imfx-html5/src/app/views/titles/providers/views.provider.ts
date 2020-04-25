/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {ViewsProvider} from "../../../modules/search/views/providers/views.provider";
import {ViewsConfig} from "../../../modules/search/views/views.config";
import {StatusColumnComponent} from "../../../modules/search/grid/comps/columns/status/status";
import {LinkColumnComponent} from "../components/link/link";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {RESTColumSetup, SlickGridColumn} from "../../../modules/search/slick-grid/types";
import {StatusFormatter} from "../../../modules/search/slick-grid/formatters/status/status.formatter";
import {TreeFormatter} from "../../../modules/search/slick-grid/formatters/tree/tree.formatter";
import {TreePaddingFormatter} from "../../../modules/search/slick-grid/formatters/tree/tree.padding.formatter";
import {DatetimeFormatter} from "../../../modules/search/slick-grid/formatters/datetime/datetime.formatter";

export class TitlesViewsProvider extends ViewsProvider {
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
            id: -3,
            name: '',
            field: '*',
            width: 80,
            isFrozen: false,
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

        // columns.push({
        //     id: -2,
        //     name: '',
        //     field: '*',
        //     width: 60,
        //     resizable: false,
        //     __isCustom: true,
        //     __text_id: 'tree-padding',
        //     sortable: false,
        //     multiColumnSort: false,
        //     formatter: TreePaddingFormatter,
        //     enableColumnReorder: false,
        //     headerCssClass: "disable-reorder",
        //     // __deps: {
        //     //     componentFactoryResolver: this.compFactoryResolver,
        //     //     appRef: this.appRef,
        //     //     injector: this.injector
        //     // }
        // });

        return columns;
    }

    getCustomColumnRenderer(field: string): any {
        if (field == "Status_text") {
            return StatusColumnComponent
        }
        if (field == "SER_TITLE") {
            return LinkColumnComponent
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
                default:
                    break;
            }
            if ( bn == 'g' /*bn == 'created_dt' ||  bn == 'abs_deleted_dt' ||  bn == 'bfc_cla_dt' ||  bn == 'modified_dt'*/) {
              colDef = $.extend(true, {}, colDef, {
                isFrozen: false,
                minWidth: 60,
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
}
