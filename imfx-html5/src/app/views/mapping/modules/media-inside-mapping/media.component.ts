import {ChangeDetectionStrategy, Component, EventEmitter, Injector, ViewChild, ViewEncapsulation} from "@angular/core";

import {ActivatedRoute, Router} from "@angular/router";
// Views
import {ViewsConfig} from "../../../../modules/search/views/views.config";
import {MediaInsideMappingViewsProvider} from "./providers/views.provider";
// Form
import {SearchFormConfig} from "../../../../modules/search/form/search.form.config";
import {SearchFormProvider} from "../../../../modules/search/form/providers/search.form.provider";
// Thumbs
import {
    SearchThumbsConfig,
    SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from "../../../../modules/search/thumbs/search.thumbs.config";
import {SearchThumbsProvider} from "../../../../modules/search/thumbs/providers/search.thumbs.provider";
// Facets
import {SearchFacetsProvider} from "../../../../modules/search/facets/providers/search.facets.provider";
// Search Settings
import {SearchSettingsConfig} from "../../../../modules/search/settings/search.settings.config";
// Modal
import {ModalConfig} from "../../../../modules/modal/modal.config";
// Search Columns
import {SearchColumnsComponent} from "../../../../modules/search/columns/search.columns";
import {SearchColumnsService} from "../../../../modules/search/columns/services/search.columns.service";
import {SearchColumnsProvider} from "../../../../modules/search/columns/providers/search.columns.provider";
// Info Modal
import {InfoModalConfig} from "../../../../modules/search/info.modal/info.modal.config";
import {InfoModalProvider} from "../../../../modules/search/info.modal/providers/info.modal.provider";
// Search Detail
import {MediaDetailInsideMappingProvider} from "./providers/media.detail.provider";
// constants
import {AppSettingsInterface} from "../../../../modules/common/app.settings/app.settings.interface";
// search component
import {SilverlightProvider} from "../../../../providers/common/silverlight.provider";
import {SimplifiedSettingsTransferProvider} from "../../../../modules/settings/simplified/simplified.settings.transfer.provider";
import {TransferdSimplifedType} from "../../../../modules/settings/simplified/types";
import {ExportProvider} from "../../../../modules/export/providers/export.provider";
import {SearchSettingsProvider} from "../../../../modules/search/settings/providers/search.settings.provider";
import {SearchThumbsComponent} from "../../../../modules/search/thumbs/search.thumbs";
import {SlickGridComponent} from "../../../../modules/search/slick-grid/slick-grid";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions,
    SlickGridConfigPluginSetups
} from "../../../../modules/search/slick-grid/slick-grid.config";
import {SlickGridService} from "../../../../modules/search/slick-grid/services/slick.grid.service";
import {MediaInsideMappingSlickGridProvider} from "./providers/media.slick.grid.provider";
import {CoreSearchComponent} from "../../../../core/core.search.comp";
import {ViewsProvider} from "../../../../modules/search/views/providers/views.provider";
import {DetailComponent} from "../../../../modules/search/detail/detail";
import {MediaAppSettings} from "../../../media/constants/constants";
import {MappingComponent} from "../../mapping.component";
import {MediaInsideMappingSearchFormProvider} from "./providers/search.form.provider";
import {MediaSlickGridProvider} from "../../../media/providers/media.slick.grid.provider";
import { IMFXModalProvider } from '../../../../modules/imfx-modal/proivders/provider';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {SearchViewsComponent} from "../../../../modules/search/views/views";

@Component({
    selector: 'media-inside-mapping',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        MediaSlickGridProvider,
        MediaInsideMappingSlickGridProvider,
        {provide: MediaSlickGridProvider, useClass: MediaInsideMappingSlickGridProvider},
        SlickGridService,
        ViewsProvider,
        {provide: ViewsProvider, useClass: MediaInsideMappingViewsProvider},
        // GridService,
        // MediaGridProvider,
        MediaAppSettings,
        SearchThumbsProvider,
        SearchFormProvider,
        MediaInsideMappingSearchFormProvider,
        {provide: SearchFormProvider, useClass: MediaInsideMappingSearchFormProvider},
        SearchColumnsProvider,
        SearchColumnsService,
        InfoModalProvider,
        SilverlightProvider,
        SearchSettingsProvider,
        MediaDetailInsideMappingProvider,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
    ]
})

export class MediaInsideMappingComponent extends CoreSearchComponent {
    localStorageService: any;
    public mappingComp: MappingComponent;
    public refreshStarted: boolean = false;
    @ViewChild('mediaSlickGridComp') slickGridComp: SlickGridComponent;
    @ViewChild('imfxDetailModule') imfxDetailModule: DetailComponent;

    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        // providerType: TitlesSlickGridProvider,
        providerType: MediaInsideMappingSlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                dragDropCellEvents: {
                    dropCell: true,
                    dragEnterCell: false,
                    dragLeaveCell: false,
                    dragStartCell: true,
                },
                viewModeSwitcher: true,
                viewMode: 'table',
                tileSource: ['TITLE', 'MEDIA_TYPE_text', 'MEDIA_FORMAT_text', 'DURATION_text'],
                // searchType: 'title',
                searchType: 'Media',
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
                        'popupEl': '#mediaInsideMapping.mediaInsideMappingSettingsPopup'
                    }
                },
                tileParams: { // from media css
                    tileWidth: 267 + 24,
                    tileHeight: 276 + 24
                },
                selectFirstRow: false
            },
            plugin: <SlickGridConfigPluginSetups>{
                multiSelect: true
            }
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
            type: 'MediaGrid',
        }
    };


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
            provider: <SearchFormProvider>null,
            searchButtonAlwaysEnabled: true,
            doSearchOnStartup: true
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
        //         appSettings: <MediaAppSettings>null
        //     }
        // };

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

    private flagHide = true;
    private openFacets = false;

    /**
     * Settings
     * @type {SearchSettingsConfig}
     */
    private searchSettingsConfig = <SearchSettingsConfig>{
        componentContext: this,
        options: {
            provider: <SearchSettingsProvider>null
        }
    };

    /**
     * Settings columns
     * @type {ModalConfig}
     */
    private searchColumnsModalConfig = <ModalConfig>{
        componentContext: this,
        options: {
            modal: {
                size: 'sm',
                title: 'columns_modal.header',
                top: '47%',
                isFooter: false,
            },
            content: {
                view: SearchColumnsComponent,
                options: {
                    provider: <SearchColumnsProvider>null,
                    service: <SearchColumnsService>null
                }
            }
        }
    };

    /**
     * Info Modal
     * @type {InfoModalConfig}
     */
    private infoModalConfig = <InfoModalConfig>{
        componentContext: this,
        options: {
            provider: <InfoModalProvider>null
        }
    };


    constructor(protected viewsProvider: ViewsProvider,
                // protected searchGridService: GridService,
                // protected searchGridProvider: MediaGridProvider,
                protected infoModalProvider: InfoModalProvider, // TODO Implement info modal
                protected searchThumbsProvider: SearchThumbsProvider,
                protected searchFacetsProvider: SearchFacetsProvider,
                protected mediaDetailProvider: MediaDetailInsideMappingProvider,
                public searchFormProvider: SearchFormProvider,
                protected searchColumnsModalProvider: SearchColumnsProvider,
                protected searchColumnsModalService: SearchColumnsService,
                protected appSettings: MediaAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                protected silver: SilverlightProvider,
                protected simpleTransferProvider: SimplifiedSettingsTransferProvider,
                public exportProvider: ExportProvider,
                protected searchSettingsProvider: SearchSettingsProvider,
                protected injector: Injector) {
        super(injector);
        // super(router, route);
        this.simpleTransferProvider.updated.subscribe((setups: TransferdSimplifedType) => {
            console.log(setups);
            /*debugger*/
        });

        // // grid service
        // this.searchGridConfig.options.service = searchGridService;
        //
        // // grid provider
        // this.searchGridConfig.options.provider = searchGridProvider;

        // views provider
        this.searchViewsConfig.options.provider = viewsProvider;

        // setup columns for grid
        this.searchColumnsModalConfig.options.content.options.provider = searchColumnsModalProvider;
        this.searchColumnsModalConfig.options.content.options.service = searchColumnsModalService;

        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;

        // thumbnails provider
        // this.searchThumbsConfig.options.provider = this.searchThumbsProvider;
        // this.searchThumbsConfig.options.appSettings = this.appSettings;

        this.infoModalConfig.options.provider = infoModalProvider;

        // export
        this.exportProvider.componentContext = (<CoreSearchComponent>this);

        // search settings
        this.searchSettingsConfig.options.provider = this.searchSettingsProvider;
    }

    onSplitResize() {
        // this.slickGridComp.provider.resize();
    }


    // ngOnInit() {
    //     // super.ngOnInit();
    //     // this.localStorageService = localStorage;
    //     // var detailButtonState = this.localStorageService.getItem(
    //    'tmd.detailbutton.state.' + this.searchGridConfig.options.type);
    //     // if (detailButtonState == 'true') {
    //     //     this.openDetail = true;
    //     // }
    // }

    ngAfterViewInit() {
        // setTimeout(() => {
        //     this.mappingComp.searchAdvancedProvider.onToggle.subscribe((state: boolean) => {
        //       this.slickGridComp.provider.resize();
        //     });
        // }, 0)
        // // debugger;
    }
}
