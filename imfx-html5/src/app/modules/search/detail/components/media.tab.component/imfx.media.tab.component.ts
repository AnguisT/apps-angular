import {Component, EventEmitter, Injectable, Injector, Input, ViewChild, ViewEncapsulation} from '@angular/core';
// Views
import {ViewsConfig} from '../../../../../modules/search/views/views.config';
import {DetailMediaTabViewsProvider} from './providers/views.provider';
// Grid
import {MediaGridService} from '../../../../../views/titles/modules/media/services/grid.service';
import {MediaTabGridService} from './services/grid.service';
// Form
import {SearchFormProvider} from '../../../../../modules/search/form/providers/search.form.provider';
// Search Modal
// Modal
// Search Columns
// Info Modal
// Thumbs
import {
    SearchThumbsConfig,
    SearchThumbsConfigModuleSetups,
    SearchThumbsConfigOptions
} from '../../../../../modules/search/thumbs/search.thumbs.config';
import {SearchThumbsProvider} from '../../../../../modules/search/thumbs/providers/search.thumbs.provider';
// constants
import {MediaAppSettings} from '../../../../../views/titles/modules/media/constants/constants';
import {DetailMediaTabGridProvider} from './providers/grid.provider';
import {SearchThumbsComponent} from '../../../thumbs/search.thumbs';
import {CoreSearchComponent} from '../../../../../core/core.search.comp';
import {TranslateService} from 'ng2-translate';
import {SearchSettingsProvider} from "../../../settings/providers/search.settings.provider";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from "../../../slick-grid/slick-grid.config";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {SearchViewsComponent} from "../../../views/views";
import {ViewsProvider} from "../../../views/providers/views.provider";
import {SlickGridButtonFormatterEventData} from "../../../slick-grid/types";

@Component({
    selector: 'imfx-media-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        MediaGridService,
        MediaTabGridService,
        ViewsProvider,
        {provide: ViewsProvider, useClass: DetailMediaTabViewsProvider},
        MediaAppSettings,
        SearchFormProvider,
        SearchThumbsProvider,
        SearchSettingsProvider,
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: DetailMediaTabGridProvider},
        SlickGridService
    ]
})
@Injectable()
export class IMFXMediaTabComponent extends CoreSearchComponent {
    /**
     * Thumbs
     * @type {SearchThumbsConfig}
     */
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

    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                viewMode: 'table',
                searchType: 'Media',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: true,
                popupsSelectors: {
                    'settings': {
                        'popupEl': '.mediaTabCompSettingsPopup'
                    }
                },
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
    private detailContext;
    private assocMedia;

    /**
     * Settings
     * @type {SearchSettingsConfig}
     */
    /*  private searchSettingsConfig = <SearchSettingsConfig>{
     componentContext: this,
     };*/
    private rowIndex;
    @ViewChild('searchGridModule') private searchGridModule;
    private compIsLoaded = false;

    constructor(// protected searchGridProvider: DetailMediaTabGridProvider,
        // protected searchGridService: MediaGridService,
        // protected tabSearchGridService: MediaTabGridService,
        // protected searchThumbsProvider: SearchThumbsProvider,
        protected appSettings: MediaAppSettings,
        protected injector: Injector,
        private translate: TranslateService) {
        super(injector);

    }

    private _config: any;

    get config(): any {
        return this._config;
    }

    @Input('config') set config(_config: any) {
        this._config = _config;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.config.contextFromDetail) {
            this.detailContext = this.config.contextFromDetail;
        }
        if (this.config.assocMedia) {
            this.assocMedia = this.config.assocMedia;
            let service:MediaTabGridService = this.injector.get(MediaTabGridService)
            this.slickGridComp.setService(service);
        } else {
            let service:MediaGridService = this.injector.get(MediaGridService)
            this.slickGridComp.setService(service);
        }
        this.slickGridComp.provider.formatterPlayButtonOnClick.subscribe((d: SlickGridButtonFormatterEventData) => {
            this.setVideoBlock(d.data.data, d.data.rowNumber);
        });
        this.buildGridByRowId();
    }

    /*
     *Table methods
     */
    onSort() {
        console.log('SORTED');
    }

    onReady($event) {
    };

    onBodyScroll($event) {
    };

    onCellFocused($event, context): any {
    }


    checkObjectExistance(obj): boolean {
        if (Object.keys(obj).length) {
            return true;
        }
        return false;
    };

    setVideoBlock(data, index) {
        let mediaSubtypes = this.detailContext.config.appSettings.getMediaSubtypes();
        this.detailContext.config.options.params.mediaType = '';
        this.detailContext.config.options.params.addMedia = false;
        let mType = data['MEDIA_TYPE'];
        // if(data.IsLive) {
        //   this.detailContext.config.options.params.addMedia = true;
        //   this.detailContext.config.options.params.mediaType = 'livePlayer';
        // }
        // else {
        if (this.checkObjectExistance(mediaSubtypes) || data.IsLive) {
            if (typeof(data['PROXY_URL']) === 'string'
                && data['PROXY_URL'].match(/(?:http)|(?:https)/g)) {
                this.detailContext.config.options.params.addMedia = true;
                if (mType === mediaSubtypes.Media || mType === mediaSubtypes.Audio || data.IsLive) {
                    // if(!data['PROXY_URL'].match(/(?:ism)/g)){
                    this.detailContext.config.options.params.mediaType = 'htmlPlayer';
                    // }
                    // else {
                    //   this.detailContext.config.options.params.mediaType = 'silverlightPlayer';
                    // }
                } else if (mType === mediaSubtypes.Subtile) {
                    this.detailContext.config.options.params.mediaType = 'subtitle';
                } else if (mType === mediaSubtypes.Image) {
                    let fileExtension = data['PROXY_URL'].match(/\.[0-9A-Za-z]+$/g);
                    if (fileExtension && fileExtension[0].toLocaleLowerCase() === '.tif') {
                        this.detailContext.config.options.params.mediaType = 'tifViewer';
                    } else {
                        this.detailContext.config.options.params.mediaType = 'image';
                    }
                }
                else if (mediaSubtypes.Doc.filter(el => {
                    return el === mType;
                }).length > 0) {
                    let fileExtension = data['PROXY_URL'].match(/\.[0-9A-Za-z]+$/g);
                    switch (fileExtension[0].toLocaleLowerCase()) {
                        case '.tif': {
                            this.detailContext.config.options.params.mediaType = 'tifViewer';
                            break;
                        }
                        case '.docx': {
                            this.detailContext.config.options.params.mediaType = 'docxViewer';
                            break;
                        }
                        case '.pdf': {
                            this.detailContext.config.options.params.mediaType = 'pdfViewer';
                            break;
                        }
                        case '.xml': {
                            this.detailContext.config.options.params.mediaType = 'xmlViewer';
                            break;
                        }
                        default: {
                            this.detailContext.config.options
                                .params.mediaType = 'downloadFileViewer';
                            break;
                        }
                    }
                }
            }
            else { // if media block must to say 'not available'
                if (mType == mediaSubtypes.Media || mType == mediaSubtypes.Audio || mType == mediaSubtypes.Image || mediaSubtypes.Doc.filter(el => {
                    return el === mType;
                }).length > 0) {
                    this.detailContext.config.options.params.addMedia = true;
                    this.detailContext.config.options.params.mediaType = 'defaultViewer';
                } else if (mType === mediaSubtypes.Subtile) {
                    this.detailContext.config.options.params.addMedia = true;
                    this.detailContext.config.options.params.mediaType = 'subtitle';
                }
            }
        }
        this.detailContext.refreshLayout({
            'Data': data,
            'RowIndex': index,
            'MediaType': this.detailContext.config.options.params.mediaType
        });
    };

    public loadComponentData() {
        if (!this.compIsLoaded) {
            this.buildGridByRowId();
        }
    }


    private buildGridByRowId(id?) {
        if (!id) {
            id = this.config.file.ID
        }
        (<MediaTabGridService | MediaGridService>this.slickGridComp.service).getRowsById(id).subscribe(
            (resp) => {
                this.compIsLoaded = true;

                // If empty resp - build empty page
                if (!resp.Data || resp.Data.length === 0) {
                    this.slickGridComp.provider.clearData(true);
                    return;
                }

                this.slickGridComp.provider.buildPageByData(resp);
                if (this.config.rowIndex !== undefined
                    && this.config.rowIndex != null) {
                    this.slickGridComp.provider.setSelectedRow(this.config.rowIndex)
                }
            }
        );
    }
}
