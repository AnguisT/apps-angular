/**
 * Created by Sergey Klimenko on 10.03.2017.
 */
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ComponentFactoryResolver, EventEmitter,
  Inject, Injector,
  Input,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {DetailProvider, DetailProviderInterface} from "./providers/detail.provider";
import {DetailService, DetailServiceInterface} from "./services/detail.service";
import {DetailConfig} from "./detail.config";

import * as $ from "jquery";

import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";

import {SplashProvider} from "../../../providers/design/splash.provider";
import {GLComponent} from "./gl.component";
import {SilverlightProvider} from "../../../providers/common/silverlight.provider";
import {TranslateService} from "ng2-translate";
import {OverlayComponent} from "../../overlay/overlay";
import {TaxonomyService} from "../taxonomy/services/service";
import {SearchThumbsProvider} from "../thumbs/providers/search.thumbs.provider";
import {DetailThumbProvider} from "./providers/detail.thumb.provider";
import { SlickGridRowData } from '../slick-grid/types';
import { appRouter } from '../../../constants/appRouter';
import { RaiseWorkflowWizzardProvider } from '../../rw.wizard/providers/rw.wizard.provider';
import { ItemTypes } from '../../controls/html.player/item.types';
import { ClipEditorService } from '../../../services/clip.editor/clip.editor.service';
import { BasketService } from '../../../services/basket/basket.service';
import {AudioSynchProvider} from "../../controls/html.player/providers/audio.synch.provider";
import {SearchSettingsProvider} from "../settings/providers/search.settings.provider";
import {IMFXModalProvider} from "../../imfx-modal/proivders/provider";
import {RaiseWorkflowWizzardComponent} from "../../rw.wizard/rw.wizard";
import {IMFXModalComponent} from "../../imfx-modal/imfx-modal";

@Component({
    selector: 'detail-block',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        DetailProvider,
        DetailService,
        GLComponent,
        SilverlightProvider,
        TaxonomyService,
        AudioSynchProvider,
        SearchSettingsProvider,
        DetailThumbProvider
        // SearchThumbsProvider
    ]
})

export class DetailComponent {
    public config = <DetailConfig>{
        componentContext: <any>null,
        options: {
            _accordions: [],
            tabsData: [],
            file: {},
            userFriendlyNames: {},
            mediaParams: {
                addPlayer: false,
                addMedia: false,
                addImage: false,
                showAllProperties: false,
                isSmoothStreaming: false,
                mediaType: ''
            },
            typeDetailsLocal: '',
            timecodeFormatString: 'Pal',
            providerDetailData: <any>null,
            provider: <DetailProviderInterface>null,
            service: <DetailServiceInterface>null,
            data: <any>null,
            detailCtx: this,
            showAccordions: false,
            externalSearchTextForMark: '',
            isOpenDetailPanel: false
        },
        moduleContext: this,
        layoutConfig: {
            dimensions: {
                headerHeight: 36,
                borderWidth: 10,
                dragProxyWidth: 150,
                dragProxyHeight: 0
            },
            settings: {
                hasHeaders: true,
                showPopoutIcon: true,
                showMaximiseIcon: false,
                showCloseIcon: true,
                selectionEnabled: true
            },
            labels: {
                close: 'Close',
                maximise: 'Maximise',
                minimise: 'Minimise',
                popout: 'Open In New Window',
                popin: 'Pop In',
                tabDropdown: 'Additional Tabs'
            },
            content: [{
                type: 'row',
                content: [
                    {
                        type: 'component',
                        componentName: 'Data',
                        tTitle: 'Data',
                        width: 35
                    }
                ]
            }]
        }
    };

    @ViewChild('detailVideo') public detailVideo;
    @ViewChild('subtitlesGrid') public subtitlesGrid; // tab 1
    @ViewChild('subtitlesPacGrid') public subtitlesPacGrid;
    @ViewChild('gl') public golden;
    @ViewChild('detailPage') public detailPage: any;
    @ViewChild('detailWrapper') public detailWrapperEl: any;
    @ViewChild('subTitlesWrapper') public subTitlesWrapperEl: any;
    @ViewChild('subTitlesWrapperTab') public subTitlesWrapperTabEl: any;
    @ViewChild('overlay') public overlay: OverlayComponent;
    @ViewChild('subTitlesOverlay') public subTitlesOverlayEl;
    @ViewChild('subTitlesOverlayTab') public subTitlesOverlayTabEl;
    @ViewChild('mediaTagging') public mediaTaggingEl; // tab 2
    @ViewChild('taggingOverlay') public taggingOverlayEl;
    @ViewChild('taggingOverlayTab') public taggingOverlayTabEl;
    @ViewChild('taggingWrapperTab') public taggingWrapperTabEl;

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
        this.initTimecodeChangeUpdate();
    }

    private loadingSubtitlesMessage: string;
    public activeTab = 0;

    constructor(@Inject(DetailService) protected service: DetailService,
                @Inject(DetailProvider) protected provider: DetailProvider,
                @Inject(SilverlightProvider) protected silver: SilverlightProvider,
                @Inject (BasketService) protected basketService: BasketService,
                @Inject (ComponentFactoryResolver) protected compFactoryResolver: ComponentFactoryResolver,
                @Inject (ApplicationRef) protected appRef: ApplicationRef,
                public cd: ChangeDetectorRef,
                public router: Router,
                public route: ActivatedRoute,
                public splashProvider: SplashProvider,
                public translate: TranslateService,
                public injector: Injector) {
    }

    private text: string = '';
    private error: boolean = false;
    private _accordions: any = [];
    private tabsData = [];
    private file: any = {};
    private userFriendlyNames: Object = {};
    private params = {
        addPlayer: false,
        addMedia: false,
        addImage: false,
        showAllProperties: false,
        isSmoothStreaming: false
    }
    private typeDetailsLocal = '';
    private providerDetailData;

    private subtitles: Array<any>;
    private pacsubtitles: Array<any>;

    private timecodeFormatString: string = 'Pal';
    private timecodeChangeUpdateInited: boolean = false;

    private checkId: any;
    private parametersObservable: any;
    private routerChangeSubscriver: any;

    public issetSubtitles: boolean = true;
    public mediaTaggingConfig = {};

    ngOnInit() {
        if (this.parametersObservable != null) {
            this.parametersObservable.unsubscribe();
        }
        // Set default provider/services if custom is null
        !this.config.options.provider ?
            this.config.options.provider = this.provider :
            this.provider = this.config.options.provider;
        !this.config.options.service ?
            this.config.options.service = this.service :
            this.service = this.config.options.service;
        this.provider.config = this.config;

        this.provider.injector = this.injector;
        let self = this;
        if (this.parametersObservable == null) {
            this.parametersObservable = this.route.params.subscribe(params => {
                if (params['id']) {
                    self.checkId = params['id'];
                }
            });
        }
        if (this.routerChangeSubscriver != null) {
            this.routerChangeSubscriver.unsubscribe();
        }
        this.routerChangeSubscriver = this.router.events.subscribe(event => {
            if (event instanceof RoutesRecognized && event.url.indexOf('/detail/') > -1) {
                var first = event.state.root.firstChild.firstChild;
                var id = first && event.state.root.firstChild.firstChild.params['id'];
                if (id != self.checkId) {
                    self.checkId = id;
                    new Promise((resolve, reject) => {
                        resolve();
                    }).then(
                        () => {
                            self.commonDetailInit(false);
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
                    // setTimeout(function () {
                    //     self.commonDetailInit(false);
                    // }, 0);
                }
            }
        });
        this.commonDetailInit(true);
    };

    ngOnDestroy() {
        if (this.parametersObservable != null) {
            this.parametersObservable.unsubscribe();
        }
        if (this.routerChangeSubscriver != null) {
            this.routerChangeSubscriver.unsubscribe();
        }
    }



    commonDetailInit(firstInit) {
        this.config.options.provider.commonDetailInit(firstInit);
    }

    ngAfterViewInit() {

    }

    initTimecodeChangeUpdate() {
        let compRef = this;
        if (!this.timecodeChangeUpdateInited) {
            if (this.detailVideo) {
                this.detailVideo.timecodeChange.subscribe(tcStr => {
                    this.subtitlesGrid && this.subtitlesGrid.selectRow(tcStr);
                })
                this.timecodeChangeUpdateInited = true;
            }
        }
    }

    _isError(err) {
        if (err.status == 500) {
            // ошибка сервера
            this.text = this.translate.instant('details_item.server_not_work');
        } else if (err.status == 400 || err.status == 404) {
            // элемент не найден
            this.text = this.translate.instant('details_item.media_item_not_found');
        } else if (err.status == 0) {
            // сети нет
            this.text = this.translate.instant('details_item.check_network');
        }
        this.splashProvider.onHideSpinner.emit();
        this.error = true;
        this.cd.markForCheck();
        return true;
    }

    /**
     * Get detail info by id
     * @param r_params route params with ID
     */
    getDetail(r_params) {
        this.file = this.config.options.service.getDetail(r_params.value.id, this.config.options.typeDetails);
        this.cd.detectChanges();
    };

    /**
     * Calling on Back button clicking. Go back to Media page
     */
    clickBack() {
        this.config.options.provider.clickBack();
    }

    showPlayer() {
        return this.config.options.mediaParams.mediaType == 'htmlPlayer' || this.config.options.mediaParams.mediaType == 'silverlightPlayer'
    }

    getDetailId() {
        return this.config.options.provider.getDetailId();
    }

    /*
     * Check file properties
     */
    checkDetailExistance(file) {
        return this.config.options.provider.checkDetailExistance(file);
    }

    /*
     * Check object properties
     */
    checkObjectExistance(obj) {
        return this.config.options.provider.checkObjectExistance(obj);
    }

    onSelectSubtitle(res) {
        if(this.detailVideo){
            this.detailVideo.setTimecode(res);
        }
    };

    onChangeShowAccordions() {
      this.cd.markForCheck();
    }

    isEmptyOverlay(): boolean {
        return this.config.options.provider.isEmptyOverlay();
    }

    getEmptyOverlayText(): string {
        return this.config.options.provider.getEmptyOverlayText();
    }

    toggleOverlayForTagging(show, res) {
      if (this.taggingOverlayEl && this.taggingOverlayTabEl) {
        let overlayEl = $(this.taggingOverlayEl.nativeElement);
        let tabEl = $(this.taggingOverlayTabEl.nativeElement);
        let wrapperTabEl = $(this.taggingWrapperTabEl.nativeElement);
        if(show) {
          wrapperTabEl.show();
          overlayEl.show();
          tabEl.show();
        }
        else {
          if(res && res.length > 0) {
            wrapperTabEl.show();
          }
          else {
            wrapperTabEl.hide();
            if(this.activeTab == 2) {
              setTimeout(()=>{this.activeTab = 0; this.cd.detectChanges();},0);
            }
          }
          overlayEl.hide();
          tabEl.hide();
        }
      }
    }

    showOverlayForSubtitles() {
        if (this.subTitlesOverlayEl && this.subTitlesWrapperEl) {
            let overlayEl = $(this.subTitlesOverlayEl.nativeElement);
            let subTitlesEl = $(this.subTitlesWrapperEl.nativeElement);
            subTitlesEl.css({height: subTitlesEl.attr('data-close-height'), minHeight: subTitlesEl.attr('data-close-height')}).show();
            this.loadingSubtitlesMessage = this.translate.instant('details_item.loading_subtitles');
            overlayEl.show();
            subTitlesEl.show();
          $(this.subTitlesOverlayTabEl.nativeElement).show();
          $(this.subTitlesWrapperTabEl.nativeElement).show();
        }
    }

    hideOverlayForSubtitles(res) {
        if (this.subTitlesOverlayEl && this.subTitlesWrapperEl) {
            let overlayEl = $(this.subTitlesOverlayEl.nativeElement);
            let subTitlesEl = $(this.subTitlesWrapperEl.nativeElement);

            if (res && res.length > 0) {
                subTitlesEl.css({height: '', minHeight: subTitlesEl.attr('data-open-height')}).show();
                $(this.subTitlesWrapperTabEl.nativeElement).show();
                overlayEl.delay(500).hide();
                $(this.subTitlesOverlayTabEl.nativeElement).delay(500).hide();
            } else {
                this.loadingSubtitlesMessage = this.translate.instant('details_item.subtitles_not_found');
                subTitlesEl.hide();
                if(this.activeTab == 1) {
                  setTimeout(()=>{this.activeTab = 0; this.cd.detectChanges();},0);
                }
                $(this.subTitlesWrapperTabEl.nativeElement).hide();
                overlayEl.delay(1000).hide();
                $(this.subTitlesOverlayTabEl.nativeElement).delay(1000).hide();
                this.loadingSubtitlesMessage = this.translate.instant('details_item.loading_subtitles');
            }
        }
    }
    showSearchDetailAccordionBlock() {
        return this.config.options.provider.showSearchDetailAccordionBlock();
    }


  addToBasket($events) {
    let data = this.config.options.file;
    if (!this.isOrdered(data)) {
      this.basketService.addToBasket(data, "Media");
    }
  }

  removeFromBasket($events) {
    let data = this.config.options.file;
    if (this.isOrdered(data)) {
      this.basketService.removeFromBasket([data]);
    }
  }

  // showRaiseWorkflowWizzard($events, rowData) {
  //   let rwp: RaiseWorkflowWizzardProvider = this.injector.get(RaiseWorkflowWizzardProvider);
  //   let data = this.config.options.file;
  //   rwp.open(data, "Media");
  // }

    showRaiseWorkflowWizzard($events, rowData) {
        let modalProvider = this.injector.get(IMFXModalProvider);
        let modal: IMFXModalComponent= modalProvider.show(RaiseWorkflowWizzardComponent, {
            title: 'rwwizard.title',
            size: 'md',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });

        (<RaiseWorkflowWizzardComponent>modal.contentView.instance).rwwizardprovider.open(this.config.options.file, "Media");
    }

  isOrdered(data?: SlickGridRowData): boolean {
    if (!data) {
      data = this.config.options.file;
    }

    return data ? this.basketService.hasItem(data) : false;
  }

  isMediaLoggerShow() {
    return true;
  }

  public refreshGrid(tabId?: number) {
        if(tabId == 1){
            if(!this.subtitlesGrid){
                return;
            }
            this.subtitlesGrid.refreshGrid()
        } else if(tabId == 2){
            if(!this.mediaTaggingEl){
                return;
            }
            this.mediaTaggingEl.refreshGrid();
        } else {
            if(!this.mediaTaggingEl){
                return;
            }
            this.mediaTaggingEl.refreshGrid();
        }
  }

  goToMediaLogger($events) {
    let data = this.config.options.file;
    let silver = this.injector.get(SilverlightProvider);
    if (silver.isSilverlightInstalled) {
      // this.router.navigate(['media-logger-silver', rowData.data.ID]);
      this.router.navigate(
        [
          appRouter.media_logger.silver.substr(
            0,
            appRouter.media_logger.silver.lastIndexOf('/')
          ),
          data.ID
        ]
      );
    } else {
      // this.router.navigate(['media-logger', rowData.data.ID]);
      this.router.navigate(
        [
          appRouter.media_logger.detail.substr(
            0,
            appRouter.media_logger.detail.lastIndexOf('/')
          ),
          data.ID
        ]
      );
    }
  }

  isMediaLoggerEnable() {
    let data = this.config.options.file;
    if (!data) {
      return false;
    }

    let file = data;
    if (typeof(file['PROXY_URL']) == "string" && file['PROXY_URL'].match(/(?:http)|(?:https)/g) && file.IsPlayableVideo) {
      return true;
    } else {
      return false;
    }
  }

  clipEditorEnabled() {
    let data = this.config.options.file;
    if (!data) {
      return false;
    }
    let playable = false;``
    if (data &&
      data["PROXY_URL"] &&
      data["PROXY_URL"].length > 0 &&
      data["PROXY_URL"].match(/^(http|https):\/\//g) &&
      data["PROXY_URL"].match(/^(http|https):\/\//g).length > 0 &&
      (data["MEDIA_TYPE"] == ItemTypes.AUDIO || data["MEDIA_TYPE"] == ItemTypes.MEDIA)) {
      playable = true;
    }
    var uA = window.navigator.userAgent,
      isIE = /msie\s|trident\/|edge\//i.test(uA);
    if (data && data["MEDIA_FORMAT_text"] == "WEBM" && isIE) {
      playable = false;
    }
    return playable;
  }

  clipEditor($events) {
    let data = this.config.options.file;
    let rows: Array<any> = [data];
    let clipEditorService: ClipEditorService = this.injector.get(ClipEditorService);

    // set rows
    clipEditorService.setSelectedRows(rows);

    // set isAudio flag
    let isAudio = data.MEDIA_TYPE == ItemTypes.AUDIO ? true : false;
    clipEditorService.setIsAudio(isAudio);
    let id = data.ID;

    //   this.router.navigate(["clip-editor", id])
    this.router.navigate(
      [
        appRouter.clip_editor_media.substr(
          0,
          appRouter.clip_editor_media.lastIndexOf('/')
        ),
        id
      ]
    );
  }

  requestBrowseCopy() {
    console.log('requestBrowseCopy')
  }
}
