import {Component, EventEmitter, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
// Views
import {ViewsConfig} from "../../modules/search/views/views.config";
import {VersionViewsProvider} from "./providers/views.provider";
// Grid
import {GridConfig} from "../../modules/search/grid/grid.config";
// Form
import {SearchFormConfig} from "../../modules/search/form/search.form.config";
import {SearchFormProvider} from "../../modules/search/form/providers/search.form.provider";
// Facets
import {SearchFacetsConfig} from "../../modules/search/facets/search.facets.config";
import {SearchFacetsProvider} from "../../modules/search/facets/providers/search.facets.provider";
// Thumbs
import {
    SearchThumbsConfig,
    SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from "../../modules/search/thumbs/search.thumbs.config";
import {SearchThumbsProvider} from "../../modules/search/thumbs/providers/search.thumbs.provider";
// Search Settings
import {SearchSettingsConfig} from "../../modules/search/settings/search.settings.config";
// Search Modal
// Modal
// Search Columns
import {SearchColumnsService} from "../../modules/search/columns/services/search.columns.service";
import {SearchColumnsProvider} from "../../modules/search/columns/providers/search.columns.provider";
// Info Modal
// Search Detail
import {DetailConfig} from "../../modules/search/detail/detail.config";
import {VersionDetailProvider} from "./providers/version.detail.provider";
// Search Settings
import {SearchRecentConfig} from "../../modules/search/recent/search.recent.config";
import {SearchRecentProvider} from "../../modules/search/recent/providers/search.recent.provider";

import {SearchAdvancedConfig} from "../../modules/search/advanced/search.advanced.config";
import {SearchAdvancedProvider} from "../../modules/search/advanced/providers/search.advanced.provider";
// constants
import {VersionAppSettings} from "./constants/constants";
import {AppSettingsInterface} from "../../modules/common/app.settings/app.settings.interface";
import {ExportProvider} from "../../modules/export/providers/export.provider";
import {SearchSettingsProvider} from "../../modules/search/settings/providers/search.settings.provider";
import {ClipEditorService} from "../../services/clip.editor/clip.editor.service";
import {SearchThumbsComponent} from "../../modules/search/thumbs/search.thumbs";
import {CoreSearchComponent} from "../../core/core.search.comp";
// search component
import {SlickGridComponent} from "../../modules/search/slick-grid/slick-grid";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from "../../modules/search/slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../modules/search/slick-grid/providers/slick.grid.provider";
import {SlickGridService} from "../../modules/search/slick-grid/services/slick.grid.service";
import {VersionSlickGridProvider} from "./providers/version.slick.grid.provider";
import {ViewsProvider} from "../../modules/search/views/providers/views.provider";
import {IMFXModalProvider} from "../../modules/imfx-modal/proivders/provider";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {VersionWizardProvider} from "../../modules/version-wizard/providers/wizard.provider";
import {VersionWizardService} from "../../modules/version-wizard/services/wizard.service";
import {SearchViewsComponent} from "../../modules/search/views/views";

@Component({
    selector: 'version',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ViewsProvider,
        {provide: ViewsProvider, useClass: VersionViewsProvider},
        VersionAppSettings,
        VersionDetailProvider,
        SearchFacetsProvider,
        SearchThumbsProvider,
        SearchFormProvider,
        SearchRecentProvider,
        SearchAdvancedProvider,
        SearchColumnsService,
        SearchColumnsProvider,
        SearchSettingsProvider,
        VersionWizardProvider,
        VersionWizardService,
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: VersionSlickGridProvider},
        SlickGridService,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
    ]
})

export class VersionComponent extends CoreSearchComponent {
    openDetail: boolean;
    localStorageService: any;
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    /**
     * Form
     * @type {SearchFormConfig}
     */
    public searchFormConfig = <SearchFormConfig>{
        componentContext: this,
        options: {
            currentMode: 'Titles',
            arraysOfResults: ['titles', 'series', 'contributors'],
            appSettings: <AppSettingsInterface>null,
            provider: <SearchFormProvider>null
        }
    };
    /**
     * Facets
     * @type {SearchFacetsConfig}
     */
    public searchFacetsConfig = <SearchFacetsConfig>{
        componentContext: this,
        enabled: false,
        options: {
            provider: <SearchFacetsProvider>null,
            onSearchStringUpdated: new EventEmitter<any>()
        }
    };
    @ViewChild('searchThumbsComp') searchThumbsComp: SearchThumbsComponent;
    searchThumbsConfig = new SearchThumbsConfig(<SearchThumbsConfig>{
        componentContext: this,
        providerType: SearchThumbsProvider,
        appSettingsType: VersionAppSettings,
        options: new SearchThumbsConfigOptions(<SearchThumbsConfigOptions>{
            module: <SearchThumbsConfigModuleSetups>{
                enabled: false,
            }
        })
    });
    /**
     * Recent searches
     * @type {SearchRecentConfig}
     */
    public searchRecentConfig = <SearchRecentConfig>{
        componentContext: this,
        options: {
            provider: <SearchRecentProvider>null,
            viewType: 'adv.recent.searches.versions',
            itemsLimit: 10
        }
    };
    /**
     * Advanced search
     * @type {SearchAdvancedConfig}
     */
    public searchAdvancedConfig = <SearchAdvancedConfig>{
        componentContext: this,
        options: {
            provider: <SearchAdvancedProvider>null,
            restIdForParametersInAdv: 'Version',
            enabledQueryByExample: false,
            enabledQueryBuilder: true,
            advancedSearchMode: 'builder'
        }
    };
    /**
     * Grid
     * @type {GridConfig}
     */
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: true,
                viewMode: 'table',
                tileSource: ['SER_TITLE', 'TITLE', 'VERSION', 'SER_NUM', 'DURATION_text'],
                savedSearchType: 'Version',
                searchType: 'versions',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: true,
                pager: {},
                isTree: {
                    enabled: false,
                    startState: 'collapsed',
                    expandMode: 'firstLevel'
                },
                popupsSelectors: {
                    'settings': {
                        'popupEl': '.versionSettingsPopup'
                    }
                },
                tileParams: { // from media css
                    tileWidth: 267 + 24,
                    tileHeight: 276 + 24
                }
            },
        })
    });
    /**
     * Views
     * @type {ViewsConfig}
     */
    @ViewChild('viewsComp') public viewsComp: SearchViewsComponent;
    protected searchViewsConfig = <ViewsConfig>{
        componentContext: this,
        options: {
            type: 'VersionGrid',
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
     * Detail
     * @type {DetailConfig}
     */
    private detailConfig = <DetailConfig>{
        componentContext: this,
        options: {
            provider: <VersionDetailProvider>null,
            needApi: false,
            typeDetails: 'version-details',
            showInDetailPage: false,
            detailsviewType: 'VersionDetails',
            // friendlyNamesForDetail: 'FriendlyNames.TM_MIS',
            friendlyNamesForDetail: 'FriendlyNames.TM_PG_RL',
            data: {
                detailInfo: <any>null
            },
            onDataUpdated: new EventEmitter<any>(),
            detailsViews: []
        },
    };

    private flagHide = true;
    private openFacets = false;

    constructor(protected searchFacetsProvider: SearchFacetsProvider,
                protected versionDetailProvider: VersionDetailProvider,
                public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                protected searchAdvancedProvider: SearchAdvancedProvider,
                protected appSettings: VersionAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                public exportProvider: ExportProvider,
                public clipEditorService: ClipEditorService,
                protected injector: Injector) {
        super(injector);

        // detail provider
        this.detailConfig.options.provider = versionDetailProvider;
        this.detailConfig.options.appSettings = this.appSettings;

        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;

        // facets
        this.searchFacetsConfig.options.provider = this.searchFacetsProvider;

        // recent searches
        this.searchRecentConfig.options.provider = this.searchRecentProvider;

        // advanced search
        this.searchAdvancedConfig.options.provider = this.searchAdvancedProvider;

        // export
        this.exportProvider.componentContext = this;
    }
}
