import {Component, EventEmitter, Injector, ViewChild, ViewEncapsulation} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
// Views
import {ViewsConfig} from '../../modules/search/views/views.config';
import {MediaViewsProvider} from './providers/views.provider';
// Form
import {SearchFormConfig} from '../../modules/search/form/search.form.config';
import {SearchFormProvider} from '../../modules/search/form/providers/search.form.provider';
// Thumbs
import {
    SearchThumbsConfig,
    SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from '../../modules/search/thumbs/search.thumbs.config';
import {SearchThumbsProvider} from '../../modules/search/thumbs/providers/search.thumbs.provider';
// Facets
import {SearchFacetsConfig} from '../../modules/search/facets/search.facets.config';
import {SearchFacetsProvider} from '../../modules/search/facets/providers/search.facets.provider';
// Search Settings
import {SearchSettingsConfig} from '../../modules/search/settings/search.settings.config';
import {SearchColumnsService} from '../../modules/search/columns/services/search.columns.service';
import {SearchColumnsProvider} from '../../modules/search/columns/providers/search.columns.provider';
// Search Detail
import {DetailConfig} from '../../modules/search/detail/detail.config';
import {MediaDetailProvider} from './providers/media.detail.provider';
// Search Settings
import {SearchRecentConfig} from '../../modules/search/recent/search.recent.config';
import {SearchRecentProvider} from '../../modules/search/recent/providers/search.recent.provider';

import {SearchAdvancedConfig} from '../../modules/search/advanced/search.advanced.config';
import {SearchAdvancedProvider} from '../../modules/search/advanced/providers/search.advanced.provider';
// constants
import {MediaAppSettings} from './constants/constants';
import {AppSettingsInterface} from '../../modules/common/app.settings/app.settings.interface';
// search component
import {SilverlightProvider} from '../../providers/common/silverlight.provider';
import {SimplifiedSettingsTransferProvider} from '../../modules/settings/simplified/simplified.settings.transfer.provider';
import {TransferdSimplifedType} from '../../modules/settings/simplified/types';
import {ExportProvider} from '../../modules/export/providers/export.provider';
import {SearchSettingsProvider} from '../../modules/search/settings/providers/search.settings.provider';
import {SearchThumbsComponent} from '../../modules/search/thumbs/search.thumbs';
import {SlickGridComponent} from '../../modules/search/slick-grid/slick-grid';
import {
    SlickGridColorScheme,
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from '../../modules/search/slick-grid/slick-grid.config';
import {SlickGridProvider} from '../../modules/search/slick-grid/providers/slick.grid.provider';
import {SlickGridService} from '../../modules/search/slick-grid/services/slick.grid.service';
import {MediaSlickGridProvider} from './providers/media.slick.grid.provider';
import {CoreSearchComponent} from '../../core/core.search.comp';
import {ViewsProvider} from '../../modules/search/views/providers/views.provider';
import {DetailComponent} from "../../modules/search/detail/detail";
import {MappingGridService} from "../mapping/services/mapping.grid.service";
import {IMFXModalProvider} from "../../modules/imfx-modal/proivders/provider";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {UploadComponent} from "../../modules/upload/upload";
import {IMFXModalComponent} from "../../modules/imfx-modal/imfx-modal";
import {IMFXModalEvent} from "../../modules/imfx-modal/types";
import {ViewsService} from "../../modules/search/views/services/views.service";
import {SearchViewsComponent} from "../../modules/search/views/views";

@Component({
    selector: 'media',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: MediaSlickGridProvider},
        SlickGridService,
        ViewsProvider,
        {provide: ViewsProvider, useClass: MediaViewsProvider},
        // GridService,
        // MediaGridProvider,
        MediaAppSettings,
        MediaDetailProvider,
        SearchThumbsProvider,
        SearchFacetsProvider,
        SearchFormProvider,
        SearchRecentProvider,
        SearchAdvancedProvider,
        SearchColumnsProvider,
        SearchColumnsService,
        SilverlightProvider,
        SearchSettingsProvider,
        MappingGridService,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
        ViewsService
    ]
})

export class MediaComponent extends CoreSearchComponent {
    localStorageService: any;
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    @ViewChild('imfxDetailModule') imfxDetailModule: DetailComponent;
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
        appSettingsType: MediaAppSettings,
        options: new SearchThumbsConfigOptions(<SearchThumbsConfigOptions>{
            module: <SearchThumbsConfigModuleSetups>{
                enabled: false,
            }
        })
    });
    /**
     * Advanced search
     * @type {SearchAdvancedConfig}
     */
    public searchAdvancedConfig = <SearchAdvancedConfig>{
        componentContext: this,
        options: {
            provider: <SearchAdvancedProvider>null,
            restIdForParametersInAdv: 'Media',
            enabledQueryByExample: true,
            enabledQueryBuilder: true,
            advancedSearchMode: 'builder'
        }
    };
    /**
     * Views
     * @type {ViewsConfig}
     */
    @ViewChild('viewsComp') public viewsComp: SearchViewsComponent;
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        // providerType: TitlesSlickGridProvider,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: true,
                viewMode: 'table',
                tileSource: ['TITLE', 'MEDIA_TYPE_text', 'MEDIA_FORMAT_text', 'DURATION_text'],
                // searchType: 'title',
                searchType: 'Media',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: true,
                isTree: {
                    enabled: false,
                },
                popupsSelectors: {
                    'settings': {
                        'popupEl': '.mediaSettingsPopup'
                    }
                },
                tileParams: { // from media css
                    tileWidth: 267 + 24,
                    tileHeight: 276 + 24
                },
            }
        })
    });
    protected searchViewsConfig = <ViewsConfig>{
        componentContext: this,
        options: {
            type: 'MediaGrid',
        }
    };
    private flagHide = true;
    private openFacets = false;

    /**
     * Settings
     * @type {SearchSettingsConfig}
     */
    private searchSettingsConfig = <SearchSettingsConfig>{
        componentContext: this,
    };

    /**
     * Detail
     * @type {DetailConfig}
     */
    private detailConfig = <DetailConfig>{
        componentContext: this,
        options: {
            provider: <MediaDetailProvider>null,
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
            isOpenDetailPanel: false,
            colorGridScheme: {
                dark: <SlickGridColorScheme>{
                    colorbkgd: '#34404a',
                    colorbkgdmid: '#21282E'

                },
                default: <SlickGridColorScheme>{
                    colorbkgd: '#EDF1F2',
                    colorbkgdmid: '#E2E7EB'
                },
            }
        },
    };

    /**
     * Recent searches
     * @type {SearchRecentConfig}
     */
    private searchRecentConfig = <SearchRecentConfig>{
        componentContext: this,
        options: {
            provider: <SearchRecentProvider>null,
            viewType: 'adv.recent.searches.media',
            itemsLimit: 10
        }
    };

    constructor(protected searchThumbsProvider: SearchThumbsProvider,
                protected searchFacetsProvider: SearchFacetsProvider,
                protected mediaDetailProvider: MediaDetailProvider,
                public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                protected searchAdvancedProvider: SearchAdvancedProvider,
                protected appSettings: MediaAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                protected silver: SilverlightProvider,
                protected simpleTransferProvider: SimplifiedSettingsTransferProvider,
                public exportProvider: ExportProvider,
                protected searchSettingsProvider: SearchSettingsProvider,
                protected injector: Injector,
    ) {
        super(injector);
        // super(router, route);
        this.simpleTransferProvider.updated.subscribe((setups: TransferdSimplifedType) => {
            /*debugger*/
        });

        // detail provider
        this.detailConfig.options.provider = mediaDetailProvider;
        // mediaDetailProvider.config = this.detailConfig;
        // debugger;
        this.detailConfig.options.appSettings = this.appSettings;

        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;

        // thumbnails provider
        // this.searchThumbsConfig.options.provider = this.searchThumbsProvider;
        // this.searchThumbsConfig.options.appSettings = this.appSettings;

        // facets
        this.searchFacetsConfig.options.provider = this.searchFacetsProvider;

        // recent searches
        this.searchRecentConfig.options.provider = this.searchRecentProvider;

        // advanced search
        this.searchAdvancedConfig.options.provider = this.searchAdvancedProvider;

        // export
        this.exportProvider.componentContext = (<CoreSearchComponent>this);
    }
}
