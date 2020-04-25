import {
  Component,
  ComponentFactoryResolver, ComponentFactory, ComponentRef, ViewContainerRef,
  HostListener, ElementRef, Input, ChangeDetectorRef, EventEmitter, Inject
} from '@angular/core';
import * as $ from 'jquery';
import { SplashProvider } from '../../../providers/design/splash.provider';
import { IMFXAccordionComponent } from './components/accordion.component/imfx.accordion.component';
import { IMFXHtmlPlayerComponent } from '../../controls/html.player/imfx.html.player';
import {
    IMFXNotAvailableComponent
} from '../../controls/not.available.comp/imfx.not.available.comp';
import {
    IMFXSilverlightPlayerComponent
} from '../../controls/silverlight.player/imfx.silverlight.player';
import {
    IMFXDefaultTabComponent
} from './components/default.tab.component/imfx.default.tab.component';
import {
    IMFXMetadataTabComponent
} from './components/metadata.tab.component/imfx.metadata.tab.component';
import {
    IMFXHistoryTabComponent
} from './components/history.tab.component/imfx.history.tab.component';
import { IMFXNotesTabComponent } from './components/notes.tab.component/imfx.notes.tab.component';
import { IMFXImageComponent } from './components/image.component/imfx.image.component';
import { IMFXVideoInfoComponent } from './components/video.info.component/video.info.component';
import {
    IMFXMediaTaggingTabComponent
} from './components/media.tagging.tab.component/imfx.media.tagging.tab.component';
import { IMFXMediaTabComponent } from './components/media.tab.component/imfx.media.tab.component';
import {
    IMFXVersionsTabComponent
} from './components/versions.tab.component/imfx.versions.tab.component';
import {
    IMFXReportTabComponent
} from './components/report.tab.component/imfx.report.tab.component';

import { DOCXViewerComponent } from '../../viewers/docx/docx';
import { TIFViewerComponent } from '../../viewers/tif/tif';
import { PDFViewerComponent } from '../../viewers/pdf/pdf';
import { FlashViewerComponent } from '../../viewers/flash/flash';
import { CodePrettiffyViewerComponent } from '../../viewers/codeprettify/codeprettify';
import { DownloadViewerComponent } from '../../viewers/download/download';

import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import 'style-loader!golden-layout/src/css/default-theme.css';
import 'style-loader!golden-layout/src/css/goldenlayout-base.css';
import 'style-loader!golden-layout/src/css/goldenlayout-light-theme.css';
import 'script-loader!golden-layout/lib/jquery.js';
import 'script-loader!./overrides/goldenlayout.js';

import { GoldenConfig } from './detail.config';
import { IMFXSubtitlesGrid } from './components/subtitles.grid.component/subtitles.grid.component';
import {
    SubtitlesPacGrid
} from './components/subtitles.pac.grid.component/subtitles.pac.grid.component';
import { LivePlayerComponent } from '../../controls/live.player/live.player';
import {IMFXAttachmentsComponent} from "./components/attachments.tab.component/imfx.attachments.tab.component";
import {IMFXEventsTabComponent} from "./components/events.tab.component/imfx.events.tab.component";
import {IMFXSegmentsTabComponent} from "./components/segments.tab.component/imfx.segments.tab.component";
import {IMFXAudioTracksTabComponent} from "./components/audio.tracks.tab.component/imfx.audio.tracks.tab.component";
import {IMFXAiTabComponent} from "./components/ai.tab.component/ai.tab.component";
import {IMFTabComponent} from "./components/imf.tab.component/imf.tab.component";
import {SearchSettingsProvider} from "../settings/providers/search.settings.provider";
import {SlickGridProvider} from "../slick-grid/providers/slick.grid.provider";


declare var GoldenLayout: any;

@Component({
    selector: 'golden-layout',
    templateUrl: './tpl/gl-index.html',
    entryComponents: [
        IMFXAccordionComponent,
        IMFXHtmlPlayerComponent,
        IMFXSilverlightPlayerComponent,
        IMFXDefaultTabComponent,
        IMFXMetadataTabComponent,
        IMFXHistoryTabComponent,
        IMFXNotesTabComponent,
        IMFXSegmentsTabComponent,
        IMFXAudioTracksTabComponent,
        IMFXVideoInfoComponent,
        IMFXSubtitlesGrid,
        SubtitlesPacGrid,
        IMFXImageComponent,
        IMFXMediaTaggingTabComponent,
        IMFXMediaTabComponent,
        IMFXNotAvailableComponent,
        IMFXVersionsTabComponent,
        IMFXReportTabComponent,
        IMFXAttachmentsComponent,
        DOCXViewerComponent,
        PDFViewerComponent,
        FlashViewerComponent,
        DownloadViewerComponent,
        CodePrettiffyViewerComponent,
        LivePlayerComponent,
        IMFXEventsTabComponent,
        IMFXAiTabComponent,
        IMFTabComponent
    ],
    providers: [
        SlickGridProvider,
        SearchSettingsProvider
    ]
})
export class GLComponent {
     /*
     * Default config
     * @type {GoldenConfig}
     */
    config = <GoldenConfig>{
        componentContext: <any>null,
        moduleContext: this,
        appSettings: <any>null,
        options: {
            file: Object,
            groups: [],
            friendlyNames: Object,
            typeDetailsLocal: <string>null,
            typeDetails: <string>null,
            tabs: [],
            params: <any>null
        },
    };
    /**
     * Extend default config
     * @param config
     */
    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    @Input('subtitles') private subtitles: Array<any>;
    @Input('pacsubtitles') private pacsubtitles: Array<any>;

    private isEmpty: boolean = true;
    private height: any;
    layoutConfig: any;
    layout: any;
    storagePrefix: string;
    traslateKey: string;
    menuOpened = false;
    newTabs = [];
    tabsType;
    playerComponents: any;
    loggerComponent: any;
    subtitlesGrid;
    subtitlesPacGrid;
    videoInfoComponent;

    changeLayout: EventEmitter<any> = new EventEmitter<any>();

    constructor(@Inject(ElementRef) protected el: ElementRef,
                @Inject(ViewContainerRef) protected viewContainer: ViewContainerRef,
                @Inject(ComponentFactoryResolver) protected componentFactoryResolver: ComponentFactoryResolver,
                @Inject(LocalStorageService) protected storageService: LocalStorageService,
                @Inject(ChangeDetectorRef) protected cd: ChangeDetectorRef,
                @Inject(TranslateService) protected translate: TranslateService,
                @Inject(SplashProvider) protected splashProvider: SplashProvider){
    }

    ngOnInit() {
        this.CommonGoldenInit();
        let self = this;
        this.changeLayout.subscribe((res) => {
            setTimeout(function(){
                self.layout.off('itemDestroyed');
                self.layout.destroy();
                self.CommonGoldenInit();
            }, 0);
        });
        (<any>window).GoldenLayout.__lm.items.Stack.prototype._highlightHeaderDropZone = this._highlightHeaderDropZoneOverride;
        (<any>window).GoldenLayout.__lm.LayoutManager.prototype._$createRootItemAreas = this._$createRootItemAreasOverride;
       //  var _closePopout = (<any>window).GoldenLayout.__lm.controls.BrowserPopout.prototype.close;
       // (<any>window).GoldenLayout.__lm.controls.BrowserPopout.prototype.close = function() {
       //   _closePopout.apply();
       // };

        var _createPopout = (<any>window).GoldenLayout.prototype.createPopout;

        (<any>window).GoldenLayout.prototype.createPopout = function( contentItem ) {
          let d = {
            width: 750,
            height: 450,
            top: 0,
            left: 0
          }
          let arr = Array.prototype.slice.call(arguments);
          (<any>window)._imfxPopoutItem = arguments[0];
          arr.push(d);
          _createPopout.apply( this, arr);
        };
    };
    ngOnDestroy() {
      this.layout.off('stateChanged');
      this.layout.off('itemDestroyed');
      this.layout.destroy();
    };
    ngOnChanges() {
      this.cd.detectChanges();
    }
  /**
   * just add new source into player
   */
    addPlayerData(instance, targetFile, mediaType) {
        switch (mediaType) {
            case 'htmlPlayer': {
              instance.id = targetFile['ID'];
              instance.isLive = targetFile['IsLive']; // LIVE
              instance.src = targetFile['PROXY_URL'];
              instance.type = targetFile['MEDIA_TYPE'];
              instance.subtitles = targetFile['Subtitles'];
              instance.file = targetFile;
              break;
            }
            case 'silverlightPlayer': {
              instance.id = targetFile['ID'];
              instance.src = targetFile['PROXY_URL'];
              break;
            }
            case 'livePlayer': {
              instance.apiSrc = targetFile['PROXY_URL'];
              break;
            }
            default: {
              break;
            }
        }
      }
  /**
   * refresh layout - use for media tab (version) and accos media (media) after select media item
   */
    refreshLayout(outsideUpdate = null) {
      // if media tab already exists
      if (this.findMediaTab()) {
        let instance = this.playerComponents.compRef.instance;
        let mediaType = outsideUpdate.MediaType;
        let targetFile = outsideUpdate.Data || {};
        this.addPlayerData(instance, targetFile, mediaType);
        this.playerComponents && this.playerComponents.emit('refresh');
        return;
      }
      // if we must add media player block
      let oldElement = this.layout.root.getItemsByFilter(function(elem){
                    return elem.config.tTitle == 'vMedia';
                })[0].parent;
      let newElement = this.layout.createContentItem({
        type: 'column',
        content: [
          {
            type: 'stack',
            content: []
          },
          {
            type: 'stack',
            content: []
          }
        ]
      });
      let mediaComp = {
        type: 'component',
        componentName: 'Media',
        tTitle: 'Media'
      };
      // add player block
      newElement.contentItems[0].addChild( mediaComp );
      // add old tabs
      for ( var i = 0; i < oldElement.contentItems.length; i++ ) {
        newElement.contentItems[1].addChild( oldElement.contentItems[ i ] );
      };
      let activeItemIndex = oldElement.config.activeItemIndex;
      newElement.contentItems[1].setActiveContentItem( newElement.contentItems[1].contentItems[activeItemIndex]);
      oldElement.parent.replaceChild( oldElement, newElement );
      this.layout.updateSize();
      let instance = this.playerComponents.compRef.instance;
      let mediaType = outsideUpdate.MediaType;
      let targetFile = outsideUpdate.Data || {};
      this.addPlayerData(instance, targetFile, mediaType);
    }
    resetLayout() {
      this.storageService.clear(this.storagePrefix);
      this.layout.off('itemDestroyed');
      this.layout.off('stateChanged');
      this.layout.destroy();
      this.newTabs = [];
      $('.drag-btns-wraper #tabbed-nav li').remove();
      this.createNewLayout();
      this.setView();
    }

    CommonGoldenInit() {
        this.tabsType = this.config.appSettings.getTabs();
        // TODO: pick from the rest
        this.config.options.params.addMedia && this.config.options.params.mediaType != 'subtitle' && this.config.options.tabs.push({
            title: this.tabsType.VideoInfo,
            Type: this.tabsType.VideoInfo
        });
        // TODO: pick from the rest
        this.config.options.params.addMedia && this.config.options.params.mediaType != 'subtitle' && this.config.options.tabs.push({
            title: this.tabsType.SubtitlesGrid,
            Type: this.tabsType.SubtitlesGrid
        });
        // TODO: pick from the rest
        if (this.config.options.typeDetails.indexOf('media') > -1 || this.config.options.typeDetails.indexOf('version') > -1 ) {
          this.config.options.tabs.push({
            title: this.tabsType.AudioTracks,
            Type: this.tabsType.AudioTracks
          });
          if(this.config.options && this.config.options.file && this.config.options.file['MEDIA_TYPE'] == 100) {
            this.config.options.tabs.push({
              title: this.tabsType.AI,
              Type: this.tabsType.AI
            });
          }
        }
        // TODO: pick from the rest!!!!!!!!!!!!!!!11
        if (this.config.options.typeDetails.indexOf('version') > -1 ) {
          if (this.config.options && this.config.options.file && this.config.options.file['PACKAGE_TYPE'] === 1) {
            this.config.options.tabs.push({
              title: this.tabsType.ImfPackage,
              Type: this.tabsType.ImfPackage
            });
          }
        }

        this.traslateKey = this.config.options.typeDetailsLocal + '.tabs';
        let mediaSubtypes = this.config.appSettings.getMediaSubtypes();
        let mSubtypeStr = ''
        for (var e in mediaSubtypes) {
            if (mediaSubtypes[e] == this.config.options.file['MEDIA_TYPE']) {
                mSubtypeStr = '.' + e;
            }
        }
        this.storagePrefix = this.config.options.typeDetails.replace('-','.') + mSubtypeStr + '.saved.state';
        let state =  this._deepCopy(this.storageService.retrieve(this.storagePrefix));
        if ( state ) {
            this.layoutConfig = JSON.parse( state );
            this.checkAndTranslateTabTitle(this.layoutConfig.content, this);
            this.newTabs = this.addNewTabs(this.layoutConfig.content);
            if( this.newTabs.length ) {
                this.cd.detectChanges();
            }
            this.updateHeightWidthLayout(this.layoutConfig.content[0], this);
        } else {
            this.createNewLayout();
        }
        this.setView();
    };
    // create layout if it was not saved
    createNewLayout() {
        let _tabs = [],
            self = this;
        this.config.options.tabs.forEach(function (tab, ind) {
            if (!tab.hide) {
                let fullKey = self.traslateKey + '.' + tab.title;
                self.translate.get(fullKey).subscribe(
                    (res: string) => {
                        _tabs.push({
                            type: 'component',
                            componentName: 'Tab',
                            title: res,
                            tTitle: tab.title,
                            _isHidden: ind != 0 ? true : false
                        });
                    });
            }
        });
        this.layoutConfig = this._deepCopy(this.config.options.layoutConfig);
        if (this.config.options.typeDetails !== 'title-details' && (this.config.options.params.addMedia || _tabs.length)){
          if(_tabs.length) {
            this.layoutConfig.content[0].content.push({
              type: 'column',
              content: [
                {
                  type: 'component',
                  componentName: 'Media',
                  tTitle: 'Media'
                },
                {
                  type: 'stack',
                  content: _tabs
                }
              ]
            });
          } else {
            this.layoutConfig.content[0].content.push({
              type: 'column',
              content: [
                {
                  type: 'component',
                  componentName: 'Media',
                  tTitle: 'Media'
                }
              ]
            });
          }
        }
        else if (this.config.options.typeDetails == 'title-details' && _tabs.length) {
            this.layoutConfig.content[0].content[1].content.push({
                type: 'stack',
                content: _tabs
            });
        }
    }
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

    setSubtitles (subtitles: Array<any>) {
        this.subtitles = subtitles;
        this.subtitlesGrid.setSubtitles && this.subtitlesGrid.setSubtitles(subtitles, this.config.options.file["Subtitles"]);
        this.cd.detectChanges();
    }
    setPacSubtitles (subtitles: Array<any>) {
      this.pacsubtitles = subtitles;
      this.subtitlesPacGrid && this.subtitlesPacGrid.instance.setPacSubtitles(subtitles);
      this.cd.detectChanges();
    }
  /**
   * Add accordion tab
   */
    addDataLayout(self){
        this.layout.registerComponent('Data', (container, componentState) => {
            let fullKey = this.config.options.typeDetailsLocal + '.data';
            this.translate.get(fullKey).subscribe(
                 (res: string) => {
                     container._config.title = res;
                 });
            let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXAccordionComponent);
            let compRef = this.viewContainer.createComponent(factory);
            compRef.instance.file = self.config.options.file;
            compRef.instance.groups = self.config.options.groups;
            compRef.instance.friendlyNames = self.config.options.friendlyNames;
            container.getElement().append($(compRef.location.nativeElement));
            container['compRef'] = compRef;
            compRef.changeDetectorRef.detectChanges();
        });
    }
  /**
   * Add media (player) tab
   */
    addMediaLayout(self, file = null){
        this.layout.registerComponent('Media', (container, componentState) => {
            if(!self.config.options.params.addMedia){
                return;
            }
            let targetFile = self.config.options.file;
            if(file) {
              targetFile = file.Data;
            }
            let compRef;
            let fullKey = this.config.options.typeDetailsLocal + '.media';
            this.translate.get(fullKey).subscribe(
                 (res: string) => {
                     container._config.title = res;
                 });
            switch (self.config.options.params.mediaType)
                {
                    case 'htmlPlayer': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXHtmlPlayerComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        compRef.instance.id = targetFile['ID'];
                        compRef.instance.isLive = targetFile['IsLive'];//LIVE
                        compRef.instance.src = targetFile['PROXY_URL'];
                        compRef.instance.type = targetFile['MEDIA_TYPE'];
                        compRef.instance.subtitles = targetFile['Subtitles'];
                        compRef.instance.file = targetFile;
                        compRef.instance.typeDetails = self.config.options.typeDetails;
                        compRef.instance.clipBtns = self.config.moduleContext.config.options.clipBtns;
                        compRef.instance.disabledClipBtns = self.config.moduleContext.config.options.disabledClipBtns;
                        container.on('setMarkers', function(data){
                          if ((<any>window)._popoutWindow) {
                            (<any>window)._popoutWindow.imfxPlayer.setMarkers(data);
                          }
                          compRef._component.setMarkers(data);
                        });
                        container.on('clearMarkers', function(data){
                          if ((<any>window)._popoutWindow) {
                            (<any>window)._popoutWindow.imfxPlayer.clearMarkers(data);
                          }
                            compRef._component.clearMarkers(data);
                        });
                        container.on('disableAllMarkersButtons', function(){
                          // for popout
                          if ((<any>window)._popoutWindow) {
                            (<any>window)._popoutWindow.imfxPlayer.disableAllMarkersButtons();
                          }
                          compRef._component.disableAllMarkersButtons();
                        });
                        container.on('setPercent', function(percent){
                          if ((<any>window)._popoutWindow) {
                            (<any>window)._popoutWindow.imfxPlayer.setPersent(percent);
                          }
                            compRef._component.setPercent(percent);
                        });
                        container.on('setTimecode', function(percent){
                          if ((<any>window)._popoutWindow) {
                            (<any>window)._popoutWindow.imfxPlayer.setTimecode(percent);
                          }
                            compRef._component.setTimecode(percent);
                        });
                        container.on('refresh', function(){
                          if ((<any>window)._popoutWindow) {
                            (<any>window)._popoutWindow.imfxPlayer.refresh();
                          }
                            compRef._component.refresh();
                        });
                        compRef.instance.timecodeChange.subscribe(tcStr => {
                            container.emit('timecodeChange', tcStr);
                        });
                        compRef.instance.percentChange.subscribe(tcStr => {
                            container.emit('percentChange', tcStr);
                        });
                        compRef.instance.playerReady.subscribe(() => {
                            container.emit('playerReady');
                        });

                        self.playerComponents = container;
                        compRef.instance.clipAdded.subscribe(data => {
                          self.loggerComponent && self.loggerComponent.emit('addClip', { data: data, replace: false });
                          if ( (<any>window)._parentImfxWindow ) {
                            (<any>window)._parentImfxWindow.imfxLoggerComponent.emit('addClip', { data: data, replace: false });
                          }
                        });
                        compRef.instance.clipReplaced.subscribe(data => {
                          self.loggerComponent && self.loggerComponent.emit('addClip', { data: data.newClip, replace: true });
                          if ( (<any>window)._parentImfxWindow ) {
                            (<any>window)._parentImfxWindow.imfxLoggerComponent.emit('addClip', { data: data.newClip, replace: true });
                          }
                        });
                        compRef.instance['elem'] = container;
                        break;
                    }
                    case 'silverlightPlayer': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXSilverlightPlayerComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        compRef.instance.id = targetFile['ID'];
                        compRef.instance.src = targetFile['PROXY_URL'];
                        break;
                    }
                    case 'image': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXImageComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        compRef.instance.PROXY_URL = targetFile['PROXY_URL'];
                        break;
                    }
                    case 'subtitle': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(SubtitlesPacGrid);
                        compRef = this.viewContainer.createComponent(factory);
                        self.subtitlesPacGrid = compRef;
                        compRef.instance.subtitles = self.config.options.pacsubtitles;
                        break;
                    }
                    case 'docxViewer': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(DOCXViewerComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        compRef.instance['config'] = {
                            url: targetFile['PROXY_URL']
                        };
                        break;
                    }
                    case 'tifViewer': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(TIFViewerComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        compRef.instance['config'] = {
                            url: targetFile['PROXY_URL']
                        };
                        break;
                    }
                    case 'pdfViewer': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(PDFViewerComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        compRef.instance['config'] = {
                            url: targetFile['PROXY_URL'],
                            //renderMode: 'canvas'
                        };
                        break;
                    }
                    case 'xmlViewer': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(CodePrettiffyViewerComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        compRef.instance['config'] = {
                            url: targetFile['PROXY_URL'],
                            // url: './assets/tmp/xml.xml',
                            language: 'xml'
                        };
                        break;
                    }
                    case 'downloadFileViewer': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(DownloadViewerComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        compRef.instance['config'] = {
                            url: targetFile['PROXY_URL']
                        };
                        break;
                    }
                    case 'defaultViewer': {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXNotAvailableComponent);
                        compRef = this.viewContainer.createComponent(factory);
                        break;
                    }
                    case 'livePlayer': {
                      let factory = this.componentFactoryResolver.resolveComponentFactory(LivePlayerComponent);
                      compRef = this.viewContainer.createComponent(factory);
                      compRef.instance.apiSrc = targetFile['PROXY_URL'];
                      break;
                    }
                    case 'flashPlayerViewer': {
                      let factory = this.componentFactoryResolver.resolveComponentFactory(FlashViewerComponent);
                      compRef = this.viewContainer.createComponent(factory);
                      compRef.instance['config'] = {
                        url: targetFile['PROXY_URL']
                      };
                      break;
                    }
                    default: {
                        break;
                    }
                }
            compRef.instance['elem'] = container;
            container.on('loadComponentData', function(){
                compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
            });
            container.getElement().append($(compRef.location.nativeElement));
            container['compRef'] = compRef;
            compRef.changeDetectorRef.detectChanges();
        });
    }

    getReadOnlyModForTab(file) {
        return file.IsGanged && !file.IsGangedMain;
    }

    addTabsLayout(self, outsideData = null) {
        this.layout.registerComponent('Tab', (container, componentState) => {
            let tabComponent = self.selectTabComponent(container._config);
            let factory = this.componentFactoryResolver.resolveComponentFactory(tabComponent);
            let compRef = this.viewContainer.createComponent(factory);
            let goldenRef = this;
            container.getElement().append($(compRef.location.nativeElement));
            container['compRef'] = compRef;
            container.on('setMarkers', function(data){
                self.playerComponents && self.playerComponents.emit('setMarkers', data);
            });
            container.on('setPercent', function(data){
                self.playerComponents && self.playerComponents.emit('setPercent', data);
            });
            container.on('setTimecode', function(tc){
                self.playerComponents && self.playerComponents.emit('setTimecode', tc);
            });
            compRef.instance['config'] = {
                file: self.config.options.file,
                typeDetailsLocal: self.config.options.typeDetailsLocal,
                typeDetails: self.config.options.typeDetails,
                elem: container,
                context: this,
                readOnly: this.getReadOnlyModForTab(self.config.options.file)
            };

            if (container._config.tTitle === this.tabsType.MediaTagging) {
                compRef.instance['config'].columns = ['InTc', 'OutTc', 'Notes', 'Tags'];
                compRef.instance['config'].hasOuterFilter = true;
            }
            if (container._config.tTitle === this.tabsType.Media
                || container._config.tTitle === this.tabsType.AssocMedia) {
                compRef.instance['config'].contextFromDetail = self;
                if (outsideData) {
                  compRef.instance['config'].rowIndex = outsideData.RowIndex;
                }
            }
            if (container._config.tTitle === this.tabsType.EventsActions ||
                container._config.tTitle === this.tabsType.Segments ||
                container._config.tTitle === this.tabsType.AudioTracks ) {
                compRef.instance['config'].readOnly = true;
                compRef.instance['config'].playerComponent = self.playerComponents;
            }
            if (container._config.tTitle === this.tabsType.AssocMedia) {
                compRef.instance['config'].assocMedia = true;
            }
            container.on('loadComponentData', function(){
                compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
            });
            if (container._config.tTitle === this.tabsType.SubtitlesGrid) {
              compRef.instance['timecodeFormatString'] = self.config.options.file.TimecodeFormat || 'Pal';
              goldenRef.subtitlesGrid = compRef.instance;
              compRef.instance['subtitles'] = this.subtitles;
              if (self.config.options.file.Subtitles && self.config.options.file.Subtitles.length > 0) {
                compRef.instance['additionalSubs'] = self.config.options.file.Subtitles;
              }
              self.playerComponents && self.playerComponents.on('timecodeChange',tcStr => {
                compRef.instance['selectRow'](tcStr);
              });
            };


            if (container._config.tTitle === this.tabsType.VideoInfo) {
                goldenRef.videoInfoComponent = compRef.instance;
                self.playerComponents && self.playerComponents.on('timecodeChange', tcStr => {
                    goldenRef.videoInfoComponent.setProgressByTimecode(tcStr);
                });
                self.playerComponents && self.playerComponents.on('percentChange', tcStr => {
                    goldenRef.videoInfoComponent.setProgressByPercent(tcStr);
                });
            };
            if (container._config.tTitle === this.tabsType.AI) {
                compRef.instance['config'] = {
                  file: self.config.options.file,
                  elem: container,
                  readOnly: false
                };
                container.on('setTimecode', function (data) {
                  self.playerComponents && self.playerComponents.emit('setTimecode', data.InTc);
                });
            };
            compRef.changeDetectorRef.detectChanges();
        });
    }

    addVersions(self) {
        this.layout.registerComponent('Versions', (container, componentState) => {
           /* let fullKey = this.config.options.typeDetailsLocal + '.data';
            this.translate.get(fullKey).subscribe(
                 (res: string) => {
                     container._config.title = res;
                 });*/
            let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXVersionsTabComponent);
            let compRef = this.viewContainer.createComponent(factory);
            compRef.instance.config = {
                file: self.config.options.file,
                elem: container
            };
            container.on('loadComponentData', function(){
                compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
            });
            container.getElement().append($(compRef.location.nativeElement));
            container['compRef'] = compRef;
            compRef.changeDetectorRef.detectChanges();
        });
    }

    setView(outsideUpdate = null) {
        this.layout = new GoldenLayout(this.layoutConfig, $(this.el.nativeElement).find('#layout'));
        var self = this;
        this.addDataLayout(self);
        if (outsideUpdate) {
          this.addMediaBlockIfNeed(this.layout);
          this.addMediaLayout(self, outsideUpdate);
        } else {
          this.addMediaLayout(self);
        }
        if(outsideUpdate) {
          this.addTabsLayout(self, outsideUpdate);
        } else {
          this.addTabsLayout(self);
        }
        this.addVersions(self);
        this.setEvents();
        this.layout.init();
        this.splashProvider.onHideSpinner.emit();
        this.checkMediaBlock(this.layout);
        this.createDragButtons();
        setTimeout(() => {
          this.layout.updateSize();
        }, 0);
    }
    setEvents() {
      this.layout.on('componentCreated', (component) => {
        this.isEmpty = false;

          component.container.on('resize',() => {
              let inst = component.container.compRef.instance;
              if(inst.onResize && inst.onResize instanceof EventEmitter){
                  component.container.compRef.instance.onResize.emit({comp: component});
              }
          });
          this.cd.detectChanges();
      });

      this.layout.on( 'stateChanged', (event) => {
        // setTimeout(() => {
        if (window.location.hash.indexOf(this.storagePrefix.split('.')[0]) > -1) {
          if (this.layout.openPopouts.length === 0) {
            var state = this._deepCopy(JSON.stringify(this.layout.toConfig()));
            this.storageService.store(this.storagePrefix, state);
          }
        }
        // }, 0);
      });
      this.layout.on( 'tabCreated', function( tab ){
        tab.closeElement.append( "<button class='icon-button'><i class='icons-close-small icon close'></i></button>" );
      });
      this.layout.on( 'stackCreated', function( stack ){
        stack
          .header
          .controlsContainer
          .find( '.lm_close' ).append( "<button class='icon-button'><i class='icons-closedelete icon delete'></i></button>" );
        stack
          .header
          .controlsContainer
          .find( '.lm_popout' ).append( "<button class='icon-button'><i class='fa fa-external-link'></i></button>" );
        stack
          .header
          .controlsContainer
          .find( '.lm_tabdropdown' ).append( "<i class='icons-more icon'></i>");
        stack
          .header
          .controlsContainer
          .find( '.lm_tabdropdown_list' ).addClass('submenu');
      });

      this.layout.on('initialised', (event) => {
        // let $emptyLayout =
        // let heightFirst = $emptyLayout[0].clientHeight;
        this.height = $(this.el.nativeElement).find('.empty-layout').height() + 'px';
      });
      this.layout.on('itemDestroyed', item => {
        if (item.config && item.config.type == 'component' &&
          (!(item.config.componentName == 'Media') || (item.config.componentName == 'Media' && !(<any>window)._imfxPopoutItem))) {
          let _tab = {
            type: item.config.type,
            componentName: item.config.componentName,
            title: item.config.title,
            tTitle: item.config.tTitle
          };
          // this.newTabs.push(_tab);
          $('.drag-btns-wraper #tabbed-nav').append($('<li> <a id="tab-drag-' + _tab.tTitle + '">' + _tab.title + '</a></li>'));
          // this.cd.detectChanges();
          let elementTab = $('li #tab-drag-' + _tab.tTitle);
          if ( elementTab.length > 0 ) {
            let el = this.layout.createDragSource( elementTab, _tab );
          }
        }
        if (item.container != null) {
          let compRef = item.container['compRef'];
          if (compRef != null) {
            compRef.destroy();

            this.layout.updateSize();
          }
        }
        let $item = this.layout.container.find('.lm_goldenlayout');
        let $child = $item.children();
        if ($child.length === 0) {
          this.isEmpty = true;
          // this.cd.detectChanges();
        };
      });
      this.layout.on('activeContentItemChanged', item => {
        item.container.emit('loadComponentData');
        if (item.componentName == "Media") {
          item.parent.element.find('.lm_popout').show();
        }
        else {
          item.parent.element.find('.lm_popout').hide();
        }
      });
      this.layout.on('windowOpened', function (contentItem ) {
        (<any>window)._popoutWindow = contentItem._popoutWindow;
        let themeName = (<any>window).sessionStorage.getItem('tmd.config.user.preferences.color_schema');
        contentItem._popoutWindow.document.body.className = JSON.parse(themeName);
        contentItem._popoutWindow._parentImfxWindow = window;
        // onClose event
        contentItem.on( 'closed', function() {
          delete (<any>window)._popoutWindow;
          delete (<any>window)._imfxPopoutItem;
        } );
      });
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (this.layout)
            this.layout.updateSize();
    }
    selectTabComponent(tabConfig){
        let tabComp: any = IMFXDefaultTabComponent;
        switch (true) {
            case (tabConfig.tTitle === this.tabsType.Metadata/*||tabConfig.tTitle=='cMetadata'*/):
                tabComp = IMFXMetadataTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.History /*||tabConfig.tTitle=='cHistory'*/):
                tabComp = IMFXHistoryTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.Notes):
                tabComp = IMFXNotesTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.Segments):
                tabComp = IMFXSegmentsTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.AudioTracks):
                tabComp = IMFXAudioTracksTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.VideoInfo):
                if (this.config.options.params.mediaType === 'defaultViewer'){
                    tabComp = IMFXNotAvailableComponent;
                } else {
                    tabComp = IMFXVideoInfoComponent;
                }
                break;
            case (tabConfig.tTitle === this.tabsType.SubtitlesGrid):
                if (this.config.options.params.mediaType === 'defaultViewer'){
                    tabComp = IMFXNotAvailableComponent;
                } else {
                    tabComp = IMFXSubtitlesGrid;
                }
                break;
            case (tabConfig.tTitle === this.tabsType.SubtitlesPacGrid):
              if (this.config.options.params.mediaType === 'defaultViewer'){
                tabComp = IMFXNotAvailableComponent;
              } else {
                tabComp = SubtitlesPacGrid;
              }
              break;
            case (tabConfig.tTitle === this.tabsType.MediaTagging):
                tabComp = IMFXMediaTaggingTabComponent;
                break;
            // when 'media' comes from tabs
            case (tabConfig.tTitle === this.tabsType.Media
                || tabConfig.tTitle === this.tabsType.AssocMedia):
                tabComp = IMFXMediaTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.TasksReports):
                tabComp = IMFXReportTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.Attachments):
                tabComp = IMFXAttachmentsComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.EventsActions):
                tabComp = IMFXEventsTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.AI):
                tabComp = IMFXAiTabComponent;
                break;
            case (tabConfig.tTitle === this.tabsType.ImfPackage):
                tabComp = IMFTabComponent;
                break;
            default:
                break;
        }
        return tabComp;
    }
    /*
    *Check tabs, remove non actual, translate
    */
    checkAndTranslateTabTitle(content, self) {
        let cont = content;
        // find tabs
        content.filter(function(el){
            return el.componentName === 'Tab';
        }).forEach(function(elem, ind){
            // search tab in new tabs
            let buf = self.config.options.tabs.filter(function(e){
                return e.Type === elem.tTitle;
            });
            // if tab exist -> translate
            if (buf.length > 0) {
                let fullKey = self.traslateKey + '.' + elem.tTitle;
                self.translate.get(fullKey).subscribe(
                    (res: string) => {
                        elem.title = res;
                    });
            } // if not -> delete
            else {
               // /**/
               // elem.hide = true
                // elem.remove();
                cont.splice(cont.indexOf(elem), 1);
            }
        });

        // continue search tabs
        let index = content.length - 1;
        while (index >= 0) {
            if (content[index].content && content[index].content.length>0){
                self.checkAndTranslateTabTitle(content[index].content, self);
                if(content[index].content && content[index].content.length == 0){
                    content.splice(index, 1);
                }
            }
            index -= 1;
        }
    }
    /*
    * For adding new tabs
    */
    _func(content, Type, isExistTab, self){
        let existTabs = content.filter(function(elem){
            return elem.tTitle && (elem.tTitle == Type);
        })
        if ( existTabs.length > 0 ) {
            isExistTab = true;
        } else {
            content.forEach(function(el){
                 if (el.content && el.content.length > 0) {
                     isExistTab = self._func(el.content, Type, isExistTab, self);
                 }
            });
        }
        return isExistTab;
    }
    /*
    * Add new tabs
    */
    addNewTabs(content) {
        let newTabs = [];
        let self = this,
            addedStack = false;
        // loop by tabs from REST
        this.config.options.tabs.forEach(function(el){
            // if tabs must be shown
            if (!el.hide) {
                let isExistTab = false;
                // check if exist
                isExistTab = self._func(content, el.Type, isExistTab, self);
                if ( !isExistTab ) {
                    // translate & add
                    let fullKey = self.traslateKey + '.' + el.title;
                    self.translate.get(fullKey).subscribe(
                         (res: string) => {
                             newTabs.push({
                                         type: 'component',
                                         componentName: 'Tab',
                                         title: res,
                                         tTitle: el.Type
                                     });
                         }
                    );
                }
            }
        });

        return newTabs;
    }
    /*
    * Add buttons for dragging tabs
    */
    createDragButtons() {
        let self = this;
        this.newTabs.forEach(function (tab, ind) {
            var elementTab = $('#tab-drag-' + tab.tTitle);
            var el = self.layout.createDragSource( elementTab, tab );
        });
        this.layout.on('itemDropped', el => {
            if (el.config && !!el.config.tTitle) {
                let dragComp = self.layout.root.getItemsByFilter(function(elem){
                    return elem.config.tTitle == el.config.tTitle;
                });
                if (dragComp.length > 0) {
                    $('li #tab-drag-' + el.config.tTitle).parent().remove();
                    self.newTabs.forEach(function(elem, ind, arr){
                        if (elem.tTitle == el.config.tTitle) {
                            arr.splice(ind, 1);
                            return false;
                        }
                    });
                    if (!self.newTabs.length) {
                        self.menuOpened = false;
                        setTimeout(function(){self.layout.updateSize(); }, 0);
                    }
                    self.cd.detectChanges();
                }
            }
            let comps = self.layout.root.getItemsByFilter(function(el){
                return el.componentName == 'Media';
            });
            if (comps.length > 0) {
                self.cd.markForCheck();
                comps[0].container.compRef._component.setResizeEvent && comps[0].container.compRef._component.setResizeEvent();
            }
            if (el.componentName == 'Media') {
                // el.container.compRef._component.refresh();
                setTimeout(function(){self.layout.updateSize(); }, 0);
            }
        });
    };
    findMediaTab() {
      let mediaTab = this.layout.root.getItemsByFilter(function(elem){
        return elem.config.tTitle == 'Media';
      });
      if (mediaTab.length > 0){
        return true;
      };
      return false;
    }
    findChildTab(content, type, returnTabParent) {
      let self = this;
      if (content.tTitle == type) {
        return {find: true, returnTabParent: returnTabParent};
      }
      else {
        if (content.content) {
          for (let i = 0; i < content.content.length; i++ ) {
            let res = self.findChildTab(content.content[i], type, returnTabParent);
            returnTabParent = res.returnTabParent;
            if ( res.find ) {
              returnTabParent = content;
              break;
            };
          };
        }
      }
      return {find: false, returnTabParent: returnTabParent};
    }
    addMediaBlockIfNeed(layout) {
      let tabParent = { find: false, returnTabParent: {}};
      if (this.findMediaTab()) {
        return;
      }
      tabParent = this.findChildTab(layout.config, 'vMedia', tabParent);
      let mediaTab = {type: 'column',
        content: [
          {
            type: 'component',
            componentName: 'Media',
            tTitle: 'Media'
          }
        ]};
      let oldTab = this._deepCopy(tabParent.returnTabParent);
      delete oldTab.height;
      delete oldTab.width;
      tabParent.returnTabParent['type'] = 'column';
      tabParent.returnTabParent['content'] = [mediaTab, oldTab];
      delete tabParent.returnTabParent['activeItemIndex'];
    }
    /*
    * Update, add, or remove Media block (video&img)
    */
    checkMediaBlock(layout) {
        // if no media (video)
        if ( !this.config.options.params.addMedia ) {
            let buf = layout.root.getItemsByFilter(function(el){
                return el.componentName == 'Media';
            });
            if (buf.length > 0) {
                buf[0].remove();
            }
        }
        // if have video -> add
        else if ( this.config.options.params.addMedia ) {
            let buf = layout.root.getItemsByFilter(function(el){
                return el.componentName == 'Media';
            });
            if (buf.length == 0) {
                let mediaTab = {
                   type: 'component',
                   componentName: 'Media',
                    title: 'Media',
                    tTitle: 'Media'
               };
                this.newTabs.push(mediaTab);
            }
        }

        let buf = layout.root.getItemsByFilter(function(el){
            return el.componentName == 'Data';
        });
        if (buf.length == 0) {
            let dataTab = {
                type: 'component',
                componentName: 'Data',
                title: 'Data',
                tTitle: 'Data'
            };
            this.newTabs.push(dataTab);
        }
        this.cd.detectChanges();
    }
    /*
    * Delete nullable width and height
    */
    updateHeightWidthLayout(elem, self) {
        if (!elem)
            return;
        if (elem.activeItemIndex >= 0 && elem.activeItemIndex > elem.content.length - 1) {
            delete elem.activeItemIndex;
        }
        if (elem.activeItemIndex >= 0) {
            elem.content.forEach(function(el, ind){
                delete el._isHidden;
                if (ind !== elem.activeItemIndex) {
                    el._isHidden = true;
                }
            });
        }
        if (!elem.height) {
         //   delete elem.height;
        }
        if (!elem.width) {
          //  delete elem.width;
        }
        if (elem.content && elem.content.length > 0) {
            elem.content.forEach(function(el){
                self.updateHeightWidthLayout(el, self);
            });
        }
    }

    ngAfterViewInit() {
      var self = this;
        setTimeout(function(){
          self.cd.detectChanges();
      }, 0);
    }
    toggleMenu() {
        this.menuOpened = !this.menuOpened;
        let self = this;
        setTimeout(function(){ self.layout.updateSize(); }, 0);
    }


// --------overridden golden method-----------
    _highlightHeaderDropZoneOverride( x ) {
        var _this = (<any>this);
		var i,
			tabElement,
			tabsLength = _this.header.tabs.length,
			isAboveTab = false,
			tabTop,
			tabLeft,
			offset,
			placeHolderLeft,
			headerOffset,
			tabWidth,
			halfX;

		// Empty stack
        if( tabsLength === 0 ) {
			headerOffset = _this.header.element.offset();

			_this.layoutManager.dropTargetIndicator.highlightArea( {
				x1: headerOffset.left,
				x2: headerOffset.left + 100,
				y1: headerOffset.top + _this.header.element.height() - 20,
				y2: headerOffset.top + _this.header.element.height()
			} );

			return;
		}

		for( i = 0; i < tabsLength; i++ ) {
			tabElement = _this.header.tabs[ i ].element;
			offset = tabElement.offset();
			if( _this._sided ) {
				tabLeft = offset.top;
				tabTop = offset.left;
				tabWidth = tabElement.height();
			} else {
				tabLeft = offset.left;
				tabTop = offset.top;
				tabWidth = tabElement.width();
			}

			if( x > tabLeft && x < tabLeft + tabWidth ) {
				isAboveTab = true;
				break;
			}
		}

		if( isAboveTab === false && x < tabLeft ) {
			return;
		}

		halfX = tabLeft + tabWidth / 2;

        if(!tabElement.parent().hasClass('lm_tabdropdown_list')){
            if( x < halfX ) {
                _this._dropIndex = i;
                tabElement.before( _this.layoutManager.tabDropPlaceholder );
            } else {
                _this._dropIndex = Math.min( i + 1, tabsLength );
                tabElement.after( _this.layoutManager.tabDropPlaceholder );
            }
            if( _this._sided ) {
                var placeHolderTop = _this.layoutManager.tabDropPlaceholder.offset().top;
                _this.layoutManager.dropTargetIndicator.highlightArea( {
                    x1: tabTop,
                    x2: tabTop + tabElement.innerHeight(),
                    y1: placeHolderTop,
                    y2: placeHolderTop + _this.layoutManager.tabDropPlaceholder.width()
                } );
                return;
            }
            placeHolderLeft = _this.layoutManager.tabDropPlaceholder.offset().left;

            _this.layoutManager.dropTargetIndicator.highlightArea( {
                x1: placeHolderLeft,
                x2: placeHolderLeft + _this.layoutManager.tabDropPlaceholder.width(),
                y1: tabTop,
                y2: tabTop + tabElement.innerHeight()
            } );
        }
	};
    _$createRootItemAreasOverride = function() {
        var _this = (<any>this);
		var areaSize = 50;
		var sides = { y2: 'y1', x2: 'x1', y1: 'y2', x1: 'x2' };

		for( var side in sides ) {
			var area = _this.root._$getArea();
			area.side = side;
			if( sides [ side ][1] == '2' )
				area[ side ] = area[ sides [ side ] ] - areaSize;
			else
				area[ side ] = area[ sides [ side ] ] + areaSize;
			area.surface = ( area.x2 - area.x1 ) * ( area.y2 - area.y1 );
			_this._itemAreas.push( area );
		}
	};
    _popIn = function(){
      var childConfig,
        parentItem,
        index = this._indexInParent;

      if ( this._parentId ) {
        childConfig = $.extend( true, {}, this.getGlInstance().toConfig() ).content[ 0 ];
        parentItem = this._layoutManager.root.getItemsById( this._parentId )[ 0 ];

        if ( !parentItem ) {
          if ( this._layoutManager.root.contentItems.length > 0 ) {
            parentItem = this._layoutManager.root.contentItems[ 0 ];
          } else {
            parentItem = this._layoutManager.root;
          }
          index = 0;
        }
      }

      if ((<any>window)._imfxPopoutItem) {
        (<any>window)._imfxPopoutItem._$show();
      }

     // parentItem.addChild( childConfig, this._indexInParent );
      this.close();
    };
}
