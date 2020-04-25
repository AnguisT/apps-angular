import {Component, EventEmitter, Injector, Renderer, ViewChild, ViewEncapsulation} from "@angular/core";
// Views
import {ViewsConfig} from "../../../../modules/search/views/views.config";
// Grid
import {GridConfig} from "../../../../modules/search/grid/grid.config";
// Search Modal
import {SearchColumnsProvider} from "../../../../modules/search/columns/providers/search.columns.provider";
import {SearchColumnsService} from "../../../../modules/search/columns/services/search.columns.service";
import {VersionsUploadViewsProvider} from "./providers/views.provider";
import {ModalProvider} from "../../../modal/providers/modal.provider";
import {SearchThumbsProvider} from "../../../search/thumbs/providers/search.thumbs.provider";
import {VersionDetailProvider} from "../../../../views/version/providers/version.detail.provider";
import {VersionAppSettings} from "../../../../views/version/constants/constants";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchFormConfig} from "../../../search/form/search.form.config";
import {AppSettingsInterface} from "../../../common/app.settings/app.settings.interface";
import {
    SearchThumbsConfig,
    SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from "../../../search/thumbs/search.thumbs.config";
import {DetailConfig} from "../../../search/detail/detail.config";
import {VersionInsideUploadSearchFormProvider} from "./providers/search.form.provider";
import {SearchThumbsComponent} from "../../../search/thumbs/search.thumbs";
// search component
import {SlickGridComponent} from "../../../search/slick-grid/slick-grid";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from "../../../search/slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../../search/slick-grid/providers/slick.grid.provider";
import {SlickGridService} from "../../../search/slick-grid/services/slick.grid.service";
import {VersionInsideUploadSlickGridProvider} from "./providers/version.slick.grid.provider";
import {SearchFormProvider} from "../../../search/form/providers/search.form.provider";
import {UploadProvider} from "../../providers/upload.provider";
import {CoreSearchComponent} from "../../../../core/core.search.comp";
import {IMFXModalComponent} from "../../../imfx-modal/imfx-modal";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {IMFXModalEvent} from "../../../imfx-modal/types";
import {SearchSettingsProvider} from "../../../search/settings/providers/search.settings.provider";
import {SearchViewsComponent} from "../../../search/views/views";
import {ViewsProvider} from "../../../search/views/providers/views.provider";
import {VersionViewsProvider} from "../../../../views/version/providers/views.provider";

@Component({
    selector: 'versions-inside-upload',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ViewsProvider,
        {provide: ViewsProvider, useClass: VersionsUploadViewsProvider},
        VersionAppSettings,
        VersionDetailProvider,
        SearchThumbsProvider,
        SearchFormProvider,
        VersionInsideUploadSearchFormProvider,
        SearchSettingsProvider,
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: VersionInsideUploadSlickGridProvider},
        SlickGridService,
        BsModalRef,
        BsModalService,
        SearchSettingsProvider
    ]
})

export class VersionsInsideUploadComponent extends CoreSearchComponent {
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;

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
                }
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
            type: 'VersionGrid',
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
            provider: <VersionInsideUploadSearchFormProvider>null
        }
    };

    /**
     * Thumbs
     * @type {SearchThumbsConfig}
     */
    @ViewChild('searchThumbsComp') searchThumbsComp: SearchThumbsComponent;
    searchThumbsConfig = <SearchThumbsConfig>{
        componentContext: this,
        providerType: SearchThumbsProvider,
        appSettingsType: VersionAppSettings,
        options: new SearchThumbsConfigOptions(<SearchThumbsConfigOptions>{
            module: <SearchThumbsConfigModuleSetups>{
                enabled: false,
            }
        })
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
            friendlyNamesForDetail: 'FriendlyNames.TM_MIS',
            data: {
                detailInfo: <any>null
            },
            onDataUpdated: new EventEmitter<any>(),
            detailsViews: []
        },
    };
    // modal data
    private modalRef: IMFXModalComponent;
    private flagHide = true;
    constructor(protected searchColumnsProvider: ModalProvider,
                protected versionDetailProvider: VersionDetailProvider,
                public searchFormProvider: VersionInsideUploadSearchFormProvider,
                protected appSettings: VersionAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                protected injector: Injector,
                private renderer: Renderer) {
        super(injector);
        this.modalRef = this.injector.get('modalRef');

        // detail provider
        this.detailConfig.options.provider = versionDetailProvider;
        this.detailConfig.options.appSettings = this.appSettings;

        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;
    }

    ngAfterViewInit() {
        this.modalRef.modalEvents.subscribe((e: IMFXModalEvent) => {
            if(e.name == 'ok'){
                this._ok();
            }
        });
        this.modalRef.onShown.subscribe(() => {
            this.searchFormConfig.options.provider
                .config.moduleContext.searchStringEl.nativeElement.focus();
        });
    }

    ok() {
        this._ok();
    }


    private _ok() {
        let sgProvider = this.slickGridComp.provider;
        let data = sgProvider.getSelectedRow();
        if (data) {
            let up = this.injector.get(UploadProvider);
            up.onSelectVersion(data);
            this.modalRef.hide('_autohide');
        }
    }
}
