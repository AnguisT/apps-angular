import {Component, EventEmitter, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
// Views
import {ViewsConfig} from "../../modules/search/views/views.config";
import {MappingVersionViewsProvider} from "./providers/views.provider";
// Grid
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

import {UploadProvider} from "../../modules/upload/providers/upload.provider";
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
import {MappingSlickGridProvider} from "./providers/slick.grid.provider";
import {ViewsProvider} from "../../modules/search/views/providers/views.provider";
import {MediaInsideMappingComponent} from "./modules/media-inside-mapping/media.component";
import {MediaDetailInsideMappingProvider} from "./modules/media-inside-mapping/providers/media.detail.provider";
import {SlickGridEventData} from "../../modules/search/slick-grid/types";
import {MediaAppSettings} from "../media/constants/constants";
import {DetailComponent} from "../../modules/search/detail/detail";
import {MediaDetailProvider} from "../media/providers/media.detail.provider";
import {SplitProvider} from "../../providers/split/split.provider";
import {MappingSlickGridPagerProvider} from "./providers/mapping.slick.grid.pager.provider";
import {MappingSlickGridPanelProvider} from "./providers/mapping.slick.grid.panel.provider";
import {MappingGridService} from "./services/mapping.grid.service";
import {IMFXModalProvider} from '../../modules/imfx-modal/proivders/provider';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {VersionWizardService} from "../../modules/version-wizard/services/wizard.service";
import {VersionWizardProvider} from "../../modules/version-wizard/providers/wizard.provider";
import {ViewsService} from "../../modules/search/views/services/views.service";
import {SearchViewsComponent} from "../../modules/search/views/views";

@Component({
    selector: 'mapping',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ViewsProvider,
        {provide: ViewsProvider, useClass: MappingVersionViewsProvider},
        MappingGridService,
        // VersionGridProvider,
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
        MappingSlickGridProvider,
        {provide: SlickGridProvider, useClass: MappingSlickGridProvider},
        SplitProvider,
        SlickGridService,
        MediaAppSettings,
        MediaDetailInsideMappingProvider,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
        ViewsService
    ]
})

export class MappingComponent extends CoreSearchComponent {
    openDetail: boolean;
    localStorageService: any;
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    @ViewChild('mediaInsideMapping') mediaInsideMapping: MediaInsideMappingComponent;
    @ViewChild('imfxVersionDetailModule') imfxVersionDetailModule: DetailComponent;
    @ViewChild('imfxMediaDetailModule') imfxMediaDetailModule: DetailComponent;
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
    /**
     * Thumbs
     * @type {SearchThumbsConfig}
     */
        // private searchThumbsConfig = <SearchThumbsConfig>{
        //     componentContext: this,
        //     enabled: false,
        //     options: {
        //         provider: <SearchThumbsProvider>null,
        //         appSettings: <VersionAppSettings>null
        //     }
        // };
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
     * @type {SlickGridConfig}
     */
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: MappingSlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                dragDropCellEvents: {
                    dropCell: true,
                    dragEnterCell: true,
                    dragLeaveCell: true,
                    dragStartCell: false,
                },
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
                        'popupEl': '#mapping.mappingSettingsPopup'
                    }
                },
                tileParams: { // from media css
                    tileWidth: 267 + 24,
                    tileHeight: 276 + 24
                },
                selectFirstRow: false
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
    private versionDetailConfig = <DetailConfig>{
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

    /**
     * Detail
     * @type {DetailConfig}
     */
    private mediaDetailConfig = <DetailConfig>{
        componentContext: this,
        options: {
            provider: <MediaDetailInsideMappingProvider>null,
            needApi: false,
            typeDetails: 'media-details',
            showInDetailPage: false,
            showAccordions: false,
            detailsviewType: 'MediaDetails',
            friendlyNamesForDetail: 'FriendlyNames.TM_MIS',
            data: {
                detailInfo: <any>null
            },
            onDataUpdated: new EventEmitter<any>(),
            detailsViews: [],
            externalSearchTextForMark: null,
            isOpenDetailPanel: false
        },
    };

    private flagHide = true;
    private openFacets = false;
    private currentActivePanel: 'mapping' | 'media-inside-mapping';

    constructor(public viewsProvider: ViewsProvider,
                public mappingService: MappingGridService,
                protected searchFacetsProvider: SearchFacetsProvider,
                // protected searchThumbsProvider: SearchThumbsProvider,
                protected versionDetailProvider: VersionDetailProvider,
                protected mediaDetailProvider: MediaDetailInsideMappingProvider,
                public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                public searchAdvancedProvider: SearchAdvancedProvider,
                protected appSettings: VersionAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                public uploadProvider: UploadProvider,
                public exportProvider: ExportProvider,
                protected searchSettingsProvider: SearchSettingsProvider,
                public clipEditorService: ClipEditorService,
                protected meidaAppSettings: MediaAppSettings,
                public splitProvider: SplitProvider,
                protected injector: Injector) {
        super(injector);

        // views provider
        this.searchViewsConfig.options.provider = viewsProvider;

        // detail provider
        this.versionDetailConfig.options.provider = versionDetailProvider;
        this.versionDetailConfig.options.appSettings = this.appSettings;

        // detail provider
        this.mediaDetailConfig.options.provider = mediaDetailProvider;
        this.mediaDetailConfig.options.appSettings = this.meidaAppSettings;

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
        (<any>this.exportProvider).componentContext = this;

        // search settings
        this.versionDetailProvider.inducingComponent = 'mapping';
    }

    ngAfterViewInit() {
        this.mediaInsideMapping.mappingComp = this;
    }

    onDataUpdatedForDetail(data: SlickGridEventData, from: 'mapping' | 'media-inside-mapping') {
        let versionDetailProvider: VersionDetailProvider = this.imfxVersionDetailModule.config.options.provider;
        let mediaDetailProvider: MediaDetailProvider = this.imfxMediaDetailModule.config.options.provider;
        if (from == 'mapping') {
            versionDetailProvider.update(data.row);
            if (versionDetailProvider.getStateForPanel() == true || mediaDetailProvider.getStateForPanel() == true) {
                versionDetailProvider.setStateForPanel(true);
                mediaDetailProvider.setStateForPanel(false);
            }
        } else if (from == 'media-inside-mapping') {
            mediaDetailProvider.update(data.row);
            if (versionDetailProvider.getStateForPanel() == true || mediaDetailProvider.getStateForPanel() == true) {
                mediaDetailProvider.setStateForPanel(true);
                versionDetailProvider.setStateForPanel(false);
            }
        }
        this.currentActivePanel = from;
    }

    toggleDetailPanel() {
        let versionDetailProvider: VersionDetailProvider = this.imfxVersionDetailModule.config.options.provider;
        let mediaDetailProvider: MediaDetailProvider = this.imfxMediaDetailModule.config.options.provider;
        if (this.currentActivePanel == 'mapping') {
            versionDetailProvider.togglePanel();
        } else if (this.currentActivePanel == 'media-inside-mapping') {
            mediaDetailProvider.togglePanel()
        } else {
            mediaDetailProvider.setStateForPanel(false);
            versionDetailProvider.togglePanel();
        }
    }
}
