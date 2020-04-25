/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {ViewsProvider} from "../../../modules/search/views/providers/views.provider";
import {ViewsConfig} from "../../../modules/search/views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {SlickGridColumn} from "../../../modules/search/slick-grid/types";
import {DragDropFormatter} from "../../../modules/search/slick-grid/formatters/dragdrop/dragdrop.formatter";
import {DatetimeFormatter} from "../../../modules/search/slick-grid/formatters/datetime/datetime.formatter";
import {TaskStatusFormatter} from "../../../modules/search/slick-grid/formatters/task-status/task-status";
import {TaskProgressFormatter} from "../../../modules/search/slick-grid/formatters/task-progress/task-progress";
export class TasksMyViewsProvider extends ViewsProvider {
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

        // columns.unshift({
        //     isFrozen: false,
        //     id: -7,
        //     name: '',
        //     field: '*',
        //     width: 13,
        //     minWidth: 13,
        //     resizable: false,
        //     sortable: false,
        //     multiColumnSort: false,
        //     formatter: DragDropFormatter,
        //     headerCssClass: "disable-reorder",
        //     __isCustom: true,
        //     __text_id: 'drag-drop-control',
        //     __deps: {
        //         componentFactoryResolver: this.compFactoryResolver,
        //         appRef: this.appRef,
        //         injector: this.injector,
        //         data: {
        //             ddSelector: 'workflow-dd-users'
        //         }
        //     }
        // });

        return columns;
    }

    getFormatterByName(bindingName, col, colDef: SlickGridColumn): SlickGridColumn {
        if (bindingName) {
            switch (bindingName) {
                // Loc status
                case 'TSK_STATUS_text':
                    colDef = $.extend(true, {}, colDef, {
                        isFrozen: false,
                        minWidth: 80,
                        formatter: TaskStatusFormatter,
                        enableColumnReorder: true,
                        // __text_id: 'status',
                        __deps: {
                            componentFactoryResolver: this.compFactoryResolver,
                            appRef: this.appRef,
                            injector: this.injector
                        }
                    });
                    break;

                case 'TSK_PROGRSS':
                    colDef = $.extend(true, {}, colDef, {
                        isFrozen: false,
                        minWidth: 150,
                        formatter: TaskProgressFormatter,
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
            if (bindingName == 'NEXT_TX_DATE' || bindingName == 'MODIFIED' || bindingName == 'J_START_DT' || bindingName == 'J_END_DT' ||
                bindingName == 'J_CREATED' || bindingName == 'J_COMPL_BY' || bindingName == 'CREATED') {
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
