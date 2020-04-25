import {
    ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild, ViewEncapsulation
} from '@angular/core';
import { TableSearchService } from '../../services/viewsearch/table.search.service';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { AppSettings } from './constants/constants';
// Form
import { SearchFormConfig } from '../../modules/search/form/search.form.config';
import {
    SearchFormProviderInterface
} from '../../modules/search/form/providers/search.form.provider';
import { AppSettingsInterface } from '../../modules/common/app.settings/app.settings.interface';
import { DetailData } from '../../services/viewsearch/detail.service';
import { SettingsGroupsService } from '../../services/system.config/settings.groups.service';
import { SimplifiedSettings } from '../../modules/settings/simplified/types';
import { OverlayComponent } from '../../modules/overlay/overlay';
import { SimplifiedSettingsProvider } from '../../modules/settings/simplified/provider';
import 'style-loader!./libs/dots.css';
import { StartSearchFormComponent } from '../start/components/search/start.search.form.component';
import { SearchTypes } from '../../services/system.config/search.types';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerStorageService } from '../../services/storage/server.storage.service';
import { ScrollStoreProvider } from '../../providers/common/scroll.store.provider';
import { SimplifiedSearchFormProvider } from './providers/simplified.search.form.provider';
import { SimpleSearchResponse } from '../../models/simplified/simple.search.response';
import { appRouter } from '../../constants/appRouter';
require('./libs/dots.js');

@Component({
    selector: 'simplified-search',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    // changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    providers: [
        TableSearchService,
        DetailData,
        AppSettings,
        SimplifiedSearchFormProvider,
        SimplifiedSettingsProvider,
        SettingsGroupsService
    ],
    entryComponents: [
        OverlayComponent,
        StartSearchFormComponent
    ]
})

export class SimplifiedSearchComponent {
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
            provider: <SearchFormProviderInterface>null,
            outsideSearchString: '',
            outsideCriteria: <any>null,
            selectedFilters: new EventEmitter<any>(),
            onSearch: new EventEmitter<any>()
        }
    };

    protected pushChangesTosuggestion = new EventEmitter<any>();
    @ViewChild('overlay') protected overlay: OverlayComponent;
    @ViewChild('simplifiedItems') protected simplifiedItems;
    protected setupsUpdated = new EventEmitter<any>();
    protected searchResults = [];
    protected selectedItem: any;
    protected tilesView = false;
    protected enabledMoreButton: boolean = false;
    protected searchString = '';
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
    protected facetsCollapsed = false;

    // config
    // make it public and static to allow access
    // and clear the storage by this key from another components
    public static storagePrefix: string = 'simplified.component.data';
    protected recentPrefix: string = 'simplified.recent.data';
    protected selectedPrefix: string = 'simplified.selected-item';
    protected defaultItemSettings: SimplifiedSettings;
    protected defaultDetailSettings: SimplifiedSettings;

    protected itemSettings: SimplifiedSettings;
    protected detailSettings: SimplifiedSettings;

    protected searchType: string = SearchTypes.SIMPLIFIED;

    private scrollStoreProvider: ScrollStoreProvider;

    private resultsReady: EventEmitter<any> = new EventEmitter<any>();

    constructor(protected storageService: SessionStorageService,
                protected localStorage: LocalStorageService,
                protected searchService: TableSearchService,
                protected cdr: ChangeDetectorRef,
                public searchFormProvider: SimplifiedSearchFormProvider,
                protected ssip: SimplifiedSettingsProvider,
                protected sgs: SettingsGroupsService,
                protected router: Router,
                protected route: ActivatedRoute,
                protected serverStorage: ServerStorageService,
                protected elemRef: ElementRef) {
        this.defaultItemSettings = this.ssip.getDefaultItemSettings();
        this.defaultDetailSettings = this.ssip.getDefaultDetailSettings();
        this.itemSettings = this.ssip.getDefaultItemSettings();
        this.detailSettings = this.ssip.getDefaultDetailSettings();
        this.searchFormConfig.options.provider = this.searchFormProvider;
        this.searchFormConfig.options.selectedFilters.subscribe((res) => {
            this.selectSuggestionSearch(res);
        });
        this.searchFormConfig.options.onSearch.subscribe((res) => {
            this.moveSearchRow(res);
        });
        this.sgs.getSettingsUserById('simplified').subscribe((setups) => {
            if (setups) {
                this.itemSettings = $.extend(
                    true, this.itemSettings,
                    this.defaultItemSettings,
                    JSON.parse(setups[0].DATA).SimplifiedItemLayout
                );
                this.detailSettings = $.extend(
                    true,
                    this.detailSettings,
                    this.defaultDetailSettings,
                    JSON.parse(setups[0].DATA).SimplifiedDetailLayout
                );
            } else {
                this.itemSettings = $.extend(
                    true,
                    this.itemSettings,
                    this.defaultItemSettings
                );
                this.detailSettings = $.extend(
                    true,
                    this.detailSettings,
                    this.defaultDetailSettings
                );
            }

            this.setupsUpdated.emit({
                itemSettings: this.itemSettings,
                detailSettings: this.detailSettings
            });
        });
    }

    doSearch(fromStorage = false) {
        let self = this;
        if (!fromStorage) {
            this.searchData = {
                SearchCriteria: this.searchCriteria,
                Text: this.searchString,
                SeriesFilter: this.searchFormConfig.options.provider.config.options.outsideCriteria
            };
            this.storageService.store(SimplifiedSearchComponent.storagePrefix, this.searchData);
        }
        this.loading = true;
        this.overlay.showWhole();
        this.searchService.doSimplifiedSearch({
            SearchCriteria: this.searchCriteria,
            SortField: '',
            Text: this.searchString,
            Page: this.page
        }).subscribe((res: SimpleSearchResponse) => {
                self.loading = false;
                self.overlay.hideWhole();
                self.searchResults[self.page - 1] = res;
                self.totalCount = self.searchResults[self.page - 1].ResultCount;
                if (self.page === 1) {
                    self.totalPages = Math.ceil(self.totalCount / self.pagging);
                    self.totalPagesArr = Array(self.totalPages).fill(1);
                }
                if (self.totalPages > self.page) {
                    self.enabledMoreButton = true;
                    self.page++;
                } else {
                    self.enabledMoreButton = false;
                }
                self.searchStarted = true;
                self.cdr.detectChanges();
                self.pushChangesTosuggestion.emit();
                // /*debugger*/
                setTimeout(() => {
                    (<any>$('.item-content-wrapper .description')).ellipsis({
                        // force ellipsis after a certain number of lines. Default is 'auto'
                        lines: 3,
                        // class used for ellipsis wrapper and to namespace ellip line
                        ellipClass: 'ellip',
                        // set to true if you want ellipsis to update on window resize.
                        // Default is false
                        responsive: true,
                    });
                });
                self.resultsReady.emit();
            },
            err => {
                self.loading = false;
                self.overlay.hideWhole();
            });
            self.clearVideoBlock();
    }

    ngAfterViewInit() {
        this.serverStorage.retrieve([this.recentPrefix], true).subscribe((resp) => {
            this.recentItems = resp[0] && resp[0].Value && JSON.parse(resp[0].Value) || [];
            this.cdr.detectChanges();
        });
        let searchData = this.storageService.retrieve(SimplifiedSearchComponent.storagePrefix);

        if (!this.searchResults.length
            && !this.searchFormConfig.options.provider.searchForm.getRawValue().searchString
            && !searchData) {
            // this.router.navigate(['search', this.searchType]);
            this.router.navigate(
                [
                    appRouter.searchType.substr(
                        0,
                        appRouter.searchType.lastIndexOf('/')
                    ),
                    this.searchType
                ]
            );
        }


        if (searchData) {
            this.searchStarted = true;
            this.searchString = searchData.Text;
            this.searchFormConfig.options.provider.config
            .options.outsideSearchString = searchData.Text;

            if (searchData.SeriesFilter) {
                this.searchFormConfig.options.provider.config
                .options.outsideCriteria = searchData.SeriesFilter;
                this.doSeriesSearch(
                    this.searchFormConfig.options.provider.config.options.outsideCriteria.id, true);
            } else {
                this.searchCriteria = searchData.SearchCriteria;
                this.doSearch(true);
            }
        } else {
            this.searchStarted = false;
            this.cdr.detectChanges();
        }

        let resultsReadySubscription = this.resultsReady.subscribe(() => {
            setTimeout(() => {
                this.initScrollStorage();
            });
            resultsReadySubscription.unsubscribe();
        });
    }

    initScrollStorage() {

        let compRef = this;

        this.scrollStoreProvider = new ScrollStoreProvider({
            compContext: this,
            router: this.router,
            route: this.route
        });

        this.scrollStoreProvider
        .handleScroll('simplifiedItems', this.simplifiedItems.nativeElement);

    }

    setFacetsCollapsed() {
      this.facetsCollapsed = !this.facetsCollapsed;
    }

    setDetailsCollapsed(c) {
        this.detailsCollapsed = c;
    }

    doSeriesSearch(seriesId, fromStorage = false) {
        this.searchFormConfig.options.provider.config.options.outsideCriteria = {
            type: 'Series',
            title: this.searchString,
            id: seriesId
        };
        this.pushChangesTosuggestion.emit();

        if (!fromStorage) {
            this.searchData = {
                Text: this.searchString,
                SeriesFilter: this.searchFormConfig.options.provider.config.options.outsideCriteria
            };
            this.storageService.store(SimplifiedSearchComponent.storagePrefix, this.searchData);
        }
    }

    selectSuggestionSearch($event) {
        if ($event.searchString) {
            this.searchString = $event.searchString;
        }
        if (Object.keys($event.searchCriteria).length > 0) {
            this.changeSearchCriteria($event.searchCriteria);
        } else {
            this.page = 1;
            this.searchCriteria = [];
            this.searchFormConfig.options.provider.config.options.outsideCriteria = null;
            if (this.searchResults.length === 0) {
                this.selectedItem = this.storageService.retrieve(this.selectedPrefix);
                if (this.selectedItem && this.selectedItem.Title !== this.searchString) {
                    this.selectedItem = null;
                }
            } else {
                this.selectedItem = null;
            }
            this.doSearch();
        }
    };

    changeSearchCriteria(criteriaArray) {
        let delIndex = null;
        let checkAdd = false;
        this.searchFormConfig.options.provider.config
        .options.outsideSearchString = this.searchString;
        for (let i = 0; i < this.searchCriteria.length; i++) {
            if (criteriaArray.value === null) {
                if (this.searchCriteria[i].FieldId === criteriaArray.fieldId) {
                    delIndex = i;
                    break;
                }
            } else {
                if (this.searchCriteria[i].FieldId === criteriaArray.fieldId) {
                    this.searchCriteria[i].Value = criteriaArray.value;
                    break;
                }
                checkAdd = true;
            }
        }
        if (delIndex !== null) {
            this.searchCriteria.splice(delIndex, 1);
            this.page = 1;
            this.doSearch();
        } else if (checkAdd || this.searchCriteria.length === 0) {
            this.searchCriteria
            .push({FieldId: criteriaArray.fieldId, Operation: '=', Value: criteriaArray.value});
            this.page = 1;
            this.doSearch();
        }
    }

    clearFacets() {
        if (this.searchCriteria.length !== 0) {
            this.searchCriteria = [];
            this.page = 1;
            this.doSearch();
        }
    }

    toggleItemSelection(item) {
        if (item !== undefined) {
            this.selectedItem = item;
            this.storageService.store(this.selectedPrefix, this.selectedItem);
            this.addItemToRecent(item);
        } else {
            this.storageService.store(this.selectedPrefix, null);
            this.selectedItem = null;
        }
        this.setCinemaMode(item);
        this.cdr.detectChanges();
    }

    addItemToRecent(item) {
        for (let i = 0; i < this.recentItems.length; i++) {
            if (this.recentItems[i].ID === item.ID) {
                return;
            }
        }
        this.recentItems.unshift(item);
        this.cdr.detectChanges();
        if (this.recentItems.length > this.recentLimit) {
            this.recentItems.splice(this.recentLimit, 10);
            this.cdr.detectChanges();
        }
        // this.localStorage.store(this.recentPrefix, this.recentItems);
        this.serverStorage.store(this.recentPrefix, this.recentItems).subscribe((res) => {
            console.log(res);
        });
    }

    showFromRecent(item) {
        this.selectedItem = item;
        this.storageService.store(this.selectedPrefix, this.selectedItem);
        this.searchFormConfig.options.provider.config.options.outsideSearchString = item.Title;
        this.searchString = item.Title;
        this.doSearch();
    }

    moveSearchRow(state) {
        this.rowUp = state;
        this.cdr.detectChanges();
    };

    setCinemaMode(item) {
        if (item.ProxyUrl && item.ProxyUrl.length > 0
            && item.ProxyUrl.match(/^(http|https):\/\//g)
            && item.ProxyUrl.match(/^(http|https):\/\//g).length > 0
            && $('.cinema-mode-player').children().length > 0) {
          $('.simplified-blocks-wrapper.grid')
          .addClass('simplified-blocks-wrapper-with-cinema-player');
        } else {
          $('.simplified-blocks-wrapper.grid')
          .removeClass('simplified-blocks-wrapper-with-cinema-player');
        }
    };

    clearVideoBlock() {
      $('.cinema-mode-player').children().remove();
      $('.simplified-blocks-wrapper.grid')
      .removeClass('simplified-blocks-wrapper-with-cinema-player');
    }

    checkSelectedItem() {
      let lengthPage = this.searchResults.length;
      for (let j = 0; j < lengthPage; j++) {
        // indexOf(this.selectedItem.VersionId);
        let lengthItem = this.searchResults[j].Items.length;
        for (let i = 0; i < lengthItem; i++) {
          if (this.searchResults[0].Items[i].VersionId === this.selectedItem.VersionId) {
            return true;
          }
        }
      }
      return false;
    };
}
