/**
 * Created by Sergey Trizna on 27.11.2017.
 */
import {CoreComp} from "./core.comp";
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from "@angular/router";
import {Injector} from "@angular/core";
import {SlickGridComponent} from "../modules/search/slick-grid/slick-grid";
import {SearchThumbsComponent} from "../modules/search/thumbs/search.thumbs";
import {isBoolean} from "util";
import {SplitItemSizeSetup, SplitProvider, SplitSizesFromEvent} from "../providers/split/split.provider";
import {SearchViewsComponent} from "../modules/search/views/views";

export class CoreSearchComponent extends CoreComp {

    public slickGridComp: SlickGridComponent;
    public searchThumbsComp?: SearchThumbsComponent;
    public viewsComp?: SearchViewsComponent;
    protected viewsProvider;
    protected searchGridService;
    protected searchGridProvider;
    protected SearchColumnsProvider;
    protected saveViewModalProvider;
    protected infoModalProvider;
    protected searchSettingsProvider;
    protected searchThumbsProvider;
    protected searchFacetsProvider;
    protected mediaDetailProvider;
    public searchFormProvider;
    public searchRecentProvider;
    protected searchAdvancedProvider;
    protected appSettings;
    protected searchGridConfig;
    protected searchViewsConfig;
    public searchAdvancedConfig;
    public searchFormConfig;
    public searchThumbsConfig;
    public exportProvider;
    public searchFacetsConfig;

    public splitProvider: SplitProvider;
    constructor(protected injector: Injector) {
        super(injector);

        this.splitProvider = injector.get(SplitProvider);
    }

    ngOnInit() {
            let router = this.injector.get(Router);
            let route = this.injector.get(ActivatedRoute);

            // toDo unsubscribe to optimization
            // let navigationStartSbscrb = router.events.first().subscribe((event: NavigationStart)=>{
            //     this.splitProvider.resetToNavStart();
            //     navigationStartSbscrb.unsubscribe();
            // });

        router.events.subscribe((event: NavigationStart)=>{
            this.splitProvider.resetToNavStart();
        });

            let navigationEndSbscrb = router.events.first().subscribe((event: NavigationEnd) => {
                // let router = this.router;
                // let route = this.route;
                // let currentComponent = this.route.component as Function;
                if (event instanceof NavigationEnd && this instanceof (route.component as Function)) {
                    if(this.slickGridComp){

                        let uid = this.slickGridComp.provider.uid;
                        let slickGird = $('#'+uid);
                        if(slickGird.length){
                            // this.slickGridComp.provider.resize();
                            this.slickGridComp.provider.refreshGridScroll();
                            // $(iframe).on('resize', ($event) => {
                            //     this.slickGridComp.provider.resize();
                            // });
                        }
                    } else {
                        if (this.searchGridProvider) {
                            this.searchGridProvider.refreshGridScroll();
                        }
                    }
                }
                navigationEndSbscrb.unsubscribe()
            }, error => console.error(error));
        // }
        // navigationEndSbscrb.unsubscribe();
        // navigationStartSbscrb.unsubscribe();
        // console.log(router.events.observers);
    }

    public getSearchGridProvider() {
        return this.searchGridProvider;
    }

    public getSearchFormProvider() {
        return this.searchFormProvider;
    }

    //
    public getSearchGridConfig() {
        return this.searchGridConfig;
    }

    public getSearchViewsConfig() {
        return this.searchViewsConfig;
    }

    public getSplitFlexSize(notInclude: number[]): number {
        return this.splitProvider.getFlexSize(notInclude);
    }

    public getSplitAreaSize(order: number[], defaultValue:number): number{
        return this.splitProvider.getAreaSize(order,defaultValue);
    }

    public getSplitAreaVisible(order: number[], value: boolean, defaultValue:boolean, context: any, callback: (a:boolean)=> void): boolean{
        let isVisible = this.splitProvider.getAreaVisible(order, value, defaultValue);
        try{
          //reduce the number of change callbacks
          if (value != isVisible){
            callback.call(context, isVisible);
            console.log('callback is running');
          }

        }catch(e){
            console.log('Callback for savingState don`t work!!');
        }

        return isVisible;
    }

    public saveSplitSizes(index: number, event: SplitSizesFromEvent): void {
        this.splitProvider.saveSizes(index, event);
    }
}
