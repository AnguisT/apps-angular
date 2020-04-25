import {
    ApplicationRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    Inject,
    Injector,
    ReflectiveInjector
} from "@angular/core";
import {Router} from "@angular/router";
import {CacheManagerExpandRowComponent} from "../comps/grid/formatters/expand.row/expand.row.formatter";
import {
    SlickGridExpandableRowData,
    SlickGridInsideExpandRowFormatterData
} from "../../../modules/search/slick-grid/types";
import {SlickGridProvider} from "../../../modules/search/slick-grid/providers/slick.grid.provider";

export class CMSlickGridProvider extends SlickGridProvider {
    public selectedSubRow?: { id?: number, index?: number, selectedSubRow?: number } = {};
    public expandedRows?: number[] = [];
    private componentByID = [];

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
        this.router = injector.get(Router);
        this.compFactoryResolver = injector.get(ComponentFactoryResolver);
        this.appRef = injector.get(ApplicationRef);
    }

    onRowDoubleClicked($event): void {
    }

    public lookupDynamicContent(item: SlickGridExpandableRowData | any): void {
        if (item._collapsed == true) {
            this.expandedRows = this.expandedRows.filter((e) => {
                e == item.ID ? false : true;
            });

            delete this.componentByID[item.ID];
            return;
        } else {
            this.expandedRows.push(item.ID);
        }
        let content = [];
        content.push('<div class="expanded-row-detail-' + item.id + '">Loading...</div>');
        item._detailContent = content.join("");
        let contentCount = (<any>item).Devices.length>0?(<any>item).Devices.length+1:0;
        item = this.calcSize(item, contentCount);
    }

    public calcSize(item, contentCount = 1) {
        let rowHeight = this.getSlick().getOptions().rowHeight;
        let lineHeight = 30; //we know cuz we wrote the custom css innit ;)
        item._sizePadding = Math.ceil((contentCount * lineHeight) / rowHeight);
        item._height = (item._sizePadding * rowHeight);

        return item;
    }

    public createDetailComponent(item): void {
        // prepare ang module for render

        let factory = this.compFactoryResolver.resolveComponentFactory(CacheManagerExpandRowComponent);
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

    lockItemInCache($event){
        debugger
    }

    unlockItemInCache() {

    }

    forceItemInCache() {

    }

    unforceItemInCache() {

    }

    copyToClipboard() {
        debugger
    }

    lockItemInCacheInSubRow() {

    }

    unlockItemInCacheInSubRow() {

    }

    resetChecksInSubRow() {

    }




}
