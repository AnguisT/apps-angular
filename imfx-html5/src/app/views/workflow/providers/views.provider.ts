/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {ViewsProvider} from "../../../modules/search/views/providers/views.provider";
import {ViewsConfig} from "../../../modules/search/views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {SlickGridColumn} from "../../../modules/search/slick-grid/types";
import {JobStatusFormatter} from "../../../modules/search/slick-grid/formatters/job-status/job-status";
// import {JobStatusColumnComponent} from "../comps/grid/columns/status/status";
import {ExpandControlFormatter} from "../../../modules/search/slick-grid/formatters/expand/expand.control.formatter";
import {ExpandContentFormatter} from "../../../modules/search/slick-grid/formatters/expand/expand.content.formatter";
import {DragDropFormatter} from "../../../modules/search/slick-grid/formatters/dragdrop/dragdrop.formatter";
import {EmptyFormatter} from "../../../modules/search/slick-grid/formatters/empty/empty.formatter";
import {DatetimeFormatter} from "../../../modules/search/slick-grid/formatters/datetime/datetime.formatter";
export class WorkflowViewsProvider extends ViewsProvider {
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
        columns.unshift({
            isFrozen: true,
            id: -4,
            name: '',
            field: '*',
            width: 0.1,
            minWidth: 0.1,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: ExpandContentFormatter,
            headerCssClass: "disable-reorder hidden",
            cssClass: '',
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
            id: -5,
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

        columns.unshift({
            isFrozen: false,
            id: -6,
            name: '',
            field: '*',
            width: 10,
            minWidth: 10,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: EmptyFormatter,
            headerCssClass: "disable-reorder",
            __isCustom: true,
            __text_id: 'empty-control',
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
            width: 10,
            minWidth: 10,
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
                    ddSelector: 'workflow-dd-users'
                }
            }
        });

        return columns;
    }

    getFormatterByName(bindingName, col, colDef: SlickGridColumn): SlickGridColumn {
        if (bindingName) {
            switch (bindingName) {
                // Loc status
                case 'CMB_STAT_text':
                    colDef = $.extend(true, {}, colDef, {
                        isFrozen: false,
                        minWidth: 80,
                        formatter: JobStatusFormatter,
                        enableColumnReorder: true,
                        // __text_id: 'status',
                        __deps: {
                            componentFactoryResolver: this.compFactoryResolver,
                            appRef: this.appRef,
                            injector: this.injector
                        }
                    });
                    break;
                // case '':
                //     item._detailContent
                //     break;
                default:
                    break;
            }
            if ( bindingName == 'NEXT_TX_DATE' ||  bindingName == 'MODIFIED' ||  bindingName == 'J_START_DT' ||  bindingName == 'J_END_DT' ||
                bindingName == 'J_CREATED' ||  bindingName == 'J_COMPL_BY' ||  bindingName == 'CREATED') {
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
