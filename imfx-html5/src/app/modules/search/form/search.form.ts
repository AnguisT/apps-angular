import * as $ from "jquery";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject, Injector,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs/Rx";
import {SearchFormConfig} from "./search.form.config";
import {SearchFormProvider} from "./providers/search.form.provider";
import {SearchFormService} from "./services/search.form.service";
import {AppSettings} from "../../common/app.settings/app.settings";
import {AppSettingsInterface} from "../../common/app.settings/app.settings.interface";
import {DefaultSearchProvider} from "../providers/defaultSearchProvider";
import {SearchAdvancedProvider} from "../advanced/providers/search.advanced.provider";
import {AdvancedModeTypes, AdvancedSearchGroupRef} from "../advanced/types";
import {SearchSuggessionType} from "./types";
import {SlickGridComponent} from "../slick-grid/slick-grid";
import {SlickGridConfig} from "../slick-grid/slick-grid.config";
import {SlickGridProvider} from "../slick-grid/providers/slick.grid.provider";

@Component({
    selector: 'search-form',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    host: {
        '(document:click)': 'onClick($event)',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [
        SearchFormProvider,
        SearchFormService,
        SearchAdvancedProvider,
        AppSettings,
    ]
})

/**
 * Search form for media table component
 */
export class SearchFormComponent {
    public config = <SearchFormConfig>{
        componentContext: null,
        moduleContext: this,
        options: {
            currentMode: 'Titles',
            arraysOfResults: [],
            searchString: '',
            minLength: 3,
            appSettings: <AppSettingsInterface>null,
            searchButtonAlwaysEnabled: false,
            enabledSearchButton: true,
            outsideSearchString: '',
            outsideCriteria: <any>null,
            selectedFilters: new EventEmitter<any>(),
            onSearch: new EventEmitter<any>(),
            onSubmitEmitter: new EventEmitter<any>(),
            isBusy: false
        }
    };

    @Input('builderMode') public builderMode;

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    @Output() controlOnSearch: EventEmitter<any> = new EventEmitter<any>();
    @Output() onChangedSearchString: EventEmitter<any> = new EventEmitter<any>();
    @Input() changesDetector?: EventEmitter<any>;

    @ViewChild('submitButton') public submitButtonEl;
    @ViewChild('searchFormEl') private searchFormEl;
    @ViewChild('searchStringEl') public searchStringEl: ElementRef;

    private searchForm: FormGroup;
    private searching: boolean = false;
    private showAutocompleteDropdown: boolean = false;
    private results = {};
    private suggestionSearchData = {};
    private currentItem: number = -1;
    private currentArray: number = 0;

    constructor(public cdr: ChangeDetectorRef,
                @Inject(SearchFormService) protected service: SearchFormService,
                @Inject(SearchFormProvider) protected provider: SearchFormProvider,
                protected defaultSearchProvider: DefaultSearchProvider,
                @Inject(AppSettings) protected appSettings: AppSettings,
                private formBuilder: FormBuilder,
                private elementRef: ElementRef,
                public advancedProvider: SearchAdvancedProvider,
                private router: Router,
                private injector: Injector) {
        this.router.events.subscribe(() => {
            $('.body search-form input').focus();
        });
    }

    ngOnInit() {
        //set search suggestion
        if (this.config.options.arraysOfResults.length > 0) {
            Observable.fromEvent(this.elementRef.nativeElement, 'keyup')
                .subscribe(kEvent => {
                    if (!(kEvent['which'] == 13 || kEvent['which'] == 40 || kEvent['which'] == 38 || kEvent['which'] == 37 || kEvent['which'] == 39 || kEvent['which'] == 27)) { //not arrows or enter, or esc
                        this.onSearchSuggestion(this.searchForm.value, this.searchForm.valid)
                    }
                });
        }

        // Set default provider/services if custom is null
        !this.config.options.provider ?
            this.config.options.provider = this.provider :
            this.provider = this.config.options.provider;

        !this.config.options.service ?
            this.config.options.service = this.service :
            this.service = this.config.options.service;


        !this.config.options.appSettings ?
            this.config.options.appSettings = this.appSettings :
            this.appSettings = this.config.options.appSettings;

        this.provider.config = this.config;
        this.provider.config.moduleContext = this;

        let params = this.defaultSearchProvider.getDefaultSearchParams();
        let model = this.defaultSearchProvider.getDefaultSearchModel();

        if (model) {
            this.buildForm(model.getBase().getValue() || '');
        } else {
            this.buildForm(params && params.searchString || '');
        }

        if (this.changesDetector) {
            let self = this;
            this.changesDetector.subscribe((res) => {
                self.changesHandler();
            });
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            let params = this.defaultSearchProvider.getDefaultSearchParams();
            let model = this.defaultSearchProvider.getDefaultSearchModel();
            if (model) {
                let gridConfig = this.config.componentContext.searchGridConfig;
                let searchAdvConfig = this.config.componentContext.searchAdvancedConfig;
                if (searchAdvConfig) {
                    let advModule = searchAdvConfig.options.provider.config.moduleContext;
                    let advProv = advModule.config.options.provider;
                    advModule.initModule().subscribe(() => {
                        //
                        // // get mode for current recent search (by first criteria in search)
                        let crit = model.getAdvancedItem(0);
                        if (crit) {
                            advProv.openPanel();
                            let mode: AdvancedModeTypes = model.getMode();
                            if (!mode) {
                                console.error('>>>Search mode or adv not found; you call recent search with deprecated structure');
                                mode = 'builder';
                            }
                            let crits = model.advancedToRequest();
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

                            advProv.setMode(mode);
                        }

                        if (gridConfig) {
                            // let gridProvider = gridConfig.options.provider;
                          let gridProvider = this.injector.get(SlickGridProvider)
                            gridProvider.buildPage(model, true);
                        }

                        this.defaultSearchProvider.clearDefaultSearchParams();
                        this.defaultSearchProvider.clearDefaultSearchModel();
                    });
                }
            } else if (params) {
                if (params.searchCriteria && params.searchCriteria[0]) {
                    this.selectResult({
                        title: params.searchString,
                        id: params.searchCriteria[0].Value,
                        type: params.searchCriteria[0].FieldId.replace('_ID', '').replace(/\w\S*/g, function (txt) {
                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                        })
                    })
                    this.doSearch(this.searchForm.value);
                } else if (params.searchString) {
                    this.doSearch(this.searchForm.value);
                    this.defaultSearchProvider.clearDefaultSearchParams();
                    this.defaultSearchProvider.clearDefaultSearchModel();
                }
            } else if (this.config.options.doSearchOnStartup) {
                this.doSearch(this.searchForm.value);
            }
        });
    }

    // ngAfterViewChecked()
    // {
    //     console.log( "! changement de la date du composant !" );
    //     // this.dateNow = new Date();
    //     this.cdr.detectChanges();
    // }

    public changesHandler() {
        if (this.config.options.outsideCriteria) {
            this.selectResult(this.config.options.outsideCriteria);
            this.cdr.detectChanges();
        }
        if (this.config.options.outsideSearchString) {
            this.config.options.provider.setSearchString(this.config.options.outsideSearchString);
            this.cdr.detectChanges();
        }
    }

    ngOnChanges() {
        this.changesHandler();
    };

    isEnabledSearchButton(): boolean {
        return this.provider.isEnabledSearchButton();
    }

    /**
     * Build search form
     */
    private buildForm(searchString: string) {
        this.config.options.provider.buildForm(this.formBuilder, searchString).subscribe(
            (searchForm: any) => {
                this.searchForm = searchForm;
            },
            (error) => {
                console.error(error);
            },
        );
    }

    public setStatusForSearchButton(status) {
        this.config.options.enabledSearchButton = status;
    }

    /**
     * On submit search form
     * @param event
     * @param data
     * @param isValid
     */
    onSubmit(event, data, isValid): void {
        event.preventDefault();
        if (!this.config.options.searchButtonAlwaysEnabled) {
            if (
                this.config.options.provider.isLockedForm()
            ) {
                return;
            }

        }
        this.doSearch(data);
    };

    clearSearchMode(event, data, isValid): void {
        this.setStatusForSearchButton(true);
        this.onSubmit(event, data, isValid);
    }

    doSearch(data): void {
        this.config.options.onSubmitEmitter.emit();
        this.config.options.provider.lockForm();
        this.resetSuggestion();

        let resp = this.provider.onSubmit(data);
        this.results = resp.results;
        let comp = this.config.componentContext;
        if (this.config.componentContext.slickGridComp) {
            let slickGridComp: SlickGridComponent = comp.slickGridComp;
            let gridConfig: SlickGridConfig = (<SlickGridConfig>slickGridComp.config);
            let gridProvider: SlickGridProvider = slickGridComp.provider;
            if (gridConfig && gridProvider) {
                data.suggestionSearchData = this.suggestionSearchData;
                if(!gridProvider.isBusyGrid){
                    let onGridEndSearchSbscrb = gridProvider.onGridEndSearch.subscribe(() => {
                        this.config.options.provider.unlockForm();
                        onGridEndSearchSbscrb.unsubscribe()
                    });
                    gridProvider.buildPage(resp.model, true);
                }
            }
            else {
                this.config.options.selectedFilters.emit({
                    searchCriteria: {},
                    searchString: this.config.options.searchString || resp.model.getBase().getValue()
                });
                this.config.options.outsideSearchString = null;
                this.config.options.outsideCriteria = null;
            }
        }
        else if(comp.namesTree) {
            comp.namesTree.doSearch.emit(resp.model.getBase().getValue());
        }
        else {
            let gridConfig = this.config.componentContext.searchGridConfig;
            if (gridConfig) {
                let gridProvider = gridConfig.options.provider;
                data.suggestionSearchData = this.suggestionSearchData;
                if(!gridProvider.isBusyGrid){
                    let onGridEndSearchSbscrb = gridProvider.onGridEndSearch.subscribe(() => {
                        this.config.options.provider.unlockForm();
                        onGridEndSearchSbscrb.unsubscribe()
                    });
                    gridProvider.buildPage(resp.model, true);
                }
            }
            else {
                this.config.options.selectedFilters.emit({
                    searchCriteria: {},
                    searchString: this.config.options.searchString || resp.model.getBase().getValue()
                });
                this.config.options.outsideSearchString = null;
                this.config.options.outsideCriteria = null;
            }
        }


    }

    submit() {
        this.config.options.provider.submit();
    }

    /**
     * On key up
     * @param $event
     */
    onKeyUp($event): void {
        this.config.options.searchString = $event.target.value;
        this.onChangedSearchString.emit();
        switch ($event.which) {
            case 40: {  //arrow down
                if (!this.isLastElem(this.results[this.config.options.arraysOfResults[this.currentArray]], this.currentItem) || this.currentItem < 0) {
                    this.currentItem++;
                }
                else if (this.currentArray < this.config.options.arraysOfResults.length - 1) {
                    this.currentItem = 0;
                    this.currentArray++;
                }
                break;
            }
            case 37: {  //arrow left
                this.currentItem = 0;
                if (this.currentArray == 0) {
                    this.currentArray = this.config.options.arraysOfResults.length - 1;
                }
                else {
                    this.currentArray--;
                }
                break;
            }
            case 38: {  //arrow up
                if (this.currentItem > 0) {
                    this.currentItem--;
                }
                else if (this.currentArray > 0) {
                    this.currentArray--;
                    this.currentItem = this.results[this.config.options.arraysOfResults[this.currentArray]].length - 1;
                }
                break;
            }
            case 39: {  //arrow right
                this.currentItem = 0;
                if (this.currentArray == this.config.options.arraysOfResults.length - 1) { //if right group selected
                    this.currentArray = 0;
                }
                else {
                    this.currentArray++;
                }
                break;
            }
            case 27: {//esc button
                this.resetSuggestion();
                this.results = {};
                this.config.options.arraysOfResults.forEach((el) => {
                    this.results[el] = [];
                });
                break;
            }
            case 13: {//enter
                if (!this.showAutocompleteDropdown || this.currentItem < 0) {
                    this.config.options.searchString = this.config.options.searchString.trim();
                    this.setSearchValue(this.config.options.searchString);
                    this.onSubmit($event, this.searchForm.value, this.searchForm.valid);
                    break;
                }
                $event.preventDefault;
                $event.stopPropagation();
                this.selectResult(this.results[this.config.options.arraysOfResults[this.currentArray]][this.currentItem]);
                break;
            }
            default: {
                this.currentItem = -1;
                this.currentArray = 0;
                this.config.options.currentMode = 'Titles';
                this.searching = true;
                this.cdr.reattach();
                break;
            }
        }
    }

    /**
     *
     * @param arr
     * @param ind
     * @returns {boolean}
     */
    private isLastElem(arr, ind) {
        return arr.length === ind + 1;
    }

    /**
     * Setup value to search string
     */
    setSearchValue(val = null): void {
        this.searchForm.setValue({'searchString': val ? val : this.config.options.searchString});
    }

    /**
     * search Suggestion
     * @param data
     * @param isValid
     */
    onSearchSuggestion(data, isValid): void {
        // bedore search (validation)
        let sst: SearchSuggessionType = this.provider.beforeSearchSuggestion(this.config.options.searchString, this.currentItem, isValid);
        this.showAutocompleteDropdown = sst.showAutocompleteDropdown;
        this.searching = sst.searching;
        this.cdr.detectChanges();
        if (this.showAutocompleteDropdown) {
            this.config.options.searchString = this.config.options.searchString.trim();
            this.results = sst.results;
            this.currentItem = sst.currentItem;
            this.currentArray = sst.currentArray;
            this.provider.onSearchSuggestion(this.config.options.searchString, this.currentItem, isValid)
                .debounceTime(300)
                .subscribe(
                    (resp: any) => {
                        this.config.options.arraysOfResults.forEach((el) => {
                            this.results[el] = resp.results[el];
                        });
                        //this.results = resp.results;
                        this.searching = resp.searching;
                        this.cdr.markForCheck();
                    },
                    (error: any) => {
                        console.error(error);
                    }
                );
        }
    }

    /**
     * reset Suggestion params
     */
    private resetSuggestion() {
        this.provider.resetSuggestion().subscribe(
            (resp: any) => {
                this.showAutocompleteDropdown = resp.showAutocompleteDropdown;
                this.config.options.onSearch.emit(this.showAutocompleteDropdown);
                this.currentItem = resp.currentItem;
                this.currentArray = resp.currentArray;
            }
        );
    }

    /**
     * send search request with search criteria
     *@param result
     */
    private selectResult(result) {
        this.resetSuggestion();
        let searchForm = this.config.componentContext.searchFormConfig;
        if (searchForm) {
            let res = searchForm.options.provider.selectResult(result);
            this.setSearchValue(res.result.title);
            this.config.options.currentMode = res.result.type;
            this.config.options.searchString = res.result.title;

            // Send to search
            let comp = this.config.componentContext;
            let gridConfig = comp.searchGridConfig;
            if (gridConfig) {
                if (comp.slickGridComp) {
                    let gridProvider: SlickGridProvider = comp.slickGridComp.config.provider;
                    gridProvider.buildPage(res.model, true)
                } else {
                    let gridProvider = gridConfig.options.provider;
                    gridProvider.buildPage(res.model, true)
                }
            }
            else {
                if (result.type !== 'Titles') {
                    let searchCriteria = {
                        fieldId: result.type == 'Series' ? 'SERIES_ID' : (result.type == 'Contributors' ? 'CONTRIBUTOR_ID' : ''),
                        value: result.id
                    };
                    this.config.options.selectedFilters.emit({
                        searchCriteria: searchCriteria,
                        searchString: this.config.options.searchString
                    });
                }
                else {
                    this.config.options.selectedFilters.emit({
                        searchCriteria: {},
                        searchString: this.config.options.searchString
                    });
                }
            }
        }
    }

    /**
     *
     * @param ind
     * @param arrInd
     */
    private hoverRow(ind, arrInd) {
        this.currentItem = ind;
        this.currentArray = arrInd;
    }

    /**
     */
    private outRow() {
        this.currentItem = -1;
        this.currentArray = 0;
    }

    /**
     * click outside
     */
    onClick(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.resetSuggestion();
            this.results = {};
            this.config.options.arraysOfResults.forEach((el) => {
                this.results[el] = [];
            });
        }
    }

    onRefresh() {
        this.provider.refresh();
    }
}
