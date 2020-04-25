import {Component, ElementRef, EventEmitter, Injector, ViewChild, ViewEncapsulation} from '@angular/core';
//  Views
import {ViewsConfig} from '../../modules/search/views/views.config';
import {TitlesViewsProvider} from './providers/views.provider';
//  Grid
import {GridConfig} from '../../modules/search/grid/grid.config';
import {TitlesSlickGridProvider} from './providers/slick.grid.provider';
//  Form
import {SearchFormConfig} from '../../modules/search/form/search.form.config';
import {SearchFormProvider} from '../../modules/search/form/providers/search.form.provider';
// Search Settings
import {SearchSettingsConfig} from '../../modules/search/settings/search.settings.config';
// Search Modal
import {SearchColumnsProvider} from '../../modules/search/columns/providers/search.columns.provider';
//  Modal
// Search Columns
import {SearchColumnsService} from '../../modules/search/columns/services/search.columns.service';
// Info Modal
import {InfoModalConfig} from '../../modules/search/info.modal/info.modal.config';
import {InfoModalProvider} from '../../modules/search/info.modal/providers/info.modal.provider';
// Search Settings
import {SearchRecentConfig} from '../../modules/search/recent/search.recent.config';
import {SearchRecentProvider} from '../../modules/search/recent/providers/search.recent.provider';
//  Advanced search
import {SearchAdvancedConfig} from '../../modules/search/advanced/search.advanced.config';
import {SearchAdvancedProvider} from '../../modules/search/advanced/providers/search.advanced.provider';
//  constants
import {TitlesAppSettings} from './constants/constants';
import {AppSettingsInterface} from '../../modules/common/app.settings/app.settings.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchSettingsProvider} from '../../modules/search/settings/providers/search.settings.provider';
import {SlickGridComponent} from '../../modules/search/slick-grid/slick-grid';
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from '../../modules/search/slick-grid/slick-grid.config';
import {SlickGridProvider} from '../../modules/search/slick-grid/providers/slick.grid.provider';
import {SlickGridService} from '../../modules/search/slick-grid/services/slick.grid.service';
import {VersionsInsideTitlesComponent} from './modules/versions/versions.component';
import {MediaInsideTitlesComponent} from './modules/media/media.component';
import {TitlesSlickGridService} from './modules/versions/services/slickgrid.service';
import {TitlesVersionsSlickGridProvider} from './modules/versions/providers/titles.versions.slickgrid.provider';
import {TitlesMediaSlickGridProvider} from './modules/media/providers/titles.media.slickgrid.provider';
import {CoreSearchComponent} from '../../core/core.search.comp';
import {ViewsProvider} from '../../modules/search/views/providers/views.provider';
import {IMFXModalProvider} from '../../modules/imfx-modal/proivders/provider';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ViewsService} from "../../modules/search/views/services/views.service";
import {SearchViewsComponent} from "../../modules/search/views/views";

@Component({
    selector: 'titles',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SlickGridService,
        {provide: SlickGridProvider, useClass: TitlesSlickGridProvider},
        {provide: SlickGridService, useClass: TitlesSlickGridService},
        ViewsProvider,
        {provide: ViewsProvider, useClass: TitlesViewsProvider},
        TitlesAppSettings,
        SearchFormProvider,
        SearchRecentProvider,
        SearchAdvancedProvider,
        SearchColumnsProvider,
        SearchColumnsService,
        InfoModalProvider,
        SearchSettingsProvider,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
        ViewsService,
    ]
})

export class TitlesComponent extends CoreSearchComponent {
    /**
     * Reference to versions table
     */
    @ViewChild('versionsGrid') public versionsGridRef: VersionsInsideTitlesComponent;
    /**
     * Reference to media table
     */
    @ViewChild('mediaGrid') public mediaGridRef: MediaInsideTitlesComponent;
    @ViewChild('tableSplit') public tableSplitRef: ElementRef;
    /**
     * Grid for titles
     * @type {GridConfig}
     */
        // protected searchGridConfig = <GridConfig>{
        //     componentContext: this,
        //     gridOptions: {
        //         layoutInterval: -1,
        //         //  pages removed in styles
        //         paginationPageSize: -1,
        //         overlayLoadingTemplate: this.searchGridProvider.getLoadingOverlay(),
        //         headerHeight: 30
        //     },
        //     options: {
        //         isTree: true,
        //         //firstLevelHeight: 48, //80
        //         type: 'title',
        //         searchType: 'TitleSearch',
        //         viewModeSwitcher: false,
        //         service: <GridService>null,
        //         provider: <TitlesGridProvider>null,
        //         onSelectedView: new EventEmitter<any>(),
        //         onSelectedCloumnInModal: new EventEmitter<any>(),
        //         rowHeight: 30,
        //         expandedGroup: true
        //     },
        // };

    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    /**
     * Advanced search
     * @type {SearchAdvancedConfig}
     */
    public searchAdvancedConfig = <SearchAdvancedConfig>{
        componentContext: this,
        options: {
            provider: <SearchAdvancedProvider>null,
            restIdForParametersInAdv: 'TitleSearch',
            enabledQueryByExample: false,
            enabledQueryBuilder: true,
            advancedSearchMode: 'builder'
        }
    };
    /**
     * Views
     * @type {ViewsConfig}
     */
    @ViewChild('viewsComp') public viewsComp: SearchViewsComponent;
    protected moduleTitleContext = this;
    protected detectSearch: EventEmitter<any> = new EventEmitter<any>();
    /**
     * Form
     * @type {SearchFormConfig}
     */
    public searchFormConfig = <SearchFormConfig>{
        componentContext: this,
        options: {
            // currentMode: 'Titles',
            //  arraysOfResults: ['titles', 'series', 'contributors'],
            appSettings: <AppSettingsInterface>null,
            provider: <SearchFormProvider>null,
            onSubmitEmitter: this.detectSearch
        }
    };
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                searchType: 'title',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: false,
                enableSorting: false,
                pager: {
                    enabled: false,
                },
                isTree: {
                    enabled: true,
                    startState: 'collapsed',
                    expandMode: 'firstLevel'
                },
                bottomPanel: {
                    enabled: true
                }
                // popupsSelectors: {
                //     'settings': {
                //         'popupEl': '.mediaSettingsPopup'
                //     }
                // }
            },
            // plugin: <SlickGridConfigPluginSetups>{
            //     suppressCleanup: true
            // }
        })
    });
    protected searchViewsConfig = <ViewsConfig>{
        componentContext: this,
        options: {
            type: 'TitleTree',
        }
    };


    /**
     * Settings
     * @type {SearchSettingsConfig}
     */
    protected searchSettingsConfig = <SearchSettingsConfig>{
        componentContext: this,
    };

    /**
     * Info Modal
     * @type {InfoModalConfig}
     */
    // private infoModalConfig = <InfoModalConfig>{
    //     componentContext: this,
    //     options: {
    //         provider: <InfoModalProvider>null
    //     }
    // };

    /**
     * Recent searches
     * @type {SearchRecentConfig}
     */
    private searchRecentConfig = <SearchRecentConfig>{
        componentContext: this,
        options: {
            provider: <SearchRecentProvider>null,
            viewType: 'adv.recent.searches.titles',
            itemsLimit: 10
        }
    };

    @ViewChild('selectViewControl') private selectViewControl;
    private isVisibleTitles: boolean = true;
    private isVisibleVersions: boolean = true;
    private isVisibleMedia: boolean = true;

    constructor(public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                protected searchAdvancedProvider: SearchAdvancedProvider,
                protected appSettings: TitlesAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                protected injector: Injector) {
        super(injector);

        //  app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;

        //  recent searches
        this.searchRecentConfig.options.provider = this.searchRecentProvider;

        //  advanced search
        this.searchAdvancedConfig.options.provider = this.searchAdvancedProvider;
    }

    get VisibleTitles() {
        return this.isVisibleTitles;
    }

    set VisibleTitles(isVisible: boolean) {
        this.isVisibleTitles = isVisible;
    }

    get VisibleVersions() {
        return this.isVisibleVersions;
    }

    set VisibleVersions(isVisible: boolean) {
        this.isVisibleVersions = isVisible;
    }

    get VisibleMedia() {
        return this.isVisibleMedia;
    }

    set VisibleMedia(isVisible: boolean) {
        this.isVisibleMedia = isVisible;
    }

    ngAfterViewInit() {
        this.selectViewControl.setSelectedByIds(['t-v-m']);
        this.detectSearch.subscribe(() => {
            this.slickGridComp.provider.clearData(true);
            if (this.versionsGridRef) {
                this.clearResultForVersionsGrid();
            }
            if (this.mediaGridRef) {
                this.clearResultForMediaGrid();
            }
        });

        // let sap = this.injector.get(SearchAdvancedProvider);
        // sap.onToggle.subscribe(() => {
        //     this.versionsGridRef.slickGridComp.provider.resize();
        //     this.mediaGridRef.slickGridComp.provider.resize();
        // })
    }

    clearResultForVersionsGrid() {
        let verGridProvider: TitlesVersionsSlickGridProvider = (
            <SlickGridComponent>this.versionsGridRef.slickGridComp
        ).provider;
        if (verGridProvider.getData().length > 0) {
            verGridProvider.clearData(true);
        }

        verGridProvider.setPlaceholderText('ng2_components.ag_grid.noRowsToShow', true, {});
        verGridProvider.showPlaceholder();
    }

    clearResultForMediaGrid() {
        let medGridProvider: TitlesMediaSlickGridProvider = (
            <SlickGridComponent>this.mediaGridRef.slickGridComp
        ).provider;
        if (medGridProvider.getData().length > 0) {
            medGridProvider.clearData(true);
        }
        medGridProvider.setPlaceholderText('ng2_components.ag_grid.noRowsToShow', true, {});
        medGridProvider.showPlaceholder();
    }

    //need for correct 'overflow:visible' logic for splitters
    doStateOverflow(state) {
        let arrSplitters = this.tableSplitRef.nativeElement.querySelectorAll('split-area.titles-splitter');
        arrSplitters = Array.from(arrSplitters);

        if (state == 'hidden') {
            $(arrSplitters).addClass('overflow-hidden-splitter');
        } else if (state == 'visible') {
            $(arrSplitters).addClass('overflow-hidden-splitter');

            if (!this.VisibleMedia) {
                arrSplitters.pop();
            }
            if (!this.VisibleVersions) {
                arrSplitters.pop();
            }
            if (!this.VisibleTitles) {
                arrSplitters.pop();
            }

            $(arrSplitters).removeClass('overflow-hidden-splitter');
        } else {
            return;
        }
    }

    /**
     * On change view mode for current display
     */
    onChangeViewMode() {
        let flags: Array<string> = this.selectViewControl.getSelected().split('-');
        this.VisibleTitles = flags.indexOf('t') > -1 ? true : false;
        this.VisibleVersions = flags.indexOf('v') > -1 ? true : false;
        this.VisibleMedia = flags.indexOf('m') > -1 ? true : false;

        this.doStateOverflow('visible');


        // setImmediate(() => {
        //     // titles
        //     this.slickGridComp.provider.resize();
        //
        //     // versions
        //     let verGridProvider: TitlesVersionsSlickGridProvider = (
        //         <SlickGridComponent>this.versionsGridRef.slickGridComp
        //     ).provider;
        //     verGridProvider.resize();
        //
        //     // media
        //     if (this.VisibleMedia) {
        //         let medGridProvider: TitlesMediaSlickGridProvider = (
        //             <SlickGridComponent>this.mediaGridRef.slickGridComp
        //         ).provider;
        //         medGridProvider.resize();
        //     }
        // });
    }

    onDragProgress() {
        // this.slickGridComp.provider.resize();
        // this.versionsGridRef.slickGridComp.provider.resize();
        // this.mediaGridRef.slickGridComp.provider.resize();
    }
}

