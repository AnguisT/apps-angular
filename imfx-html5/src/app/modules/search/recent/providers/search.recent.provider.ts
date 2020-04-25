/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import * as $ from "jquery";
import {Injectable} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {SearchRecentConfig} from "../search.recent.config";
import {RecentModel} from "../models/recent";
import {SearchModel} from "../../grid/models/search/search";
import {BaseSearchModel} from "../../grid/models/search/base.search";
import {AdvancedSearchModel} from "../../grid/models/search/advanced.search";
import {SearchRecentProviderInterface} from "./search.recent.provider.interface";
import {AdvancedModeTypes, AdvancedSearchGroupRef} from "../../advanced/types";

@Injectable()
export class SearchRecentProvider implements SearchRecentProviderInterface {
    config: SearchRecentConfig;

    /**
     * Array of recent searches
     */
    recentSearches: Array<RecentModel> = [];

    /**
     * Return array of recent searches
     */
    getRecentSearches(): Observable<Array<RecentModel>> {
        return Observable.create((observer) => {
                this.config.options.service.retrieveRecentSearches(this.config.options.viewType, this.config.options.itemsLimit).subscribe((recentsJSONs) => {
                    observer.next(recentsJSONs);
                })
            }
        );
    }

    selectRecentSearch(recentSearch: RecentModel){
        let searchModel = recentSearch.getSearchModel();
        if (this.config.moduleContext.externalMode) {
            this.config.moduleContext.onSelect.emit(searchModel);
            return;
        }

        // this.overlayRecentSearches.show($(this.recentsList.nativeElement));
        let searchAdvConfig = this.config.componentContext.searchAdvancedConfig;
        let searchFormConfig = this.config.componentContext.searchFormConfig;
        let advModule = searchAdvConfig.options.provider.config.moduleContext;
        if (!searchAdvConfig || !searchFormConfig) {
            throw new Error('Not found config for advanced or searchForm');
        }
        let advProv = advModule.config.options.provider;
        // get mode for current recent search (by first criteria in search)
        let crit = searchModel.getAdvancedItem(0);
        if (crit) {
            let mode: AdvancedModeTypes = searchModel.getMode();
            advProv.setMode(mode);
            if (!mode) {
                console.error('>>>Search mode or adv not found; you call recent search with deprecated structure');
                mode = 'builder';
            }
            let crits = searchModel.advancedToRequest();
            let structs: Array<AdvancedSearchGroupRef> = advProv.turnCriteriasToStructures(crits);
            if (mode == 'builder') {
                advProv.clearParamsForBuilder();
                advProv.buildStructure(structs);
            } else {
                advProv.clearParamsForExample('empty');
                let defStruct: Array<AdvancedSearchGroupRef> = advModule.service.getStructure();
                structs = $.extend(true, {}, defStruct, structs);
                advProv.buildStructure(structs);
            }
        }

        // restore result
        if(this.config.componentContext.slickGridComp){
            this.config.componentContext.slickGridComp.provider.buildPage(searchModel);
        } else {
            this.config.componentContext.searchGridProvider.buildPage(searchModel);
        }


        //clear selected facets
        if (this.config.componentContext.searchFacetsProvider)
            this.config.componentContext.searchFacetsProvider.clearSelectedFacets();

        // restore search form value
        this.config.componentContext.searchFormConfig.options.provider.setSearchString(searchModel.getBase().getValue());

        // change position for selected search model
        // let self = this;
        this.moveToTop(recentSearch).subscribe(() => {
            // self.overlayRecentSearches.hide($(this.recentsList.nativeElement));

            setTimeout(() => {
                advProv.validateModels();
                advModule.updateViewReferences();
            })
        });
    }

    setRecentSearches(recentsJSONs: Array<any>) {
        for (let i = 0; i < recentsJSONs.length; i++) {
            let recentJSON = recentsJSONs[i];
            let advancedSearchModels = new Array<AdvancedSearchModel>();
            let baseSearchModel = new BaseSearchModel();

            if(recentJSON.searchModel._base){
                baseSearchModel.setValue(recentJSON.searchModel._base._value);
            }

            for (let j = 0; j < recentJSON.searchModel._advanced.length; j++) {
                let advancedSearchModel = new AdvancedSearchModel();
                advancedSearchModel.fillModel(recentJSON.searchModel._advanced[j]);
                advancedSearchModels.push(advancedSearchModel);
            }

            let searchModel = new SearchModel();
            searchModel.setBase(baseSearchModel);
            searchModel.setAdvanced(advancedSearchModels);
            searchModel.setMode(recentJSON.searchModel._mode);

            // searchModel.setMode()

            let recentSearch = new RecentModel();
            recentSearch.setSearchModel(searchModel);
            recentSearch.setTotal(recentJSON.total);
            recentSearch.setBeautyString(recentJSON.beautyString);
            // let isSet = false;
            // $.each(this.recentSearches, (key, recentSearchItem) => {
            //     if (recentSearchItem.getBeautyString() == recentSearch.getBeautyString()) {
            //         isSet = true;
            //         return false;
            //     }
            // });
            //
            // if (!isSet) {
            this.recentSearches.unshift(recentSearch);
            // }
        }

        this.applyInModule();
    }

    /**
     * Add model of recent search to stack
     * @param recentModel
     */
    addRecentSearch(recentModel: RecentModel): void {
        let isSet = false;
        $.each(this.recentSearches, (key, recentSearchItem) => {
            // if it is new search then add to stack
            // with results
            // if (recentSearchItem.getBeautyString() == recentModel.getBeautyString()) {
            // without results
            if (recentSearchItem.getSearchModel().toBeautyString() == recentModel.getSearchModel().toBeautyString()) {
                isSet = true;
                recentSearchItem.setTotal(recentModel.getTotal());
                recentSearchItem.fillBeautyString();
                this.moveToTop(recentSearchItem).subscribe();
                return false;
            }
            // recentSearchItem.getSearchModel().getAdvanced()[0].setHumanValue('2121212')
        });
        if (!isSet) {
            this.recentSearches.unshift(recentModel);
            if (this.recentSearches.length > this.config.options.itemsLimit) {
                this.recentSearches = this.recentSearches.slice(0, this.config.options.itemsLimit);
            }

            this.config.moduleContext._recentSearches = this.recentSearches;
            this.config.moduleContext.cdr.detectChanges();
            this.config.options.service.storeRecentSearches(this.config.options.viewType, this.recentSearches).subscribe(() => {

            })
        }
    }

    /**
     * Clear stack of recent searches
     */
    clearRecentSearches(): Observable<Subscription> {
        return Observable.create((observer) => {
            this.config.options.service.clearRecentSearches(this.config.options.viewType).subscribe((resp: any) => {
                this.recentSearches = [];
                observer.next(resp);
            });
        });
    }

    moveToTop(recentSearch: RecentModel, withoutSave: boolean = false): Observable<Subscription> {
        return Observable.create((observer) => {
            let _rc: Array<RecentModel> = this.config.moduleContext._recentSearches.slice(0);
            this.recentSearches = this.config.moduleContext.arrayProvider.move(
                _rc,
                this.config.moduleContext.arrayProvider.getIndexArrayByProperty(recentSearch.getBeautyString(), this.config.moduleContext._recentSearches, 'beautyString'),
                0);

            this.config.moduleContext._recentSearches = _rc.slice(0);
            if (!withoutSave) {
                this.config.options.service.storeRecentSearches(this.config.options.viewType, _rc).subscribe((resp: Array<RecentModel>) => {
                    this.recentSearches = resp;
                    this.applyInModule();
                    observer.next();
                })
            } else {
                observer.next();
            }
        });
    }

    applyInModule() {
        this.config.moduleContext._recentSearches = this.recentSearches;
        this.config.moduleContext.cdr.detectChanges();
    }

}
