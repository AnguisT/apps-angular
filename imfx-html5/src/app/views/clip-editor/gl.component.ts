import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewEncapsulation, Input, Output, EventEmitter, Inject, ElementRef, ViewContainerRef, ComponentFactoryResolver,
    Injector
} from '@angular/core';
import * as $ from 'jquery';
import {
  IMFXAccordionComponent
} from '../../modules/search/detail/components/accordion.component/imfx.accordion.component';
import {
  IMFXHtmlPlayerComponent
} from '../../modules/controls/html.player/imfx.html.player';
import {
  IMFXSilverlightPlayerComponent
} from '../../modules/controls/silverlight.player/imfx.silverlight.player';
import {
  IMFXDefaultTabComponent
} from '../../modules/search/detail/components/default.tab.component/imfx.default.tab.component';
import { IMFXTimelineComponent } from '../../modules/controls/timeline/imfx.timeline';
import { TimelineConfig } from '../../modules/controls/timeline/timeline.config';
import { CELocatorsComponent } from './comps/locators/ce.locators.component';

import 'style-loader!golden-layout/src/css/default-theme.css';
import 'style-loader!golden-layout/src/css/goldenlayout-base.css';
import 'style-loader!golden-layout/src/css/goldenlayout-light-theme.css';
import 'script-loader!golden-layout/lib/jquery.js';
import 'script-loader!golden-layout/dist/goldenlayout.js';

import {
  IMFXVideoInfoComponent
} from '../../modules/search/detail/components/video.info.component/video.info.component';

import { GLComponent } from '../../modules/search/detail/gl.component';
import { GoldenConfig } from '../../modules/search/detail//detail.config';
import { SimpleListComponent } from '../../modules/controls/simple.items.list/simple.items.list';
import { RCEArraySource } from './rce.component';
import { TMDTimecode, TimeCodeFormat } from '../../utils/tmd.timecode';
import {NotificationService} from "../../modules/notification/services/notification.service";
import {LocalStorageService} from "ng2-webstorage";
import {TranslateService} from "ng2-translate";
import {ClipItem, ClipsStorageProvider} from "./providers/clips.storage.provider";
import {SplashProvider} from "../../providers/design/splash.provider";
import {SlickGridProvider} from "../../modules/search/slick-grid/providers/slick.grid.provider";
import {LocatorsService} from "../../modules/controls/locators/services/locators.service";

declare var GoldenLayout: any;

@Component({
  selector: 'golden-clip-editor-layout',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './tpl/gl-index.html',
  encapsulation: ViewEncapsulation.None,
  entryComponents: [
    IMFXAccordionComponent,
    IMFXHtmlPlayerComponent,
    IMFXSilverlightPlayerComponent,
    IMFXDefaultTabComponent,
    IMFXVideoInfoComponent,
    IMFXTimelineComponent,
    SimpleListComponent,
    CELocatorsComponent
  ],
    providers: [
    ]
})

export class GLClipEditorComponent extends GLComponent {

  @Input() file;
  @Input() type;

  public timelineComponent;
  public mediaListComponent;
  public detailsComponent;
  // for update 'data' block when it removed from layout
  public detailsComponentFile;
  private allValidTabs = [
    {
      type: 'component',
      componentName: 'Data',
      tTitle: 'Data',
      title: 'Data'
    },
    {
      type: 'component',
      componentName: 'Media',
      tTitle: 'Media',
      title: 'Media'
    },
    {
      type: 'component',
      componentName: 'Timeline',
      tTitle: 'Timeline',
      title: 'Timeline'
    },
    {
      type: 'component',
      componentName: 'MediaItems',
      tTitle: 'MediaItems',
      title: 'MediaItems'
    },
    {
      type: 'component',
      componentName: 'Tagging',
      tTitle: 'Tagging',
      title: 'Tagging'
    }
  ]



  constructor(@Inject(ElementRef) protected el: ElementRef,
              @Inject(ViewContainerRef) protected viewContainer: ViewContainerRef,
              @Inject(ComponentFactoryResolver) protected componentFactoryResolver: ComponentFactoryResolver,
              @Inject(LocalStorageService) protected storageService: LocalStorageService,
              @Inject(ChangeDetectorRef) protected cd: ChangeDetectorRef,
              @Inject(TranslateService) protected translate: TranslateService,
              @Inject(ClipsStorageProvider) protected clipsStorageProvider: ClipsStorageProvider,
              @Inject(SplashProvider) protected splashProvider: SplashProvider,
              private injector: Injector) {
    super(el,
    viewContainer,
    componentFactoryResolver,
    storageService,
    cd,
    translate,
    splashProvider);
  }



  ngOnInit() {
    this.config.componentContext = this;
    let glComp = this.config.componentContext;
    let mainModule = glComp.config.moduleContext;
    this.storagePrefix = 'clip.editor.' + mainModule.config.options.detailsviewType.toLocaleLowerCase() + '.saved.state';
    let state = this.storageService.retrieve(this.storagePrefix);
    if (state) {
      this.layoutConfig = JSON.parse(state);
      this.updateHeightWidthLayout(this.layoutConfig.content[0], this);
    } else {
      this.layoutConfig = this.config.options.layoutConfig;
    }
    this.setView();
    this.changeLayout.subscribe((res) => {
      new Promise((resolve, reject) => { resolve(); })
        .then(
          () => {
            this.layout.off('itemDestroyed');
            this.layout.destroy();
            let glComp = this.config.componentContext;
            let mainModule = glComp.config.moduleContext;
            this.storagePrefix = 'clip.editor.' + mainModule.config.options.detailsviewType.toLocaleLowerCase() + '.saved.state';
            let state = this.storageService.retrieve(this.storagePrefix);
            if (state) {
              this.layoutConfig = JSON.parse(state);
              this.updateHeightWidthLayout(this.layoutConfig.content[0], this);
            } else {
              this.layoutConfig = this.config.options.layoutConfig;
            }
            this.setView();
          },
          (err) => { console.log(err); }
        );
    });
    (<any>window).GoldenLayout.__lm.items.Stack.prototype._highlightHeaderDropZone = this._highlightHeaderDropZoneOverride;
    (<any>window).GoldenLayout.__lm.LayoutManager.prototype._$createRootItemAreas = this._$createRootItemAreasOverride;
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
  setView() {
    this.layout = new GoldenLayout(this.layoutConfig, $(this.el.nativeElement).find('#layout'));
    let self = this;

    this.layout.registerComponent('Data', (container, componentState) => {
      let fullKey = this.config.options.typeDetailsLocal + '.data';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXAccordionComponent);
      let compRef = this.viewContainer.createComponent(factory);
      compRef.instance.file = self.detailsComponentFile || self.config.options.file;
      compRef.instance.groups = self.config.options.groups;
      compRef.instance.friendlyNames = self.config.options.friendlyNames;
      container.getElement().append($(compRef.location.nativeElement));
      self.detailsComponent = container;
      container['compRef'] = compRef;
      compRef.changeDetectorRef.detectChanges();
    });
    this.addMediaLayout(self);
    this.addTimeline(self);
    this.addTagging(self);
    if (this.type && this.type == "MediaDetails") {
      this.addMediaList(self);
    }
    this.setEvents();
    this.layout.off('stateChanged');
    this.layout.on('stateChanged', function () {
      if (self.layout.openPopouts.length === 0) {
        let state = JSON.stringify(self.layout.toConfig());
        self.storageService.store(self.storagePrefix, state);
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
    })
    this.layout.init();
    this.createNewTabsAfterInit();
    this.splashProvider.onHideSpinner.emit();
    this.layout.root.getItemsByFilter(function (el) {
      return el.type === 'stack' && el.contentItems.length === 0;
    }).forEach(function (elem) {
      elem.remove();
    });
    this.createDragButtons();
  };
  addMediaList(self) {
    this.layout.registerComponent('MediaItems', (container, componentState) => {
      let compRef;
      let fullKey = this.config.options.typeDetailsLocal + '.media_list';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
      let factory = this.componentFactoryResolver.resolveComponentFactory(SimpleListComponent);
      compRef = this.viewContainer.createComponent(factory);
      compRef.instance.items = [self.config.moduleContext.config.componentContext.file];

      compRef.instance.onSelect.subscribe(data => {
        if (data.file.ID != self.config.moduleContext.config.componentContext.file.ID) {
          self.config.moduleContext.config.componentContext.file = data.file;
          self.detailsComponent && ( self.detailsComponent.compRef.instance.file = data.file );
          self.detailsComponentFile = data.file;
          self.config.moduleContext.config.componentContext.src = <RCEArraySource> [data.file].map(el => {
            return {
              id: el.ID,
              restricted: el.MEDIA_STATUS == 1,
              src: el.MEDIA_STATUS == 1 && !self.config.moduleContext.config.componentContext.playRestricted ? "" : el.PROXY_URL,
              live: el.IsLive,
              seconds: TMDTimecode.fromString(el.DURATION_text, TimeCodeFormat[el.TimecodeFormat]).toSeconds(),
              som: TMDTimecode.fromString(el.SOM_text, TimeCodeFormat[el.TimecodeFormat]).toSeconds(),
              som_string: el.SOM_text
            }
          })
          self.playerComponents.compRef.instance.src = self.config.moduleContext.config.componentContext.src;
          self.playerComponents.compRef.instance.file = data.file;
          let series = self.config.options.series.filter(el => {
              return el.mediaId == data.file.ID;
          })[0].source;
          self.loggerComponent.compRef.instance.refresh({file: data.file, series: JSON.parse(JSON.stringify(series))});
          self.playerComponents.compRef.instance.refresh();
          if (data.tc) {
            if (self.playerComponents) {
              self.playerComponents.compRef.instance.player.on('loadeddata', () => {
                let nodeOpts = {
                  markers: [
                    {time: data.tc.in},
                    {time: data.tc.out}
                  ]
                };
                self.playerComponents.emit(
                  'setMarkers',
                  {markers: nodeOpts.markers, m_type: 'clip', id: data.tc.id}
                );
                self.playerComponents.emit('setTimecode', (data.tc.in));
                if ((<any>window)._popoutWindow) {
                  (<any>window)._popoutWindow.imfxCEPlayer.emit('setMarkers',
                    {markers: nodeOpts.markers, m_type: 'clip', id: data.tc.id}
                    );
                  (<any>window)._popoutWindow.imfxCEPlayer.emit('setTimecode', (data.tc.in));
                }
              });

            }
          }
        }
      });

      self.mediaListComponent = container;

      compRef.instance['elem'] = container;
      container.on('loadComponentData', function(){
        compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
      });
      container.on('refresh', function(){
        compRef._component.refresh();
      });

      container.on('addItem', function(data){
          compRef._component.addItem(data);
          let locatorsService = self.injector.get(LocatorsService);
          locatorsService.getDetailMediaTagging(data.ID).subscribe((resp) => {
                  self.config.options.series.push({source: resp,
                      mediaId: data.ID });
              },
              (error) => { console.log('error loading tagging!')});
      });

      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;

      compRef.changeDetectorRef.detectChanges();
    });
  }
  addMediaLayout(self) {
    this.layout.registerComponent('Media', (container, componentState) => {
      let compRef;
      let fullKey = this.config.options.typeDetailsLocal + '.player';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXHtmlPlayerComponent);
      compRef = this.viewContainer.createComponent(factory);
      compRef.instance.id = self.config.moduleContext.config.componentContext.file['ID'];
      compRef.instance.isLive = self.config.moduleContext.config.componentContext.srcisAudio;
      compRef.instance.src = self.config.moduleContext.config.componentContext.src;
      compRef.instance.type = self.config.moduleContext.config.componentContext.file['MEDIA_TYPE'];
      compRef.instance.file = self.config.moduleContext.config.componentContext.file;
      compRef.instance.clipBtns = true;
      compRef.instance.clipBtnsCallback = function(btns){
        return btns.filter(el => {
          return el.id !== 'markframe';
        });
      };
      compRef.instance.simpleModeClass = false;

      compRef.instance.clipAdded.subscribe(data => {

        this.clipsStorageProvider.addItem(data);

        let tlc = self.layout.root.getItemsByFilter(function(el){
          return el.componentName == 'Timeline';
        });
        if ( tlc.length === 0 ) {
          self.config.moduleContext.config.componentContext.notificationRef.notifyShow(2, 'rce.no_timline_text');
          return;
        }
        if ( (<any>window)._parentImfxWindow && (<any>window)._parentImfxWindow.imfxTimelineComponent ) {
          (<any>window)._parentImfxWindow.imfxTimelineComponent.emit('clipAdded', data);
        }
        self.timelineComponent && self.timelineComponent.emit('clipAdded', data);
      });
      compRef.instance.clipReplaced.subscribe(data => {
        this.clipsStorageProvider.replaceItem(data);
        let tlc = self.layout.root.getItemsByFilter(function(el){
          return el.componentName == 'Timeline';
        });
        if ( tlc.length === 0 ) {
          self.config.moduleContext.config.componentContext.notificationRef.notifyShow(2, 'rce.no_timline_text');
          return;
        }
        if ( (<any>window)._parentImfxWindow && (<any>window)._parentImfxWindow.imfxTimelineComponent ) {
          (<any>window)._parentImfxWindow.imfxTimelineComponent.emit('clipReplaced', data);
        }
        self.timelineComponent && self.timelineComponent.emit('clipReplaced', data);
      });

      (<any>window).imfxCEPlayer = self.playerComponents = container;

      compRef.instance['elem'] = container;
      container.on('loadComponentData', function(){
        compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
      });
      container.on('setMarkers', function(data){
        compRef._component.setMarkers(data);
      });
      container.on('clearMarkers', function(data){
        compRef._component.clearMarkers(data);
      });
      container.on('setPercent', function(percent){
        compRef._component.setPercent(percent);
      });
      container.on('setTimecode', function(percent){
        compRef._component.setTimecode(percent);
      });
      container.on('refresh', function(){
        compRef._component.refresh();
      });
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;
      compRef.changeDetectorRef.detectChanges();
    });
  }
  addTimeline(self) {
    this.layout.registerComponent('Timeline', (container, componentState) => {
      let fullKey = 'rce.timeline';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXTimelineComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;
        if (self.playerComponents && (self.config.options.file["EOM_text"] == null || self.config.options.file["EOM_text"] == '00:00:00:00')) {
            self.playerComponents.on('playerReady', () => {
                let playerDuration = self.playerComponents.compRef.instance.player.duration();
                compRef.instance.setTimecodeFromPlayer(playerDuration);
            });
        }
        let file = <any>self.config.options.file;
      let timelineConfig: TimelineConfig = {
        SOM: file.SOM_text,
        startTimecode: file.SOM_text,
        endTimecode: file.EOM_text,
        series: [{
          title: '',
          items: []
        }],
        mediaType: file.MEDIA_TYPE,
        template: function (item, element, data) {
          return '<img height="150px;" src="' + item.thumbnail + '">';
        },
      };
      compRef.instance['stickyItemsMode'] = true;  // TODO: pick up from the file
      compRef.instance['timecodeFormatString'] = self.file['TimecodeFormat'];
      compRef.instance['timelineConfig'] = timelineConfig;
      compRef.instance.onItemsUpdate.subscribe((items) => {
        this.clipsStorageProvider.setItems(items.map(el=> {
          return {
            itemID: el.itemID,
            startThumbnail: el.thumbnail,
            startTimecodeString: el.startTimecode,
            stopTimecodeString: el.endTimecode,
          }
        }));
      });
      compRef.instance.onSelect.subscribe((tc: { in: string, out: string, id: string , itemID?: string, thumbnail?: string}) => {
        if(self.mediaListComponent && tc.itemID && tc.itemID != self.config.moduleContext.config.componentContext.file.ID) {
          self.mediaListComponent.compRef.instance.selectItem(tc.itemID, tc);
        }
        else if (self.playerComponents) {
          let nodeOpts = {
            markers: [
              {time: tc.in, thumbnail: tc.thumbnail},
              {time: tc.out, thumbnail: tc.thumbnail}
            ]
          };
          if ((<any>window)._popoutWindow) {
            (<any>window)._popoutWindow.imfxCEPlayer.emit(
              'setMarkers',
              {markers: nodeOpts.markers, m_type: 'clip', id: tc.id}
            );
            (<any>window)._popoutWindow.imfxCEPlayer.emit('setTimecode', (tc.in));
          }
          self.playerComponents.emit(
            'setMarkers',
            {markers: nodeOpts.markers, m_type: 'clip', id: tc.id}
          );
          self.playerComponents.emit('setTimecode', (tc.in));
        }
      });
      container.on('clipAdded', function(data){
        compRef.instance.addItem('', {
          startTimecode: data.startTimecodeString,
          endTimecode: data.stopTimecodeString,
          thumbnail: data.startThumbnail,
          itemID: data.itemID
        });
      });
      container.on('clipReplaced', function(o){
        compRef.instance.replaceItem('', o.oldClipId, {
          startTimecode: o.newClip.startTimecodeString,
          endTimecode: o.newClip.stopTimecodeString,
          thumbnail: o.newClip.startThumbnail,
          itemID: o.newClip.itemID
        });
      });
      compRef.changeDetectorRef.detectChanges();
      if (self.playerComponents) {
        self.playerComponents.on('timecodeChange', tcStr => {
          compRef.instance.setCurrentTimecode(tcStr);
        });
      }
      (<any>window).imfxTimelineComponent = self.timelineComponent = container;

      setTimeout(()=>{
        this.clipsStorageProvider.getItems().forEach((item: ClipItem) => {
          container.emit('clipAdded', item);
        })
      })

    });
  }
  addTagging(self) {
    this.layout.registerComponent('Tagging', (container, componentState) => {
      let fullKey = 'media_details.tabs.mMediaTagging';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
      let factory = this.componentFactoryResolver.resolveComponentFactory(CELocatorsComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container["compRef"] = compRef;
      container.on('setMarkers', function (data) {
        if ((<any>window)._popoutWindow) {
          (<any>window)._popoutWindow.imfxCEPlayer.emit('setMarkers', data);
        }
        self.playerComponents && self.playerComponents.emit('setMarkers', data);
      });
      container.on('clearMarkers', function (data) {
        if ((<any>window)._popoutWindow) {
          (<any>window)._popoutWindow.imfxCEPlayer.emit('clearMarkers', data);
        }
        self.playerComponents && self.playerComponents.emit('clearMarkers', data);
      });
      // container.on('addTag', function(data){
      //   compRef['_component'].addTag(data);
      // });
      // container.on('onSaveMediaTagging', function(data){
      //   compRef['_component'].saveMediaTagging(data);
      // });
      compRef.instance['config'] = {
        file: self.config.options.file,
        series: self.config.options.series[0] && self.config.options.series[0].source,
        elem: container,
        componentContext: self.config.componentContext,
        commentsColumns: [/*"thumbIn", "thumbOut",*/ "InTc", "OutTc", "Notes", "Tags"],
        blackDetectedColumns: ["InTc", "OutTc", "Notes", "Tags"],
        options: {}
      };
      self.loggerComponent = container;
      // container.on('addClip', function (data) {
      //   compRef['_component'].addClip(data);
      // });
//      compRef.changeDetectorRef.detectChanges();
    });
  }
  getTimelineItems() {
    this.playerComponents.compRef.instance.player.pause();
    return this.timelineComponent.compRef.instance.getItems();
  }

  resetLayout() {
    this.storageService.clear(this.storagePrefix);
    this.layout.off('itemDestroyed');
    this.layout.off('stateChanged');
    this.layout.destroy();
    this.newTabs = [];
    $('.drag-btns-wraper #tabbed-nav li').remove();
    this.layoutConfig = this.config.options.layoutConfig;
    this.setView();
  }
  createNewTabsAfterInit() {
    for (var i = 0; i < this.allValidTabs.length; i++) {
      let tab = this.allValidTabs[i];
      let buf = this.layout.root.getItemsByFilter(function(el){
        return el.componentName == tab.tTitle;
      });
      if (buf.length === 0) {
        this.newTabs.push(tab);
      }
    }
    this.cd.detectChanges();
  }

}
