import {SearchFacetsConfig} from "../search.facets.config";
import {Observable, Subscription} from "rxjs";
import {Injectable, Injector, EventEmitter} from "@angular/core";
import {SearchModel} from "../../grid/models/search/search";
import {AdvancedSearchModel} from "../../grid/models/search/advanced.search";
import {BaseSearchModel} from "../../grid/models/search/base.search";
import {SlickGridProvider} from "../../slick-grid/providers/slick.grid.provider";

export interface SearchFacetsProviderInterface {
    _isOpenFacets: boolean
    config: SearchFacetsConfig;
    selectedFacets: any;
    accordionHeight;
    fullHeight;
    accordionCount;
    facetsSearchData: any;
    facets;
    moduleContext: any;
    injector: Injector;
    onToggle: EventEmitter<boolean>;
    onResize($eventg, nativeElement): Observable<Subscription>;
    toggleFacetsAccordion(isOpen);
    setHeight(o);
    clickFacet(facet, facetGroup): Observable<Subscription>;
    unSelectFacet(facet);
    selectFacet(facet, facetGroup);
    buildSearchModel();
    calculateAccordionHeight(fullHeight, accordionCount, nativeElement): Observable<Subscription>;
    isFacetFromSelected(facet);
    fillFacets(facets);
    clearSelectedFacets();
    clearFacet();
    isOpenFacets(): boolean;
    toggleFacets(): void;
}
@Injectable()
export class SearchFacetsProvider implements SearchFacetsProviderInterface {
    public onToggle: EventEmitter<boolean> = new EventEmitter();
    _isOpenFacets: boolean = false;
    config: SearchFacetsConfig;
    selectedFacets = [];
    accordionHeight = 0;
    fullHeight = 0;
    accordionCount = 0;
    facetsSearchData = {
        id: 0,
        criterias: []
    };
    facets;
    moduleContext;

    constructor(public injector: Injector){}

    public fillFacets(facets) {
        this.facets = facets;
        this.facets.forEach(function (facet) {
            facet._isOpen = true;
        });
        this.moduleContext && this.moduleContext.cdr.markForCheck();
    };

    public toggleFacetsAccordion(facetGroup) {
        return facetGroup._isOpen = (facetGroup._isOpen) ? false : true;
    };

    public setHeight(o) {
        if (!o.facetGroup._isOpen) {
            return 0;
        }
        else {
            let fullHeight = o.nativeElement.getElementsByClassName('media-facets')[0].offsetHeight;
            let openAccordions = this.facets.filter(function (el) {
                    return el._isOpen == true
                }).length,
                accordionCount = this.facets.length;
            return (fullHeight - 35 * accordionCount) / openAccordions;
        }
    }

    /*
     * Click facet
     */
    public clickFacet(facet, facetGroup): Observable<Subscription> {
        return Observable.create((observer) => {
            let searchModel = {};
            if (!facet._selected) {
                facet._selected = true;
                searchModel = this.selectFacet(facet, facetGroup);
            }
            else {
                facet._selected = null;
                searchModel = this.unSelectFacet(facet);
            }
            observer.next({
                model: searchModel
            });
        });
    }

    /*
     * Clear facets
     */
    public clearFacet(): Observable<Subscription> {
        let self = this;
        return Observable.create((observer) => {
            let searchModel = {};
            self.facets.forEach(function (facetGroup, ind) {
                facetGroup.Facets.forEach(function (el, ind) {
                    if (el._selected) {
                        searchModel = self.unSelectFacet(el);
                    }
                });
            });
            observer.next({
                model: searchModel
            });
        });
    }

    /*
     * Method for unselect facet
     */
    public unSelectFacet(facet) {
        let ind = -1;
        this.selectedFacets.forEach(function (el, idx) {
            if (el.facet == facet.Facet && el.value == facet.FieldKey) {
                ind = idx;
            }
        });
        if (ind === -1) {
            return;
        }
        this.selectedFacets.splice(ind, 1);
        let searchModel = this.buildSearchModel();

        return searchModel;
    }

    /*
     * Method for select facet
     */
    public selectFacet(facet, facetGroup) {
        this.selectedFacets.push({
            facet: facet.Facet,
            dbField: facetGroup.SearchField,
            value: facet.FieldKey,
            operator: '=',
            field: facetGroup.FieldName,
            humanValue: facet.Field
        });
        let searchModel = this.buildSearchModel();

        return searchModel;
    };

    public buildSearchModel() {
        let searchString = this.config.componentContext.searchFormProvider.searchForm.controls.searchString.value;
        let searchModel = new SearchModel();
        let baseSearchModel = new BaseSearchModel();
        baseSearchModel.setValue(searchString);
        searchModel.setBase(baseSearchModel);
        this.selectedFacets.forEach(function (el) {
            let advSearchModel = new AdvancedSearchModel();
            advSearchModel.setValue(el.value);
            advSearchModel.setOperation(el.operator);
            advSearchModel.setDBField(el.dbField);
            advSearchModel.setField(el.field);
            advSearchModel.setHumanValue(el.humanValue);
            searchModel.setAdvancedItem(advSearchModel);
        });
        // and merge with existing adv search
        let advProv = this.config.componentContext.searchAdvancedProvider;
        let withAdv = advProv ? advProv.withAdvChecking() : false;
        let advSearchItems = this.config.componentContext.searchAdvancedProvider.getModels(true, withAdv);
        for (let adv of advSearchItems) {
            searchModel.setAdvancedItem(adv);
        }

        return searchModel;
    }

    /*
     * Method for resize accordions
     * @param - fullHeight: accordions block height
     * @param - accordionCount: count of accordions
     */
    public calculateAccordionHeight(fullHeight, accordionCount, nativeElement): Observable<Subscription> {
        return Observable.create((observer) => {
            nativeElement.offsetHeight
            let openAccordions = accordionCount;
            this.facets.forEach(function (el) {//count of closen accordions
                if (!el._isOpen) {
                    el.height = 35;
                    openAccordions--;
                }
            });
            this.facets.forEach(function (el) {
                if (el._isOpen) {
                    el.height = (fullHeight - 35 * accordionCount) / openAccordions;
                }
            });
            observer.next("done!");
        });
    };

    /*
     * Event for resize accordions
     */
    public onResize($event, nativeElement): Observable<Subscription> {
        return Observable.create((observer) => {
            this.fullHeight = nativeElement.getElementsByClassName('media-facets')[0].offsetHeight;
            this.calculateAccordionHeight(this.fullHeight, this.accordionCount, nativeElement);
            observer.next("done!");
        });
    }

    /*
     * Checked radio input
     *@param - facet: facet which need to be checked
     */
    public isFacetFromSelected(facet) {
        let found = false;
        this.selectedFacets.forEach(function (el) {
            if (el.facet == facet.Facet && el.value == facet.FieldKey) {
                facet._selected = true;
                found = true;
            }
        });

        return found;
    }

    public clearSelectedFacets() {
        this.selectedFacets = [];
    };

    isOpenFacets(): boolean {
        return this._isOpenFacets;
    }

    toggleFacets(isOpen?: boolean) {
        if (typeof isOpen == 'undefined'){
            this._isOpenFacets = !this._isOpenFacets;
        } else {
            this._isOpenFacets = isOpen;
        }

        this.onToggle.emit(this._isOpenFacets);
    }
}
