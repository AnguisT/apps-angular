/**
 * Created by Sergey on 10.03.2017.
 */
import {EventEmitter, Injectable, Injector, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {DetailConfig, GoldenConfig} from '../detail.config';
import {ActivatedRoute, Event as RouterEvent, NavigationStart, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Cookie} from 'ng2-cookies';
import {SessionStorageService} from 'ng2-webstorage';
import {MediaDetailResponse} from '../../../../models/media/detail/media.detail.response';
import {MediaDetailDetailsViewResponse} from '../../../../models/media/detail/detailsview/media.detail.detailsview.response';
import {MediaDetailMediaCaptionsResponse} from '../../../../models/media/detail/caption/media.detail.media.captions.response';
import {MediaDetailPacSubtitlesResponse} from '../../../../models/media/detail/pacsubtitles/media.detail.pac.subtitiles.response';
import {SlickGridProvider} from '../../slick-grid/providers/slick.grid.provider';
import {SlickGridEventData} from '../../slick-grid/types';
import {appRouter} from '../../../../constants/appRouter';
import {TranslateService} from "ng2-translate";
import * as Cookies from 'js-cookie';
import {DetailThumbProvider} from "./detail.thumb.provider";
export interface DetailProviderInterface {
    config: DetailConfig;
    moduleContext: any;
    goldenConfig: GoldenConfig;
    translate: TranslateService;
    route;
    location;
    detailVideo;
    accordionsBlock;
    inducingComponent: string;
    router: Router;
    r_params: any;
    tabsData: any;
    file: any;
    _accordions: any;
    userFriendlyNames: any;
    params: any;
    timecodeFormatString: string;
    timecodeChangeUpdateInited: boolean;
    playerReadyInited: boolean;
    lastDetailId: number;
    storage: SessionStorageService;
    detailInfoForUpdate: any;
    onToggle: EventEmitter<boolean>;
    commonDetailInit(firstInit): void;
    update(detailInfo): void;
    initTimecodeChangeUpdate(): void;
    init(router): Observable<Subscription>;
    setDetailColumtnsGroups(columnData, file): any;
    setVideoBlock(): any;
    clickBack(): void;
    getDetailId(): any;
    getColumnsFriendlyNames(): void;
    refreshVideo(): any;
    checkDetailExistance(file): boolean;
    checkObjectExistance(obj): boolean;
    getColumnData(): any;
    getMediaTaggingForSave(): any;
    togglePanel(): void;
    getStateForPanel(): boolean;
    setStateForPanel(state): void;
    showSearchDetailAccordionBlock(): boolean;
    isEmptyOverlay(): boolean;
    getEmptyOverlayText(): string;
    save(): void;
    _deepCopy(obj): any;

    injector: Injector;
}

@Injectable()
export class DetailProvider implements DetailProviderInterface {
    public onToggle: EventEmitter<boolean> = new EventEmitter();
    lastDetailId: number = null;
    config: DetailConfig;
    moduleContext: any;
    goldenConfig = <GoldenConfig>{
        componentContext: <any>null,
        moduleContext: this,
        appSettings: null,
        options: {
            file: null,
            groups: null,
            friendlyNames: null,
            typeDetailsLocal: null,
            typeDetails: null,
            tabs: null,
            params: null,
            layoutConfig: null,
        },
    };
    inducingComponent: string;
    r_params: any;
    tabsData = [];
    file: Object = {};
    _accordions: any = [];
    userFriendlyNames: Object = {};
    params = {
        addPlayer: false,
        addMedia: false,
        addImage: false,
        showAllProperties: false,
        isSmoothStreaming: false,
        addViewer: false,
        mediaType: ''
    };
    timecodeFormatString: string = 'Pal';
    timecodeChangeUpdateInited: boolean = false;
    playerReadyInited: boolean = false;
    detailInfoForUpdate = null;

    @ViewChild('detailVideo') public detailVideo;
    @ViewChild('accordionsBlock') public accordionsBlock;

    constructor(public route: ActivatedRoute,
                public location: Location,
                public storage: SessionStorageService,
                public router: Router,
                public translate: TranslateService,
                public injector: Injector) {
      this.router.events.subscribe((event: RouterEvent) => {
        if (event instanceof NavigationStart) {
          if(event.url.indexOf('detail') > -1 && event.url.indexOf('media') > -1){
            return;
          } else {
            Cookies.remove('forceBackRoute');
          }
        }
      });

    }

    isEmptyOverlay(): boolean {
        return this.detailInfoForUpdate && this.detailInfoForUpdate.ID? false: true;
    }

    getEmptyOverlayText(): string {
        return this.translate.instant('details_item.select_item');
    }

    init(router): Observable<Subscription> {
        let self = this;
        this.r_params = router.params;

        return Observable.create((observer) => {
            if (this.config.options.needApi) {
                this.config.options.service.getDetails(
                    this.getDetailId(),
                    this.config.options.appSettings.getSubtypes(),
                    this.config.options.typeDetails,
                    this.config.options.detailsviewType)
                    .subscribe(
                        (resp: (MediaDetailResponse & MediaDetailDetailsViewResponse)[]) => {
                            self.tabsData = resp[1].TabsData;
                            self.tabsData.forEach(function (el, ind) {
                                el.id = ind;
                                if (ind === 0) {
                                    el.active = true;
                                }
                                el.hide = !self.config.options.appSettings.checkTabExist(el.Type);
                                el.title = el.Type;
                            });
                            self.file = resp[0];
                            Cookie.set('id', self.file['ID'], 1, '/');
                            self.setDetailColumtnsGroups(resp[1].ColumnData, self.file);
                            observer.next({file: self.file, tabs: self.tabsData});
                        },
                        (error) => {
                            self.config.moduleContext._isError(error);
                            console.error('Failed', error);
                        }
                    );
            } else {
                this.config.options.file = this.config.options.data.detailInfo;
                Cookie.set('id', this.config.options.file['ID'], 1, '/');
                this.getColumnData();
                observer.next({file: this.config.options.file, tabs: []});
            }
        });
    }

    commonDetailInit(firstInit) {
        let self = this;
        //this.config.componentContext = this;
        this.config.options.typeDetailsLocal = this.config.options.typeDetailsLocal || this.config.options.typeDetails.replace('-', '_');

        if (!!this.config.options.data.detailInfo || this.config.options.needApi) {
            let di = this.config.options.data.detailInfo;
            this.getColumnsFriendlyNames();
            this.init(this.config.moduleContext.router).subscribe(
                (resp) => {
                    this.config.options.file = resp['file'];
                    this.config.options.subtitles = null;
                    // if (di && di.ID !== this.lastDetailId) {

                    // }
                    let mediaSubtypes = this.config.options.appSettings.getMediaSubtypes();
                    if (this.config.options.file['MEDIA_TYPE'] == mediaSubtypes.Subtile) {
                        this.config.options.service.getPacSubtitles(this.config.options.file.ID)
                            .subscribe((res: Array<MediaDetailPacSubtitlesResponse>) => {
                                this.config.options.pacsubtitles = res;
                                let config = this.config;
                                let moduleContext = this.config.moduleContext;
                                let golden = this.config.moduleContext.golden;
                                golden && golden.setPacSubtitles(this.config.options.pacsubtitles);
                                moduleContext.cd.markForCheck();
                            });
                    }
                    if (this.config.options.file['MEDIA_TYPE'] == mediaSubtypes.Media || this.config.options.file['MEDIA_TYPE'] == mediaSubtypes.Audio) {
                        this.config.options.service.getSubtitles(this.config.options.file.ID)
                            .subscribe((res: Array<MediaDetailMediaCaptionsResponse>) => {
                                this.config.options.subtitles = res;
                                let config = this.config;
                                let moduleContext = this.config.moduleContext;
                                let golden = this.config.moduleContext.golden;
                                (golden && golden.subtitlesGrid) && golden.setSubtitles(
                                    this.config.options.subtitles
                                );
                                moduleContext.cd.markForCheck();
                            });
                    }
                    this.config.options.tabsData = $.extend(
                        true,
                        this.config.options.tabsData,
                        resp['tabs']
                    );
                    // this.getColumnData();
                    this.setVideoBlock();

                    // get thumb url
                    this.config.options.file = this.config.componentContext.detailThumbProvider.buildURL(
                        this.config.options.file,
                        this.config.options.appSettings
                    );
                    this.goldenConfig = $.extend(true, this.moduleContext ? this.moduleContext.goldenConfig : {}, {
                        componentContext: <any>null,
                        moduleContext: this,
                        appSettings: this.config.options.appSettings,
                        options: {
                            file: this.config.options.file,
                            groups: this.config.options._accordions,
                            friendlyNames: this.config.options.userFriendlyNames,
                            typeDetailsLocal: this.config.options.typeDetailsLocal,
                            typeDetails: this.config.options.typeDetails,
                            tabs: this.config.options.tabsData,
                            params: this.config.options.mediaParams,
                            layoutConfig: this.config.layoutConfig
                        },
                    });
                    this.config.moduleContext.cd.markForCheck();
                    if (!firstInit) {
                        this.config.moduleContext.golden && this.config.moduleContext.golden.changeLayout.emit();
                    }

                    this.config.moduleContext.mediaTaggingConfig = {
                      file: this.config.options.file,
                      typeDetailsLocal: this.config.options.typeDetailsLocal,
                      typeDetails: this.config.options.typeDetails,
                      elem: this.config.moduleContext.detailVideo,
                      context: this,
                      hasOuterFilter: true,
                      isSimpleDetail: true,
                      detailContext: this.config.moduleContext
                    };
                    this.config.moduleContext.cd.detectChanges();
                    if (this.config.moduleContext.mediaTaggingEl) {
                      this.config.moduleContext.mediaTaggingEl.selectMediaTagging();
                    }
                },
                (error) => {
                    console.error('Failed', error);
                }
            );
        } else {
        }

        // old grid
        if (!this.config.componentContext.slickGridComp) {
            this.config.options.onDataUpdated.debounceTime(350).subscribe(
                (data) => {
                    this.update(data);
                });
        } else {
            let provider: SlickGridProvider = this.injector.get(SlickGridProvider);
            provider.onDataUpdated.subscribe((data: SlickGridEventData) => {
                this.update(data.row);
            });
        }
        // new grid
        // detailConfig.options.onDataUpdated.emit(node.data);

        // this.getDetail(this.r_params)
    }

    update(detailInfo) {
        this.detailInfoForUpdate = detailInfo;
        if (this.getStateForPanel() === false) {
            return;
        }
        if (detailInfo && detailInfo.ID) {

            // not need for new implementation; it checked in slick grid (onDataUpdated)
            if (this.lastDetailId == detailInfo.ID) {
                return;
            } else {
                this.lastDetailId = detailInfo.ID;
            }
        }
        this.config.moduleContext.toggleOverlayForTagging(true);
        this.config.moduleContext.issetSubtitles = true;
        this.config.moduleContext.cd.detectChanges();
        if (!detailInfo) {
            this.config.options.file = {};
            this.config.moduleContext.cd.detectChanges();
            return;
        }
        setTimeout(() => {
            this.config.moduleContext.showOverlayForSubtitles();
        });
     //   this.config.options.showAccordions = true;
        this.config.options.file = detailInfo;
        Cookie.set('id', this.config.options.file['ID'], 1, '/');
        this.getColumnData();
        this.setVideoBlock();
        // get thumb url
        this.config.options.file = this.injector.get(DetailThumbProvider).buildURL(
            this.config.options.file,
            this.config.options.appSettings
        );
        this.getColumnsFriendlyNames();
        //    this.refreshVideo();
        this.config.options.subtitles = null;
        this.config.options.pacsubtitles = null;
        let mediaSubtypes = this.config.options.appSettings.getMediaSubtypes();
        // if(this.config.moduleContext.subtitlesGrid){
        //     this.config.moduleContext.subtitlesGrid.overlaySubtitlesModuleEl.show();
        // }
        // let getSubtitlesPromise = new Promise((resolve, reject) => {
        this.config.options.service.getSubtitles(this.config.options.file.ID)
            .subscribe((res: Array<MediaDetailMediaCaptionsResponse>) => {
                this.config.options.subtitles = res;
                if (!res || res.length == 0) {
                    this.config.moduleContext.issetSubtitles = false;
                }
                // this.config.moduleContext.cd.markForCheck();
                this.config.moduleContext.cd.detectChanges();
                let compRef = this.config.moduleContext;
                compRef.subtitlesGrid && compRef.subtitlesGrid.textMarkerConfig && compRef.subtitlesGrid.textMarkerConfig.moduleContext.searchKeyUp();

                if (!this.playerReadyInited) {
                    if (compRef.detailVideo) {
                        // compRef.detailVideo.playerReady.subscribe(res => {
                        //     compRef.subtitlesGrid && compRef.subtitlesGrid.textMarkerConfig && compRef.subtitlesGrid.textMarkerConfig.moduleContext.searchKeyUp();
                        // });
                        this.playerReadyInited = true;
                    }
                }
                this.initTimecodeChangeUpdate();
                if (this.config.options.file['MEDIA_TYPE'] !== mediaSubtypes.Subtile) {
                    setTimeout(() => {
                        this.config.moduleContext.hideOverlayForSubtitles(res);
                    });
                }
            });

        if (this.config.options.file['MEDIA_TYPE'] == mediaSubtypes.Subtile) {
            this.config.options.service.getPacSubtitles(this.config.options.file.ID)
                .subscribe((res: Array<MediaDetailPacSubtitlesResponse>) => {
                    this.config.options.pacsubtitles = res;
                    this.config.moduleContext.cd.markForCheck();
                    setTimeout(() => {
                        this.config.moduleContext.hideOverlayForSubtitles(res);
                    });
                });
        }
        this.config.moduleContext.mediaTaggingConfig = {
          file: this.config.options.file,
          typeDetailsLocal: this.config.options.typeDetailsLocal,
          typeDetails: this.config.options.typeDetails,
          elem: this.config.moduleContext.detailVideo,
          context: this,
          isSimpleDetail: true,
          detailContext: this.config.moduleContext
        };
        this.config.moduleContext.cd.detectChanges();
        if(this.config.moduleContext.mediaTaggingEl) {
          this.config.moduleContext.mediaTaggingEl.selectMediaTagging();
        }
    };

    initTimecodeChangeUpdate() {
        let providerRef = this;
        let compRef = this.config.moduleContext;
        if (!this.timecodeChangeUpdateInited) {
            if (compRef.detailVideo) {
                compRef.detailVideo.timecodeChange.subscribe(tcStr => {
                    compRef.subtitlesGrid && compRef.subtitlesGrid.selectRow(tcStr);
                });
                this.timecodeChangeUpdateInited = true;
            }
        }
    }

    /*
     *Set detail columns groups
     *@param columnData - object with data about cols groups
     */
    setDetailColumtnsGroups(columnData, file) {
        this.config.moduleContext.cd.reattach();
        let groups = [];
        this._accordions = [];
        for (let e in columnData) {
            let gr = groups.filter(function (el) {
                return el == columnData[e].GroupName;
            });
            if (!gr.length) {
                groups.push(columnData[e].GroupName);
                this._accordions.push({
                    'name': columnData[e].GroupName,
                    'props': [columnData[e].Tag]
                });
            }
            else {
                this._accordions.filter(function (el) {
                    return el.name == columnData[e].GroupName;
                })[0].props.push(columnData[e].Tag);
            }
        }
        /*  if(!this.checkObjectExistance(columnData)){
         this._accordions.push({
         'name': '',
         'props': []
         });
         for (var e in file){
         if(e !== '$id'){
         this._accordions[0].props.push(e);
         }
         }
         }*/
        this.config.options._accordions = this._accordions;
        this.config.moduleContext.cd.detectChanges();
    }

    /*
     *Set video block visible
     *
     */
    setVideoBlock(file?: any) {
        if (!file) {
          file = this.config.options.file;
        }
        let mediaSubtypes = this.config.options.appSettings.getMediaSubtypes();
        this.config.options.mediaParams.mediaType = '';
        this.config.options.mediaParams.addMedia = false;
        let mType = file['MEDIA_TYPE'];
        if (this.checkObjectExistance(mediaSubtypes) || (file.IsLive ? true : false)) {
            if ((typeof(file['PROXY_URL']) == 'string' && file['PROXY_URL'].match(/(?:http)|(?:https)/g)) || (file.IsLive ? true : false)) {
                this.config.options.mediaParams.addMedia = true;
                if (mType == mediaSubtypes.Media || mType == mediaSubtypes.Audio || (file.IsLive ? true : false)) {
                    this.config.options.mediaParams.mediaType = 'htmlPlayer';
                }
                else if (mType == mediaSubtypes.Image) {
                    let fileExtension = file['PROXY_URL'].match(/\.[0-9A-Za-z]+$/g);
                    if (fileExtension && fileExtension[0].toLocaleLowerCase() == '.tif') {
                        this.config.options.mediaParams.mediaType = 'tifViewer';
                    }
                    else {
                        this.config.options.mediaParams.mediaType = 'image';
                    }
                }
                else if (mediaSubtypes.Doc.filter(el => { return el === mType; }).length > 0) {
                    let fileExtension = file['PROXY_URL'].match(/\.[0-9A-Za-z]+$/g);
                    switch (fileExtension[0].toLocaleLowerCase()) {
                        case '.tif': {
                            this.config.options.mediaParams.mediaType = 'tifViewer';
                            break;
                        }
                        case '.docx': {
                            this.config.options.mediaParams.mediaType = 'docxViewer';
                            break;
                        }
                        case '.pdf': {
                            this.config.options.mediaParams.mediaType = 'pdfViewer';
                            break;
                        }
                        case '.xml': {
                            this.config.options.mediaParams.mediaType = 'xmlViewer';
                            break;
                        }
                        case '.swf': {
                            this.config.options.mediaParams.mediaType = 'flashPlayerViewer';
                            break;
                        }
                        default: {
                            this.config.options.mediaParams.mediaType = 'downloadFileViewer';
                            break;
                        }
                    }
                }
            }
            else { // if media block must to say 'not available'
                if (mType == mediaSubtypes.Media || mType == mediaSubtypes.Audio || mType == mediaSubtypes.Image || mediaSubtypes.Doc.filter(el => { return el === mType; }).length > 0) {
                    this.config.options.mediaParams.addMedia = true;
                    this.config.options.mediaParams.mediaType = 'defaultViewer';
                }
                else if (mType == mediaSubtypes.Subtile) {
                    this.config.options.mediaParams.addMedia = true;
                    this.config.options.mediaParams.mediaType = 'subtitle';
                }
            }
            return this.config.options.mediaParams;
        }
    };

    /**
     * Calling on Back button clicking. Go back to Media page
     */
    clickBack() {

      // check existing parent route where to go back

      let isForce = Cookies.get('forceBackRoute');

      if (!isForce && (this.inducingComponent && (typeof(appRouter[this.inducingComponent].search) === 'string'))) {
        let backUrl: string = appRouter[this.inducingComponent].search;
        this.router.navigateByUrl(backUrl);
      }else{
        if(isForce){
          Cookies.remove('forceBackRoute');
        }
        this.location.back();
      }

    };

    getDetailId(): any {
        return this.route.params['_value'].id;
    };

    /**
     * Refresh video player
     */
    refreshVideo() {
        return this.detailVideo && this.detailVideo.refresh(this.config.options.file['PROXY_URL']);
    };

    /**
     * Get friendly names from storage (if not -> load&save)
     */
    getColumnsFriendlyNames() {
        this.config.options.service.getLookups(this.config.options.friendlyNamesForDetail).subscribe(
            (resp) => {
                this.config.options.userFriendlyNames = resp;
                this.config.moduleContext.cd.markForCheck();
            }
        );
    };

    /*
     * Check file properties
     */
    checkDetailExistance(file): boolean {
        if (file['ID'] != undefined) {
            return true;
        }
        return false;
    };

    /*
     * Check object properties
     */
    checkObjectExistance(obj): boolean {
        if (Object.keys(obj).length) {
            return true;
        }
        return false;
    };

    /*
     * Load detail view from REST or from session
     */
    getColumnData(): any {
        if (this.config.options.detailsviewType) {
            let self = this;
            let view_id = this.config.options.appSettings.getSubtype(this.config.options.file['MEDIA_TYPE']) || 0;
            if (!this.config.options.detailsViews[view_id]) {
                this.config.options.service.getDetailsView(view_id, this.config.options.detailsviewType).subscribe(
                    (resp: MediaDetailDetailsViewResponse) => {
                        self.setDetailColumtnsGroups(resp.ColumnData, this.config.options.file);
                    });
            }
            else {
                let resp = this.config.options.detailsViews[view_id];
                this.setDetailColumtnsGroups(resp.ColumnData, this.config.options.file);
            }
        }
    };

    getMediaTaggingForSave(): any {
    };

    togglePanel(): void {
        this.setStateForPanel(!this.getStateForPanel());
    }

    getStateForPanel(): boolean {
        if (!this.config) {
            return false;
        }
        // let valFromStorage = this.storage.retrieve('tmd.detailbutton.state.' + this.config.moduleContext.config.options.typeDetails);
        // valFromStorage == 'false' ? valFromStorage = false : valFromStorage = true;
        // this.config.moduleContext.config.options.isOpenDetailPanel = valFromStorage;

        return this.config.moduleContext.config.options.isOpenDetailPanel;
    }

    setStateForPanel(state: boolean): void {
        if (!this.config) {
            return;
        }
        this.config.moduleContext.config.options.isOpenDetailPanel = state;
        if (state == true) {
            this.update(this.detailInfoForUpdate);
        }
        this.onToggle.emit(state)
        // this.storage.store('tmd.detailbutton.state.' + this.config.moduleContext.config.options.typeDetails, state.toString());
    }

    showSearchDetailAccordionBlock(): boolean {
      if ((this.config.options.subtitles && this.config.options.subtitles.length) || (this.config.options.pacsubtitles && this.config.options.pacsubtitles.length) ){
        return this.config.options.showAccordions;
      }
      else return true;
    }
    save(){}
    // deep copy object
    _deepCopy(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this._deepCopy(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this._deepCopy(obj[attr]);
            }
            return copy;
        }

        throw new Error('Unable to copy obj! Its type is not supported.');
    }
}
