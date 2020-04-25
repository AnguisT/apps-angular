import {ChangeDetectorRef, Component, EventEmitter, Input, ViewChild, ViewEncapsulation, Injectable} from "@angular/core";
import {TableSearchService} from "../../../../services/viewsearch/table.search.service";
import {LocalStorageService, SessionStorageService} from "ng2-webstorage";
// Form
import {SearchFormConfig} from "../../../../modules/search/form/search.form.config";
import {AppSettingsInterface} from "../../../../modules/common/app.settings/app.settings.interface";
import {DetailData} from "../../../../services/viewsearch/detail.service";
import {SettingsGroupsService} from "../../../../services/system.config/settings.groups.service";
import {OverlayComponent} from "../../../../modules/overlay/overlay";
import {SimplifiedSettingsProvider} from "../../../../modules/settings/simplified/provider";
import {SearchTypes} from "../../../../services/system.config/search.types";
import {Router} from "@angular/router";
import {DefaultSearchProvider} from "../../../../modules/search/providers/defaultSearchProvider";
import {Backgrounds} from "../../../../services/system.config/backgrounds";
import {SimplifiedSearchComponent} from "../../../simplified/simplified.search.component";
import {SearchRecentConfig} from "../../../../modules/search/recent/search.recent.config";
import {SearchRecentProvider} from "../../../../modules/search/recent/providers/search.recent.provider";
import {SearchRecentComponent} from "../../../../modules/search/recent/search.recent";
import {SearchModel} from "../../../../modules/search/grid/models/search/search";
import {RouteReuseProvider} from "../../../../strategies/route.reuse.provider";
import {ServerStorageService} from "../../../../services/storage/server.storage.service";
import {SearchLogos} from "../../../../services/system.config/search.logos";
import {StartSearchFormProvider} from "../../providers/start.search.form.provider";
import {SearchFormProvider} from "../../../../modules/search/form/providers/search.form.provider";


@Component({
    selector: 'start-search-form',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    // changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    providers: [
        TableSearchService,
        DetailData,
        StartSearchFormProvider,
        SimplifiedSettingsProvider,
        SettingsGroupsService,
        SearchRecentProvider
    ],
    entryComponents: [
        OverlayComponent,
        SearchRecentComponent
    ]
})

export class StartSearchFormComponent {

    // settings group config
    @Input() builderMode: boolean = false;
    @Input() staticSearchType: string;
    @ViewChild('imageLogo') private imageLogo: any;
    private title;
    private subtitle;
    private selectedBackground;
    private selectedSearchLogo;
    private heightStartBlock;


    /**
     * Form
     * @type {SearchFormConfig}
     */
    protected searchFormConfig = <SearchFormConfig>{
        componentContext: this,
        options: {
            currentMode: 'Titles',
            arraysOfResults: ['titles', 'series', 'contributors'],
            appSettings: <AppSettingsInterface>null,
            provider: <SearchFormProvider>null,
            outsideSearchString: '',
            outsideCriteria: <any>null,
            selectedFilters: new EventEmitter<any>(),
            onSearch: new EventEmitter<any>()
        }
    };

    protected pushChangesTosuggestion = new EventEmitter<any>();
    @ViewChild('overlay') protected overlay: OverlayComponent;
    protected setupsUpdated = new EventEmitter<any>();
    protected searchResults = [];
    protected selectedItem: any[];
    protected tilesView = false;
    protected enabledMoreButton: boolean = false;
    protected searchString = "";
    protected searchCriteria = [];
    protected page = 1;
    protected pagging = 25;
    protected totalCount = 0;
    protected totalPages = 1;
    protected totalPagesArr = [];
    protected outsideCriteria;
    protected outsideSearchString;
    protected searchData = {};
    protected recentItems = [];
    protected recentLimit = 8;
    protected searchStarted = false;
    protected loading: boolean = false;
    protected rowUp = false;
    protected detailsCollapsed = false;

    // config
    protected storagePrefix: string = 'simplified.component.data';
    protected recentPrefix: string = 'simplified.recent.data';
    protected selectedPrefix: string = 'simplified.selected-item';

    private defaultSearch;
    private backgrounds = Backgrounds;
    private backgroundsKeys = [];
    private searchLogos = SearchLogos;
    private searchLogosKeys = [];


    private targetSearch;


    private searchRecentConfig;

    constructor(protected storageService: SessionStorageService,
                protected localStorage: LocalStorageService,
                protected searchService: TableSearchService,
                protected cdr: ChangeDetectorRef,
                public searchFormProvider: StartSearchFormProvider,
                protected sgs: SettingsGroupsService,
                protected defaultSearchProvider: DefaultSearchProvider,
                protected searchRecentProvider: SearchRecentProvider,
                private routeReuseProvider: RouteReuseProvider,
                private serverStorage: ServerStorageService,
                private router: Router) {

        this.searchFormConfig.options.provider = this.searchFormProvider;
        // do this async because other way subscription is called right after ngOnInit for 2nd init of the component
        setTimeout(() => {
            this.searchFormConfig.options.selectedFilters.subscribe((res) => {
                this.selectSuggestionSearch(res);
            });
        });
    }

    public selectBackground(b) {
        this.selectedBackground = b;
    }

    public selectSearchLogo(l) {
        this.selectedSearchLogo = l;
    }

    public getCustomizedParams(): {
        title: string,
        subtitle: string,
        selectedBackground: string,
        selectedSearchLogo: string
    } {
        return {
            title: this.title,
            subtitle: this.subtitle,
            selectedBackground: this.selectedBackground,
            selectedSearchLogo: this.selectedSearchLogo
        }
    }

    public setCustomizedParams(o: {
        title?: string,
        subtitle?: string,
        selectedBackground?: string,
        selectedSearchLogo?: string
    }) {
        this.title = o.title;
        this.subtitle = o.subtitle;
        this.selectedBackground = o.selectedBackground;
        this.selectedSearchLogo = o.selectedSearchLogo;
    }


    doSearch(searchModel?: SearchModel) {
        this.defaultSearchProvider.clearDefaultSearchModel();
        this.defaultSearchProvider.clearDefaultSearchParams();
        this.routeReuseProvider.clearRouteRequest.emit(this.targetSearch);

        if (searchModel) {
            this.defaultSearchProvider.setDefaultSearchModel(searchModel);
        } else {
            this.defaultSearchProvider.setDefaultSearchParams({
                searchString: this.searchString,
                searchCriteria: this.searchCriteria
            });
        }
        this.setTargetSearch();
        if (this.targetSearch == SearchTypes.SIMPLIFIED) {
            this.storageService.clear(SimplifiedSearchComponent.storagePrefix);
        }
        // if (this.targetSearch != undefined || this.targetSearch != null) {
        this.router.navigate([this.targetSearch]);
        // }
    }


    selectRecentSearch(recentModel) {
        this.doSearch(recentModel);
    }

    setTargetSearch() {
        this.targetSearch = this.staticSearchType || SearchTypes[this.defaultSearch] || SearchTypes.MEDIA;
    }

    ngOnInit() {
        if (this.builderMode) {
            this.heightStartBlock = '100%';
        }
        this.cdr.detach();
        this.sgs.getSettingsUserById('defaultSearch').subscribe((setups) => {
            if (setups && setups[0] && setups[0].DATA) {
                this.defaultSearch = JSON.parse(setups[0].DATA).DefaultSearch
            }
            this.setTargetSearch();
            if (this.targetSearch == SearchTypes.SIMPLIFIED) {
                this.serverStorage.retrieve([this.recentPrefix], true).subscribe((resp) => {
                    this.recentItems = resp[0] && resp[0].Value && JSON.parse(resp[0].Value) || [];
                    this.cdr.reattach()
                    this.cdr.detectChanges()
                });
            } else {
                let storageKey = this.targetSearch;
                // TODO: use unique IDs for each search/view type
                if (storageKey == "version") {
                    storageKey = "versions"
                }
                this.searchRecentConfig = <SearchRecentConfig>{
                    componentContext: null, // this
                    options: {
                        provider: <SearchRecentProvider> this.searchRecentProvider,
                        viewType: "adv.recent.searches." + storageKey,
                        itemsLimit: 10
                    }
                }
            }
            this.cdr.reattach();
            this.cdr.detectChanges()
        })
        this.backgroundsKeys = Object.keys(this.backgrounds);
        this.searchLogosKeys = Object.keys(this.searchLogos);
        if (!this.builderMode) {
            this.sgs.getSettingsUserById('startSearch').subscribe((setups) => {
                if (setups && setups[0] && setups[0].DATA) {
                    this.cdr.detach();
                    let startSearch = JSON.parse(setups[0].DATA);
                    this.title = startSearch.Title;
                    this.subtitle = startSearch.Subtitle;
                    this.selectedBackground = startSearch.Background;
                    this.selectedSearchLogo = startSearch.Logo;
                    this.cdr.reattach();
                    this.cdr.detectChanges()
                }
            })
        }

    }

    selectSuggestionSearch($event) {
        if ($event.searchString) {
            this.searchString = $event.searchString;
        }
        if (Object.keys($event.searchCriteria).length > 0) {
            this.changeSearchCriteria($event.searchCriteria);
        }
        else {
            this.page = 1;
            this.searchCriteria = [];
            this.searchFormConfig.options.provider.config.options.outsideCriteria = null;
            this.selectedItem = null;
            this.doSearch();
        }
    };

    clearRecent() {
        this.recentItems = [];
        this.serverStorage.clear(this.recentPrefix).subscribe(() => {
        });
    }

    private changeSearchCriteria(criteriaArray) {
        var delIndex = null;
        var checkAdd = false;
        this.searchFormConfig.options.provider.config.options.outsideSearchString = this.searchString;
        for (var i = 0; i < this.searchCriteria.length; i++) {
            if (criteriaArray.value == null) {
                if (this.searchCriteria[i].FieldId == criteriaArray.fieldId) {
                    delIndex = i;
                    break;
                }
            } else {
                if (this.searchCriteria[i].FieldId == criteriaArray.fieldId) {
                    this.searchCriteria[i].Value = criteriaArray.value;
                    break;
                }
                checkAdd = true;
            }
        }
        if (delIndex != null) {
            this.searchCriteria.splice(delIndex, 1);
            this.page = 1;
            this.doSearch();
        } else if (checkAdd || this.searchCriteria.length == 0) {
            this.searchCriteria.push({FieldId: criteriaArray.fieldId, Operation: "=", Value: criteriaArray.value});
            this.page = 1;
            this.doSearch();
        }
    }


    showFromRecent(item) {
        this.selectedItem = item;
        this.storageService.store(this.selectedPrefix, this.selectedItem);
        this.searchFormConfig.options.provider.config.options.outsideSearchString = item.Title;
        this.searchString = item.Title;
        this.doSearch();
    }

}
