import {ChangeDetectionStrategy, Component, EventEmitter, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {GridConfig} from "../../../../modules/search/grid/grid.config";
import {ViewsConfig} from "../../../../modules/search/views/views.config";
import {
    SearchThumbsConfig,
    SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from "../../../../modules/search/thumbs/search.thumbs.config";
import {SearchThumbsProvider} from "../../../../modules/search/thumbs/providers/search.thumbs.provider";
import {MediaAppSettings} from "../../../../views/media/constants/constants";
import {SearchSettingsProvider} from "../../../../modules/search/settings/providers/search.settings.provider";
import {ActivatedRoute, Router} from "@angular/router";
import {SilverlightProvider} from "../../../../providers/common/silverlight.provider";
import {VersionWizardMediaViewsProvider} from "./providers/version.wizard.views.provider";
import {SearchThumbsComponent} from "../../../../modules/search/thumbs/search.thumbs";
import {CoreSearchComponent} from "../../../../core/core.search.comp";
import {SlickGridService} from "../../../../modules/search/slick-grid/services/slick.grid.service";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions,
    SlickGridConfigPluginSetups
} from "../../../../modules/search/slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../../../modules/search/slick-grid/providers/slick.grid.provider";
import {SlickGridComponent} from "../../../../modules/search/slick-grid/slick-grid";
import {MediaSlickGridProvider} from "../../../../views/media/providers/media.slick.grid.provider";
import {VersionWizardMediaGridProvider} from "./providers/version.wizard.media.grid.provider";
import {VersionWizardMediaSlickGridProvider} from "./providers/version.wizard.media.slickgrid.provider";
import {SearchFormProvider} from "../../../../modules/search/form/providers/search.form.provider";
import {ViewsProvider} from "../../../../modules/search/views/providers/views.provider";
import {SearchViewsComponent} from "../../../search/views/views";

@Component({
    selector: 'version-wizard-media',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ViewsProvider,
        VersionWizardMediaViewsProvider,
        {provide: ViewsProvider, useClass: VersionWizardMediaViewsProvider},
        MediaAppSettings,
        SearchThumbsProvider,
        SilverlightProvider,
        SearchSettingsProvider,
        SlickGridProvider,
        MediaSlickGridProvider,
        SearchFormProvider,
        {provide: SlickGridProvider, useClass: VersionWizardMediaSlickGridProvider},
        SlickGridService
    ]
})

export class VersionWizardMediaComponent extends CoreSearchComponent {
    /**
     * Grid
     * @type {GridConfig}
     */
    // protected searchGridConfig = <GridConfig>{
    //     componentContext: this,
    //     gridOptions: {
    //         layoutInterval: -1,
    //         // columnDefs: [],
    //         // overlayLoadingTemplate: this.searchGridProvider.getLoadingOverlay(),
    //     },
    //     options: {
    //         type: 'media',
    //         searchType: 'Media',
    //         viewModeSwitcher: true,
    //         service: <GridService>null,
    //         provider: <GridProvider>null,
    //         viewModeParams: {
    //             'table': {
    //                 'colsForHide': [],
    //                 'colsForShow': ['_tree', '_settings', '_mediaBasket'],
    //                 'colsForPinned': ['_tree', '_settings', '_mediaBasket', '_icons', 'THUMBURL']
    //             },
    //             'tile': {
    //                 'colsForHide': [],
    //                 'colsForShow': ['THUMBURL', 'TITLE', 'MEDIA_TYPE_text', 'MEDIA_FORMAT_text', 'DURATION_text', '_mediaBasket', '_settings', '_icons'],
    //                 'colsForUnpinned': ['_tree', 'THUMBURL', '_settings', '_mediaBasket', '_icons']
    //             }
    //         },
    //         onSelectedView: new EventEmitter<any>(),
    //         onSelectedCloumnInModal: new EventEmitter<any>(),
    //         showMediaLogger: true,
    //         // popupsSelectors: {
    //         //     'settings': {
    //         //         'popupEl': '.mediaSettingsPopup'
    //         //     }
    //         // }
    //     },
    // };
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

    /**
     * Grid
     */
    @ViewChild('slickGridComp') public slickGridComp: SlickGridComponent;
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                viewMode: 'table',
                tileSource: ['SER_TITLE', 'TITLE', 'VERSION', 'SER_NUM', 'DURATION_text'],
                savedSearchType: 'Media',
                searchType: 'Media',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: true,
                popupsSelectors: {
                    'settings': {
                        'popupEl': '#versionWizardMediaPopup'
                    }
                },
                tileParams: { // from media css
                    tileWidth: 267 + 24,
                    tileHeight: 276 + 24
                },
                selectFirstRow: false,
            },
            plugin: <SlickGridConfigPluginSetups>{
                suppressSelection: true
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

    constructor(protected viewsProvider: VersionWizardMediaViewsProvider,
                protected searchThumbsProvider: SearchThumbsProvider,
                protected appSettings: MediaAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                protected silver: SilverlightProvider,
                protected injector: Injector
    ) {
        super(injector);
    }

    // ngOnInit() {
    //     let mp = this.injector.get(ModalProvider);
    //     mp.modalShow(SearchThumbsComponent, {
    //         size: 'sm',
    //         data: {}
    //     });
    // }
    //
    // show(view: any, options: {}) {
    //     let bp = this.injector.get(BaseProvider);
    //     let el = $('body').append('<div id="uniq"></div>')
    //     bp.buildComponent(view, {}, el)
    // }

}
