/**
 * Created by Sergey Trizna on 13.01.2018.
 */
import {
    ApplicationRef,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    Inject,
    Injector,
    ReflectiveInjector
} from "@angular/core";
import {BasketService} from "../../../services/basket/basket.service";
import {Router} from "@angular/router";
import {WorkflowExpandRowComponent} from "../comps/slickgrid/formatters/expand.row/expand.row.formatter";
import {SlickGridProvider} from "../../../modules/search/slick-grid/providers/slick.grid.provider";
import {
    SlickGridExpandableRowData,
    SlickGridInsideExpandRowFormatterData, SlickGridRowData
} from "../../../modules/search/slick-grid/types";
import {appRouter} from "../../../constants/appRouter";
import {SilverlightProvider} from "../../../providers/common/silverlight.provider";
import {WorkflowComponent} from "../workflow.component";

// export type SlickExpandedRowsType = {id: string|number};

export class WorkflowSlickGridProvider extends SlickGridProvider {
    public router?: Router;
    private basketService?: BasketService;
    public compFactoryResolver?: ComponentFactoryResolver;
    public appRef?: ApplicationRef;
    public selectedSubRow?: { id?: number, index?: number } = {};
    public expandedRows?: any[] = [];
    public cdr: ChangeDetectorRef;
    public isGridExpanded: boolean;
    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
        this.router = injector.get(Router);
        this.basketService = injector.get(BasketService);
        this.compFactoryResolver = injector.get(ComponentFactoryResolver);
        this.appRef = injector.get(ApplicationRef);
        this.cdr = injector.get(ChangeDetectorRef);
    }

    public onClickByExpandRow(item, i) {
        this.selectedSubRow = {id: item.id, index: i};
        this.getSlick().render();
    }

    public lookupDynamicContent(item: SlickGridExpandableRowData): void {
        if (item._collapsed == true) {
            let index = this.expandedRows[this.PagerProvider.getCurrentPage()].indexOf(item.id);
            if (index > -1) {
                this.expandedRows[this.PagerProvider.getCurrentPage()].splice(index,1)
            }
            return;
        } else {
            if(!this.expandedRows[this.PagerProvider.getCurrentPage()]){
                this.expandedRows[this.PagerProvider.getCurrentPage()] = []
            }
            if(this.expandedRows[this.PagerProvider.getCurrentPage()].indexOf(item.id) == -1){
                this.expandedRows[this.PagerProvider.getCurrentPage()].push(item.id);
            }
        }
        let content = [];
        if (!item.Tasks) {
            return;
        }
        let contentCount = (item.Tasks.length);
        content.push('<div class="expanded-row-detail-' + item.id + '">Loading...</div>');
        item._detailContent = content.join("");
        let rowHeight = this.getSlick().getOptions().rowHeight;
        let lineHeight = 24; //we know cuz we wrote the custom css innit ;)
        item._sizePadding = Math.ceil((contentCount * lineHeight) / rowHeight);
        item._height = (item._sizePadding * rowHeight)
    }

    public createDetailComponent(item): void {
        // let self = this;
        // prepare ang module for render
        let factory = this.compFactoryResolver.resolveComponentFactory(WorkflowExpandRowComponent);
        let resolvedInputs = ReflectiveInjector.resolve([{
            provide: 'data', useValue: {
                data: <SlickGridInsideExpandRowFormatterData>{
                    item: item,
                    provider: this
                }
            }
        }]);
        let injector = ReflectiveInjector.fromResolvedProviders(
            resolvedInputs
        );
        let componentRef = factory.create(injector);
        this.appRef.attachView(componentRef.hostView);
        let domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
        let el: any = $(this.getGridEl().nativeElement).find('div.expanded-row-detail-' + item.id);
        if (el) {
            el.html(domElem)
        }
    }

    clearItem(item) {
        item._collapsed = true;
        item._sizePadding = 0;     //the required number of padding rows
        item._height = 0;     //the actual height in pixels of the detail field
        item._isPadding = false;
        delete item._detailContent;
        return item;
    }

    setAllExpanded(state: boolean) {
        let insertData = [];
        let dataView = this.getDataView();
        let slick = this.getSlick();
        dataView.beginUpdate();
        if (state == false) {
            insertData = this.module.data.slice(0);
            // dataView.setItems(insertData);
            insertData = insertData.filter((item: SlickGridExpandableRowData) => {
                return !item._isPadding?true:false
            });

            insertData = insertData.map((item: SlickGridExpandableRowData) => {
                return this.clearItem(item);
            })

        } else {
            // let ids = this.module.data.slice(0).map((r: SlickGridRowData) => {
            //     return r.$id
            // });

            let allItems = this.module.data.slice(0);

            dataView.setItems([]);
            let itms = [];
            // setTimeout(() => {
            $.each(allItems, (k, item) => {
                if (item && item.ID) {
                    item._collapsed = false;
                    this.lookupDynamicContent(item)

                    insertData.push(item);
                    for (let idx = 1; idx <= item._sizePadding; idx++) {
                        let newItem = this.getPaddingItem(item.id, idx)
                        insertData.push(newItem);
                        let key = item._additionalRows.indexOf(newItem.id);
                        if (key == -1) {
                            item._additionalRows.push(newItem.id)
                        }
                    }

                    itms.push(item);
                }
            });
        }

        slick.invalidateAllRows();
        dataView.setItems(insertData);
        dataView.endUpdate();
        slick.updateRowCount();
        slick.resizeCanvas();
    }

    wfdragmode: string;
    item:any;
    public onDragRowStart($event) {
        console.log($event);
        this.wfdragmode = $event?$event.mode:null;
        this.item = $event?$event.item:null;
    }

    public navigateToPage(item, i) {
        let silver = this.injector.get(SilverlightProvider);
        if (item.Tasks.length > 0) {
            item = item.Tasks[i];
            if (item.TSK_TYPE === 62 && silver.isSilverlightInstalled) {
                this.router.navigate(
                    [
                        appRouter.media_logger.job.substr(
                            0,
                            appRouter.media_logger.job.lastIndexOf('/')
                        ),
                        item.ID
                    ]
                );
                return true;
            }
            else if (item.TSK_TYPE === 1) {
                switch (item.TECH_REPORT_SUBTYPE) {
                    case "subtitleassess":
                        this.router.navigate(
                            [
                                appRouter.workflow.subtitle_qc.substr(
                                    0,
                                    appRouter.workflow.subtitle_qc.lastIndexOf('/')
                                ),
                                item.ID
                            ]
                        );
                        break;
                    case "simpleassess":
                        this.router.navigate(
                            [
                                appRouter.workflow.assessment.substr(
                                    0,
                                    appRouter.workflow.assessment.lastIndexOf('/')
                                ),
                                item.ID
                            ]
                        );
                        break;
                    default:
                        break;
                }
                return true;
            }
        }
        return false;
    }

    selectedRows;
    refreshGrid() {
        if (this.lastSearchModel) {
            (<WorkflowComponent>this.componentContext).refreshStarted = true;
            this.selectedRows = this.getSlick().getSelectedRows();
            this.buildPage(this.lastSearchModel, false, false);
        }
    }

    afterRequestData(resp, searchModel) {
        if (!(<WorkflowComponent>this.componentContext).refreshStarted) {
            super.afterRequestData(resp, searchModel);

        } else {
            let respLength = resp.Rows ? resp.Rows : resp.Data.length;
            let data = this.prepareData(resp.Data, respLength);
            // this.originalPreparedData = data;
            this.updateData(this.selectedRows, data);
            if ((<WorkflowComponent>this.componentContext).refreshStarted) {
                this.getSlick().setSelectedRows(this.selectedRows);
            }
            (<WorkflowComponent>this.componentContext).refreshStarted = false
        }

        if(this.isGridExpanded){
            this.setAllExpanded(true);
        } else if(this.expandedRows[this.PagerProvider.getCurrentPage()] && this.expandedRows[this.PagerProvider.getCurrentPage()].length > 0) {
            // let expandedItems = this.expandedRows.map((row:{id: number|string, page:number}) => {
            //     if(row.page == this.PagerProvider.getCurrentPage()){
            //         return this.getDataView().getItemById(row.id);
            //     }
            // });

            $.each(this.expandedRows[this.PagerProvider.getCurrentPage()], (k, id) => {
                let row = this.getDataView().getItemById(id);
                this.expandExpandableRow(row, false);
                // debugger
            })
            // this.expandByItems(expandedItems)
        }
    }
}
