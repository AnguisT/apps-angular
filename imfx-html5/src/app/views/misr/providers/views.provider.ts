import {ViewsProvider} from "../../../modules/search/views/providers/views.provider";
import {ViewsConfig} from "../../../modules/search/views/views.config";
import {ExpandContentFormatter} from "../../../modules/search/slick-grid/formatters/expand/expand.content.formatter";
import {ExpandControlFormatter} from "../../../modules/search/slick-grid/formatters/expand/expand.control.formatter";
import {StatusFormatter} from "../../../modules/search/slick-grid/formatters/status/status.formatter";
import {RESTColumSetup, SlickGridColumn} from "../../../modules/search/slick-grid/types";

export class MisrViewsProvider extends ViewsProvider {
    config: ViewsConfig;

    /**
     * @inheritDoc
     * @returns {Array}
     */
    getCustomColumns() {
        let columns = [];
        // columns.unshift({
        //     cellRendererFramework: MisrSettingsColumnComponent,
        //     $$id: -2,
        //     field: "_settings",
        //     headerName: "",
        //     width: 35,
        //     sortable: false,
        //     resizeable: false,
        //     pinned: this.shouldPinColumn(),
        //     suppressMovable: true,
        //     setupCol: false,      //for setup modal
        //     suppressSorting: true, //can't sort
        // });
        // columns.unshift({
        //     cellRendererFramework: null,
        //     $$id: -3,
        //     cellRenderer: 'group',
        //     field: "_subrow",
        //     headerName: "",
        //     width: 22,
        //     sortable: false,
        //     resizeable: false,
        //     pinned: this.shouldPinColumn(),
        //     suppressMovable: true,
        //     setupCol: false,      //for setup modal
        //     suppressSorting: true //can't sort
        // });

        columns.unshift({
            isFrozen: true,
            id: -6,
            name: '',
            field: '*',
            width: 0.1,
            minWidth: 0.1,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: ExpandContentFormatter,
            headerCssClass: "disable-reorder hidden",
            cssClass: 'hidden',
            __isCustom: true,
            __text_id: 'expand-content',
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
            }
        });
        columns.unshift({
            isFrozen: false,
            id: -7,
            name: '',
            field: '*',
            width: 40,
            minWidth: 40,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: ExpandControlFormatter,
            headerCssClass: "disable-reorder",
            __isCustom: true,
            __text_id: 'expand-control',
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
            }
        });

        return columns;
    }
    getFormatterByName(bindingName: string, col: RESTColumSetup, colDef: SlickGridColumn): SlickGridColumn {
        if (bindingName) {
            let bn = bindingName.toLowerCase();
            switch (bn) {
                // status
                case 'misr_status_text':
                    colDef = $.extend(true, {}, colDef, {
                        minWidth: 60,
                        formatter: StatusFormatter,
                        // enableColumnReorder: true,
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
        }

        return colDef;
    }
}
