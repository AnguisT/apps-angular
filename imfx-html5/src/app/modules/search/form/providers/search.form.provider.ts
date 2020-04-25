/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {Injectable} from "@angular/core";
import {SearchFormConfig} from "../search.form.config";
import {Observable, Subscription} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {SearchModel} from "../../grid/models/search/search";
import {AdvancedSearchModel} from "../../grid/models/search/advanced.search";
import {BaseSearchModel} from "../../grid/models/search/base.search";
import {SearchSuggessionType} from "../types";


export interface SearchFormProviderInterface {
    searchForm: any;
    /**
     * Config of module
     */
    config: SearchFormConfig;
    /**
     * Build search form
     * @param formBuilder
     * @param config
     * @returns {any}
     */
    buildForm(formBuilder: FormBuilder, searchString: string): Observable<Subscription>;

    /**
     * On search
     * @param searchString
     * @param currentItem
     * @param isValid
     */
    onSearchSuggestion(searchString: string, currentItem: number, isValid: boolean): Observable<Subscription>;

    /**
     * Before search
     * @param searchString
     * @param currentItem
     * @param isValid
     */
    beforeSearchSuggestion(searchString, currentItem, isValid): SearchSuggessionType;

    /**
     * On reset suggestion
     */
    resetSuggestion(): Observable<Subscription>;

    /**
     * On select
     * @param result
     */
    selectResult(result): Object
    /**
     * On submit search form
     * @param data
     */
    onSubmit(data: Object): any;

    /**
     * Get simple search string from form
     */
    getSearchString(): string;

    /**
     * Set value for search's input
     * @param value
     */
    setSearchString(value): void;

    /**
     * Get full model for search
     */
    getModel(withTitle: boolean, withAdv: boolean): SearchModel;

    /**
     * Emuleted click by search button
     * @param el
     */
    submit(): void;

    /**
     * Lock form (form cant send requests)
     */
    lockForm(): void;

    /**
     * Unlock form (form can send requests again)
     */
    unlockForm(): void;

    /**
     * Return locked or no the form
     */
    isLockedForm(): boolean

    /**
     * State of search button
     */
    isEnabledSearchButton(): boolean;

    /**
     * Refresh results
     */
    refresh(): any;
}

@Injectable()
export class SearchFormProvider implements SearchFormProviderInterface {
    config: SearchFormConfig;
    searchForm: any;

    /**
     * Build search form
     * @param formBuilder
     * @param config
     * @returns {any}
     */
    buildForm(formBuilder: FormBuilder, searchString: string): Observable<Subscription> {
        return Observable.create((observer) => {
                // building search form
                this.searchForm = formBuilder.group({
                    // searchString: [this.data.tableSearchString, Validators.required]
                    searchString: [searchString, Validators.required]
                });

                observer.next(this.searchForm);
            }
        );
    }

    /**
     * Before search
     * @param searchString
     * @param currentItem
     * @param isValid
     * @returns {any}
     */
    beforeSearchSuggestion(searchString, currentItem, isValid): SearchSuggessionType {
        let config = this.config;
        let ssp: SearchSuggessionType = {
            showAutocompleteDropdown: false,
            searching: false,
            results: {
                titles: [],
                series: [],
                contributors: []
            },
            currentItem: -1,
            currentArray: 0,
        };

        if (!isValid || searchString.length < config.options.minLength) {
            ssp.searching = false;
        } else if (currentItem >= 0) {
            ssp.searching = true;
        } else {
            ssp.searching = true;
            ssp.showAutocompleteDropdown = true;
        }

        return ssp;
    }

    /**
     * On search
     * @param searchString
     * @param currentItem
     * @param isValid
     * @returns {any}
     */
    onSearchSuggestion(searchString, currentItem, isValid): Observable<Subscription> {
        return Observable.create((observer) => {
                this.config.options.service.searchSuggestion(searchString).subscribe(
                    (res: any) => {
                        let results = {
                            titles: [],
                            series: [],
                            contributors: []
                        };
                        for (var e in res) {
                            for (var i = 0; i < res[e].length; i++) {
                                let elem = {
                                    title: res[e][i].Title,
                                    count: res[e][i].Count,
                                    image: window.location.protocol.indexOf("https") == 0 ? res[e][i].ThumbUrl && res[e][i].ThumbUrl.replace("http://", "https://") : res[e][i].ThumbUrl,
                                    type: e
                                };
                                switch (e) {
                                    case 'Series': {
                                        elem['id'] = res.Series[i].SeriesId
                                        break;
                                    }
                                    case 'Contributors': {
                                        elem['id'] = res.Contributors[i].ContributorId;
                                        elem['image'] = elem.image || this.config.options.appSettings.getContributorThumb();
                                        break;
                                    }
                                    default:
                                        break;
                                }

                                results[e.toLocaleLowerCase()].push(elem);
                            }
                        }
                        if (res.Contributors.length > 0 || res.Titles.length > 0 || res.Series.length > 0) {
                            this.config.options.onSearch.emit(true);
                        }

                        observer.next({res: res, results: results, searching: false});
                    }
                );
            }
        );
    }

    /**
     * On reset
     * @returns {any}
     */
    resetSuggestion(): Observable<Subscription> {
        return Observable.create((observer) => {
            observer.next({
                showAutocompleteDropdown: false,
                currentItem: -1,
                currentArray: 0
            });
        });
    }

    /**
     * On select
     * @param result
     * @returns {any}
     */
    selectResult(result): Object {
        let searchModel = new SearchModel();
        let baseSearchModel = new BaseSearchModel();
        baseSearchModel.setValue(result.title);
        searchModel.setBase(baseSearchModel);

        if (result.type !== 'Titles') {
            let advSearchModel = new AdvancedSearchModel();
            advSearchModel.setValue(result.id);
            advSearchModel.setOperation('=');
            if (result.type == 'Series') {
                advSearchModel.setDBField('SERIES_ID');
                advSearchModel.setField('Series');
            } else if (result.type == 'Contributors') {
                advSearchModel.setDBField('CONTRIBUTORS_ID');
                advSearchModel.setField('Contributors');
            }
            searchModel.setAdvancedItem(advSearchModel);
        }

        // to facets
        let facetsConfig = this.config.componentContext.searchFacetsConfig;
        if (facetsConfig) {
            facetsConfig.options.onSearchStringUpdated.emit(true);
        }

        return {
            result: result,
            model: searchModel
        }
    }

    /**
     *
     * @param data
     * @returns {any}
     */
    onSubmit(data): any {
        this.config.options.currentMode = 'Titles';
        let results = {
            titles: [],
            series: [],
            contributors: []
        };


        let advProv = this.config.componentContext.searchAdvancedProvider;
        let withAdv = advProv ? advProv.withAdvChecking() : false;
        let searchModel: SearchModel = this.getModel(true, withAdv);
        let facetsConfig = this.config.componentContext.searchFacetsConfig;

        if (facetsConfig) {
            facetsConfig.options.onSearchStringUpdated.emit(true);
        }

        return {
            results: results,
            model: searchModel
        };
    };


    getModel(withTitle: boolean = true, withAdv: boolean = true): SearchModel {
        let searchModel = new SearchModel();
        if (withTitle) {
            let baseSearchModel = new BaseSearchModel();
            baseSearchModel.setValue(this.getSearchString());
            searchModel.setBase(baseSearchModel);
        }

        // get data from adv
        let advProv = this.config.componentContext.searchAdvancedProvider;
        if (advProv && withAdv) {
            let advModels: Array<AdvancedSearchModel> = advProv.getModels();
            if (advModels && advModels.length > 0) {
                searchModel.setAdvanced(advModels);
            }

            searchModel.setMode(advProv.getSearchMode());
        }

        return searchModel;
    }

    getSearchString(): string {
        return $.trim(this.searchForm ? this.searchForm.controls ? this.searchForm.controls.searchString.value : null : null);
    }

    setSearchString(value): void {
        this.config.moduleContext.setSearchValue(value);
    }

    submit(): void {
        let btnEl = this.config.moduleContext.submitButtonEl.nativeElement;
        if (!btnEl.disabled) {
            btnEl.click();
        }
    }

    lockForm() {
        this.config.options.isBusy = true;
    }

    unlockForm() {
        setTimeout(() => {
            this.config.options.isBusy = false;
            this.config.moduleContext.cdr.markForCheck()
        }, 100)

        // this.isEnabledSearchButton();
    }

    isLockedForm(): boolean {
        return !this.isEnabledSearchButton();
    }

    /**
     * Is  enabled search button
     * @returns {boolean}
     */
    isEnabledSearchButton(): boolean {
        let res: boolean = false;
        let sac = this.config.moduleContext.config.componentContext.searchAdvancedConfig;
        if (sac) {
            // throw new Error('this.config.moduleContext.config.componentContext.searchAdvancedConfig is not available')
            let isValidAdv = sac.options.provider.isValidStructure();
            if (isValidAdv === null) {
                res = this.config.options.enabledSearchButton && (this.getSearchString() != "" || this.config.options.searchButtonAlwaysEnabled);
            } else {
                res = isValidAdv && !this.config.options.isBusy;
            }
        }

        return res;
    }

    refresh() {
        this.config.componentContext.searchGridConfig.options.provider.refreshResults();
    }
}
