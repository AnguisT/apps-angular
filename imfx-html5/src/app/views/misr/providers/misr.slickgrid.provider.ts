import {
    ApplicationRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    Inject,
    Injector,
    ReflectiveInjector
} from "@angular/core";
import {Router} from "@angular/router";
import {MisrExpandRowComponent} from "../comps/grid/formatters/expand.row/expand.row.formatter";
import {ChartService} from "../../../modules/search/chart/services/chart.service";
import {
    SlickGridExpandableRowData,
    SlickGridInsideExpandRowFormatterData
} from "../../../modules/search/slick-grid/types";
import {SlickGridProvider} from "../../../modules/search/slick-grid/providers/slick.grid.provider";
import {WorkflowComponent} from "../../workflow/workflow.component";
import {MisrComponent} from "../misr.component";

export class MisrSlickGridProvider extends SlickGridProvider {
    public selectedSubRow?: { id?: number, index?: number, selectedSubRow?: number } = {};
    public expandedRows?: any[] = [];
    public expandedSubRowsRows?: any[] = [];
    private componentByID = [];
    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
        this.router = injector.get(Router);
        this.compFactoryResolver = injector.get(ComponentFactoryResolver);
        this.appRef = injector.get(ApplicationRef);
    }

    onRowDoubleClicked($event): void {
    }


    public lookupDynamicContent(item: SlickGridExpandableRowData| any): void {
        if (item._collapsed == true) {
            let index = this.expandedRows[this.PagerProvider.getCurrentPage()].indexOf(item.id);
            if (index > -1) {
                this.expandedRows[this.PagerProvider.getCurrentPage()].splice(index,1)
            }

            let compRef = this.componentByID[item.ID];
            if(compRef && compRef != 'inprogress') {
                compRef.instance.onDestroy(item);
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
        content.push('<div class="expanded-row-detail-' + item.id + '">Loading...</div>');
        item._detailContent = content.join("");
        (<any>item).items = [
            {
                _id: 0,
                name: "Media Items",
                props: [],
                data: item,
                // _collapsed: true,
            },
            {
                _id: 1,
                name: "Audio Tracks",
                _props: (<any>item).AudioRequirements,
                props: [],
                // _collapsed: (<any>item).AudioRequirements.length>0?false:true,
            },
            {
                _id: 2,
                name: "Subtitles",
                _props: (<any>item).SubtitleRequirements,
                props: [],
                // _collapsed: (<any>item).SubtitleRequirements.length>0?false:true,
            },
            {
                _id: 3,
                name: "Cache Manager Devices",
                props: [],
                // _collapsed: false,
            },
        ];

        this.componentByID[item.ID] = 'inprogress';
        let service: ChartService = this.injector.get(ChartService);
        service.getMediaData(item.items[0].data.ID).subscribe(
            (res) => {
                item.items[0].props = res;
                setTimeout(() => {
                    let compRef = this.componentByID[item.ID];
                    if(compRef && compRef != 'inprogress') {
                        compRef.instance.updateData(item);
                    }
                })
                // this.contentReady();
            }
        );

        let contentCount = (<any>item).items.length;
        item = this.calcSize(item, contentCount);
    }

    public calcSize(item, contentCount = 1){
        let rowHeight = this.getSlick().getOptions().rowHeight;
        let lineHeight = 30; //we know cuz we wrote the custom css innit ;)
        item._sizePadding = Math.ceil((contentCount * lineHeight) / rowHeight);
        item._height = (item._sizePadding * rowHeight);

        return item;
    }

    public createDetailComponent(item): void {
        // prepare ang module for render

        let factory = this.compFactoryResolver.resolveComponentFactory(MisrExpandRowComponent);
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
        this.componentByID[item.ID] = componentRef;
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
        if (state == false) {
            insertData = this.module.data.slice(0);
            insertData = insertData.map((item) => {
                return this.clearItem(item)
            });
            slick.invalidateAllRows();
            dataView.beginUpdate();
            dataView.setItems(insertData)
            dataView.endUpdate();
            slick.updateRowCount();
            slick.resizeCanvas();
        } else {
            let allItems = this.module.data.slice(0);
            let itms = [];
            // setTimeout(() => {
            $.each(allItems, (k, item) => {
                if (item && item.ID) {
                    item._collapsed = false;
                    this.lookupDynamicContent(item)

                    insertData.push(item);
                    for (let idx = 1; idx <= item._sizePadding; idx++) {
                        insertData.push(this.getPaddingItem(item, idx));
                    }

                    itms.push(item)
                }
            });

            slick.invalidateAllRows();
            dataView.beginUpdate();
            dataView.setItems(insertData)
            dataView.endUpdate();
            slick.updateRowCount();
            slick.resizeCanvas();
        }
    }

    raiseWorkflow($events): void {
    }

    activeWorkflow($events): void {
    }

    afterRequestData(resp, searchModel) {
        if (!(<MisrComponent>this.componentContext).refreshStarted) {
            super.afterRequestData(resp, searchModel);
        } else {
            let respLength = resp.Rows ? resp.Rows : resp.Data.length;
            let data = this.prepareData(resp.Data, respLength);
            // this.originalPreparedData = data;
            this.updateData(this.selectedRows, data);
            if ((<MisrComponent>this.componentContext).refreshStarted) {
                this.getSlick().setSelectedRows(this.selectedRows);
            }
            (<MisrComponent>this.componentContext).refreshStarted = false
        }

        if(this.expandedRows[this.PagerProvider.getCurrentPage()] && this.expandedRows[this.PagerProvider.getCurrentPage()].length > 0) {
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
