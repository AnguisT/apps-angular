import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation, Injector, Inject, ElementRef, ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef,
    Input, Output, EventEmitter
} from '@angular/core';
import * as $ from 'jquery';

import 'style-loader!golden-layout/src/css/default-theme.css';
import 'style-loader!golden-layout/src/css/goldenlayout-base.css';
import 'style-loader!golden-layout/src/css/goldenlayout-light-theme.css';
import 'script-loader!golden-layout/lib/jquery.js';
import 'script-loader!golden-layout/dist/goldenlayout.js';
import {IMFXVideoInfoComponent} from "../../../../modules/search/detail/components/video.info.component/video.info.component";
import {IMFXTimelineComponent} from "../../../../modules/controls/timeline/imfx.timeline";
import {IMFXAccordionComponent} from "../../../../modules/search/detail/components/accordion.component/imfx.accordion.component";
import {IMFXHtmlPlayerComponent} from "../../../../modules/controls/html.player/imfx.html.player";
import {IMFXSilverlightPlayerComponent} from "../../../../modules/controls/silverlight.player/imfx.silverlight.player";
import {IMFXDefaultTabComponent} from "../../../../modules/search/detail/components/default.tab.component/imfx.default.tab.component";

import {IMFXMediaTaggingTabComponent} from "../../../../modules/search/detail/components/media.tagging.tab.component/imfx.media.tagging.tab.component";
import {IMFXLocatorsComponent} from "../../../../modules/controls/locators/imfx.locators.component";

import {GLComponent} from "../../../../modules/search/detail/gl.component";
import {SimpleListComponent} from "../../../../modules/controls/simple.items.list/simple.items.list";
import {TimelineConfig} from "../../../../modules/controls/timeline/timeline.config";
import {TimeCodeFormat, TMDTimecode} from "../../../../utils/tmd.timecode";
import {RCEArraySource} from "../../../clip-editor/rce.component";
import {IMFXSegmentsTabComponent} from "../../../../modules/search/detail/components/segments.tab.component/imfx.segments.tab.component";
import {AssessmentProvider} from "./providers/assessment.provider";
import {LocalStorageService} from "ng2-webstorage";
import {TranslateService} from "ng2-translate";
import {SplashProvider} from "../../../../providers/design/splash.provider";
import {IMFXMediaInfoComponent} from "../../../../modules/search/detail/components/mediainfo.tab.component/imfx.mediainfo.tab.component";
import {CELocatorsComponent} from "../../../clip-editor/comps/locators/ce.locators.component";
import {IMFXSubtitlesGrid} from "../../../../modules/search/detail/components/subtitles.grid.component/subtitles.grid.component";
import {MediaDetailMediaCaptionsResponse} from "../../../../models/media/detail/caption/media.detail.media.captions.response";
import {IMFXMetadataTabComponent} from "../../../../modules/search/detail/components/metadata.tab.component/imfx.metadata.tab.component";
import {IMFXNotesTabComponent} from "../../../../modules/search/detail/components/notes.tab.component/imfx.notes.tab.component";
import {IMFXEventsTabComponent} from "../../../../modules/search/detail/components/events.tab.component/imfx.events.tab.component";
import {LayoutManagerModel, LayoutType, LayoutManagerDefaults} from "../../../../modules/controls/layout.manager/models/layout.manager.model";
import {IMFXAudioTracksTabComponent} from "../../../../modules/search/detail/components/audio.tracks.tab.component/imfx.audio.tracks.tab.component";
import {IMFXAiTabComponent} from "../../../../modules/search/detail/components/ai.tab.component/ai.tab.component";
import {IMFXImageComponent} from "../../../../modules/search/detail/components/image.component/imfx.image.component";
import {IMFXNotAvailableComponent} from "../../../../modules/controls/not.available.comp/imfx.not.available.comp";
import {LayoutManagerService} from "../../../../modules/controls/layout.manager/services/layout.manager.service";
import {Subject} from "rxjs/Subject";

declare var GoldenLayout: any;

@Component({
    selector: 'golden-logger-layout',
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
        IMFXNotesTabComponent,
        IMFXMediaTaggingTabComponent,
        IMFXLocatorsComponent,
        SimpleListComponent,
        IMFXSegmentsTabComponent,
        IMFXAudioTracksTabComponent,
        IMFXMediaInfoComponent,
        CELocatorsComponent,
        IMFXSubtitlesGrid,
        IMFXMetadataTabComponent,
        IMFXEventsTabComponent,
        IMFXAiTabComponent,
        IMFXImageComponent,
        IMFXNotAvailableComponent
    ]
})

export class GLAssessmentComponent extends GLComponent {
    @Input() getValidation: Subject<any>;
    @Output() onGetValidation: EventEmitter<any> = new EventEmitter();
    private layoutModel: LayoutManagerModel;
    private layoutType: LayoutType = LayoutType.Assess;
    private mediaInfoComponents: any = null;
    private eventsComponents: any = null;
    private segmentsComponent: any = null;
    private audiotracksComponent: any = null;
    private notesComponent: any = null;

    private allValidTabs = [
    {
      type: 'component',
      componentName: 'Data',
      tTitle: 'Data',
      title: 'Metadata'
    },
    {
      type: 'component',
      componentName: 'Media',
      tTitle: 'Media',
      title: 'Media'
    },
    {
      type: 'component',
      componentName: 'VideoInfo',
      tTitle: 'VideoInfo',
      title: 'Video Info'
    },
    {
      type: 'component',
      componentName: 'Tagging',
      tTitle: 'Tagging',
      title: 'Tagging'
    },
    {
      type: 'component',
      componentName: 'MediaItems',
      tTitle: 'MediaItems',
      title: 'Media Items'
    },
    {
      type: 'component',
      componentName: 'JobData',
      tTitle: 'JobData',
      title: 'Job Metadata'
    },
    {
      type: 'component',
      componentName: 'Segments',
      tTitle: 'Segments',
      title: 'Segments'
    },
    {
      type: 'component',
      componentName: 'Events',
      tTitle: 'Events',
      title: 'Events'
    },
    {
      type: 'component',
      componentName: 'AudioTracks',
      tTitle: 'AudioTracks',
      title: 'Audio Tracks',
    },
    {
      type: 'component',
      componentName: 'MediaInfo',
      tTitle: 'MediaInfo',
      title: 'MediaInfo'
    },
    {
      type: 'component',
      componentName: 'Timeline',
      tTitle: 'Timeline',
      title: 'Timeline'
    },
    {
      type: 'component',
      componentName: 'Subtitles',
      tTitle: 'Subtitles',
      title: 'Timed Text'
    },
    {
      type: 'component',
      componentName: 'Metadata',
      tTitle: 'Metadata',
      title: 'Custom Metadata',
    },
    {
      type: 'component',
      componentName: 'Notes',
      tTitle: 'Notes',
      title: 'Notes',
    },
    {
      type: 'component',
      componentName: 'AI',
      tTitle: 'AI',
      title: 'AI',
    }
  ]
  constructor(@Inject(ElementRef) protected el: ElementRef,
              @Inject(ViewContainerRef) protected viewContainer: ViewContainerRef,
              @Inject(ComponentFactoryResolver) protected componentFactoryResolver: ComponentFactoryResolver,
              @Inject(LocalStorageService) protected storageService: LocalStorageService,
              @Inject(ChangeDetectorRef) protected cd: ChangeDetectorRef,
              @Inject(TranslateService) protected translate: TranslateService,
              @Inject(SplashProvider) protected splashProvider: SplashProvider,
              public injector: Injector) {
    super(el, viewContainer, componentFactoryResolver, storageService, cd, translate, splashProvider);
  }

  ngOnInit() {
      this.getValidation.subscribe(event => {
          let isValid = true;
          isValid = isValid && this.mediaInfoComponents.compRef.instance.getValidation();
          isValid = isValid && this.eventsComponents.compRef.instance.getValidation();
          isValid = isValid && this.segmentsComponent.compRef.instance.getValidation();
          isValid = isValid && this.audiotracksComponent.compRef.instance.getValidation();
          this.onGetValidation.emit(isValid);
      });
    if (this.config.moduleContext.onSaveAssessment) {
      this.config.moduleContext.onSaveAssessment.subscribe( res => {
          this.config.options.file = this.mediaInfoComponents.compRef.instance.save();
          // save task notes
          this.config.moduleContext.taskFile.TSK_NOTES = this.notesComponent.compRef.instance.save();
          let id = 0;
          this.config.moduleContext.mediaItems.forEach((el, ind) => {
              if (el.ID == this.config.options.file['ID']) {
                  id = ind;
              }
          });
          this.config.moduleContext.mediaItems[id] = this.config.options.file;
          this.config.moduleContext.mediaItems[id]._hasAcceptBnts = !this.getReadOnlyModForTab(this.config.options.file);
      } );
    }
    if (this.config.moduleContext.afterSavedAssessment) {
      this.config.moduleContext.afterSavedAssessment.subscribe( res => {
          this.eventsComponents.compRef.instance.updateDataIds(res.AssessDetails[0].EventsIDs);
          this.segmentsComponent.compRef.instance.updateDataIds(res.AssessDetails[0].SegmentIDs);
          this.audiotracksComponent.compRef.instance.updateDataIds(res.AssessDetails[0].AudioIDs);
      } );
    }
  }

  ngOnLayoutInit(model) {
    this.config.componentContext = this;
    this.storagePrefix = this.config.options.titleForStorage + '.saved.state';
    if(model && model.Layout) {
      this.saveLayoutHandler(model);
      this.layoutConfig = JSON.parse(model.Layout);
      this.updateHeightWidthLayout(this.layoutConfig.content[0], this);
    }
    else {
      let state = this.storageService.retrieve(this.storagePrefix);
      if (state) {
        this.layoutModel = JSON.parse(state);
        if (this.layoutModel && this.layoutModel.Layout) {
          this.layoutConfig = JSON.parse(this.layoutModel.Layout);
          this.updateHeightWidthLayout(this.layoutConfig.content[0], this);
        }
        else {
          this.layoutConfig = JSON.parse(LayoutManagerDefaults.Assess);
        }
      }
      else {
        this.layoutConfig = JSON.parse(LayoutManagerDefaults.Assess);
      }
    }
    this.postOnInit();
  }

  postOnInit() {
    this.setView();
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
  }

  setView() {
    this.layout = new GoldenLayout(this.layoutConfig, $(this.el.nativeElement).find('#layout'));
    let self = this;
    this.addJobDataTab(self);
    this.addMediaDataTab(self);
    this.addMediaLayout(self);
    this.addMediaInfoTab(self);
    this.addEventsTab(self);
    this.addVideoInfo(self);
    this.addMediaTagging(self);
    this.addMediaList(self);
    this.addTimeline(self);
    this.addSegments(self);
    this.addAudioTracks(self);
    this.addSubtitlesTab(self);
    this.addCustomMetadataTab(self);
    this.addNotesTab(self);
    this.addAiTab(self);
    this.setEvents();
    this.layout.off('stateChanged');
    this.layout.on('stateChanged', function () {
      if (self.layout.openPopouts && self.layout.openPopouts.length === 0) {
        var state = JSON.stringify(self.layout.toConfig());
        self.layoutConfig = state;
        if(self.layoutModel)
          self.layoutModel.Layout = self.layoutConfig;
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
    this.layout.init();
    this.createNewTabsAfterInit();
    this.splashProvider.onHideSpinner.emit();
    this.layout.root && this.layout.root.getItemsByFilter(function (el) {
      return el.type == "stack" && el.contentItems.length == 0;
    }).forEach(function (elem) {
      elem.remove();
    });
    this.createDragButtons();
  };
  addJobDataTab(self) {
    this.layout.registerComponent('JobData', (container, componentState) => {
      this.translateTitle(container, '.jobdata');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXAccordionComponent);
      let compRef = this.viewContainer.createComponent(factory);
      compRef.instance.file = self.config.moduleContext.jobFile;
      compRef.instance.groups = self.config.moduleContext.jobGroups;
      compRef.instance.friendlyNames = self.config.moduleContext.jobFriendlyNames;
      container.getElement().append($(compRef.location.nativeElement));
      container["compRef"] = compRef;
      compRef.changeDetectorRef.detectChanges();
    });
  }
  addMediaDataTab(self) {
    this.layout.registerComponent('Data', (container, componentState) => {
      this.translateTitle(container, '.data');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXAccordionComponent);
      let compRef = this.viewContainer.createComponent(factory);
      compRef.instance.file = self.config.moduleContext.mediaItems[0];
      compRef.instance.groups = self.config.options.groups;
      compRef.instance.friendlyNames = self.config.options.friendlyNames;
      container.getElement().append($(compRef.location.nativeElement));
      container["compRef"] = compRef;
      self.mediaDataComponent = container;
      compRef.changeDetectorRef.detectChanges();
    });
  }
  addVideoInfo(self) {
    this.layout.registerComponent('VideoInfo', (container, componentState) => {
      this.translateTitle(container, '.videoInfo');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXVideoInfoComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;
      compRef.instance['config'] = {
        file: self.config.options.file,
        typeDetailsLocal: self.config.options.typeDetailsLocal,
        typeDetails: self.config.options.typeDetails,
        elem: container
      };
      container.on('setPercent', function (data) {
        self.playerComponents && self.playerComponents.emit('setPercent', data);
      });
      container.on('setTimecode', function (tc) {
        self.playerComponents && self.playerComponents.emit('setTimecode', tc);
      });
    });
  }
  addMediaTagging(self) {
    this.layout.registerComponent('Tagging', (container, componentState) => {
      this.translateTitle(container, '.tagging');
      let factory = this.componentFactoryResolver.resolveComponentFactory(CELocatorsComponent);
      let compRef = this.viewContainer.createComponent(factory);
      let assessmentProvider = this.injector.get(AssessmentProvider);
      assessmentProvider.loadTagging(self.config.options.file.ID).subscribe(
        res => {
          self.loggerComponent.compRef.instance.refresh({file: self.config.options.file, series: res});
        }
      );
      container.getElement().append($(compRef.location.nativeElement));
      container["compRef"] = compRef;
      container.on('setMarkers', function (data) {
        self.playerComponents && self.playerComponents.emit('setMarkers', data);
      });
      container.on('clearMarkers', function (data) {
        self.playerComponents && self.playerComponents.emit('clearMarkers', data);
      });
      container.on('disableAllMarkersButtons', function () {
        self.playerComponents && self.playerComponents.emit('disableAllMarkersButtons');
      });
      container.on('addTag', function(data){
        compRef['_component'].addTag(data);
      });
      container.on('onSaveMediaTagging', function(data){
        compRef['_component'].saveMediaTagging(data);
      });
      compRef.instance['config'] = {
        file: self.config.options.file,
        series: self.config.options.series,
        elem: container,
        componentContext: self.config.componentContext,
        commentsColumns: ["InTc", "OutTc", "Notes", "Tags"],
        blackDetectedColumns: ["InTc", "OutTc", "Notes", "Tags"],
        options: {}
      };
      (<any>window).imfxLoggerComponent = self.loggerComponent = container;
      container.on('addClip', function (data) {
        compRef['_component'].addClip(data);
      });
      compRef.changeDetectorRef.detectChanges();
    });
  }

  changeLayoutHandler($event) {
    this.storageService.clear(this.storagePrefix);
    this.layout.off('itemDestroyed');
    this.layout.off('stateChanged');
    this.layout.destroy();
    this.newTabs = [];
    $('.drag-btns-wraper #tabbed-nav li').remove();
    this.layoutModel = $event;
    this.layoutConfig = JSON.parse(this.layoutModel.Layout);
    if(this.layoutModel.IsDefault) {
      this.saveLayoutHandler($event);
    }
    this.setView();
  }

  saveLayoutHandler($event) {
    this.layoutModel = $event;
    this.layoutConfig = JSON.parse(this.layoutModel.Layout);
    this.storageService.store(this.storagePrefix, JSON.stringify(this.layoutModel));
  }

  createNewTabsAfterInit() {
    if (!this.layout.root)
      return;

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
  addMediaList(self) {
    this.layout.registerComponent('MediaItems', (container, componentState) => {
      let compRef;
      this.translateTitle(container, '.media_list');
      let factory = this.componentFactoryResolver.resolveComponentFactory(SimpleListComponent);
      compRef = this.viewContainer.createComponent(factory);
        self.config.moduleContext.mediaItems.forEach( el => {
            el._hasAcceptBnts = !self.getReadOnlyModForTab(el);
        });
      compRef.instance.items = self.config.moduleContext.mediaItems;

      compRef.instance.onSelect.subscribe(data => {
        if (data.file.ID != self.config.options.file.ID) {
          let assessmentProvider = this.injector.get(AssessmentProvider);
          let src = <RCEArraySource> [data.file].map(el => {
            return {
              id: el.ID,
              restricted: el.MEDIA_STATUS == 1,
              src: el.MEDIA_STATUS == 1 && !self.config.moduleContext.config.componentContext.playRestricted ? "" : el.PROXY_URL,
              live: el.IsLive,
              seconds: TMDTimecode.fromString(el.DURATION_text, TimeCodeFormat[el.TimecodeFormat]).toSeconds(),
              som: TMDTimecode.fromString(el.SOM_text, TimeCodeFormat[el.TimecodeFormat]).toSeconds(),
              som_string: el.SOM_text
            };
          })
          let mediaComp = self.layout.root._$getItemsByProperty('componentName', 'Media')[0];
          self.playerComponents.compRef.instance.src = src;
          self.config.options.file = self.mediaInfoComponents.compRef.instance.save();

          self.config.moduleContext.config.options.file = self.config.options.file = data.file;
          self.config.options.params = assessmentProvider.setVideoBlock(data.file);
          self.layout.getComponent('Media').call(self, mediaComp ? mediaComp.container : {});

          assessmentProvider.loadTagging(self.config.options.file.ID).subscribe(
            res => {
              self.loggerComponent.compRef.instance.refresh({file: data.file, series: res});
            }
          );
          assessmentProvider.loadSubtitles(self.config.options.file.ID).subscribe((res: Array<MediaDetailMediaCaptionsResponse>) => {
            self.subtitleComponent.compRef.instance.refresh(res);
          });
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

          self.mediaInfoComponents.compRef.instance.refresh(self.config.options.file, this.getReadOnlyModForTab(self.config.options.file));
          self.eventsComponents.compRef.instance.refreshGrid(self.config.options.file, this.getReadOnlyModForTab(self.config.options.file));
          self.segmentsComponent.compRef.instance.refreshGrid(self.config.options.file, this.getReadOnlyModForTab(self.config.options.file));
          self.audiotracksComponent.compRef.instance.refreshGrid(self.config.options.file, this.getReadOnlyModForTab(self.config.options.file));
          self.mediaDataComponent.compRef.instance.refresh(self.config.options.file, this.getReadOnlyModForTab(self.config.options.file));
          // self.notesComponent.compRef.instance.refresh(self.config.options.file, this.getReadOnlyModForTab(self.config.options.file));
          self.metadataComponent.compRef.instance.refresh(self.config.options.file, this.getReadOnlyModForTab(self.config.options.file));
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
      });

      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;

      compRef.changeDetectorRef.detectChanges();
    });
  }
  addTimeline(self) {
    this.layout.registerComponent('Timeline', (container, componentState) => {
      this.translateTitle(container, '.timeline');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXTimelineComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container["compRef"] = compRef;
      let types = ['Comments', 'Legal', 'Cuts'];
      let file = <any>self.config.options.file;
      let timelineConfig: TimelineConfig = {
        SOM: file.SOM_text,
        startTimecode: file.SOM_text,
        endTimecode: file.EOM_text,
        series: [],
        mediaType: file.MEDIA_TYPE
      };
      for (var e in types) {
        timelineConfig.series.push({
          title: types[e],
          items: self.config.options.series.filter(function (elem) {
            return elem.TagType.toLocaleLowerCase() == types[e].toLocaleLowerCase()
          }).map((el) => {
            return {
              startTimecode: el.InTc,
              endTimecode: el.InTc == el.OutTc ? null : el.OutTc,
              title: el.Notes
            }
          })
        });
      }

      compRef.instance['timecodeFormatString'] = 'Pal';  // TODO: pick up from the file
      compRef.instance['timelineConfig'] = timelineConfig;
      compRef.instance.onSelect.subscribe(tcStr => {
        self.playerComponents && self.playerComponents.emit('setTimecode', tcStr.in);
      });
      compRef.changeDetectorRef.detectChanges();
      if (self.playerComponents) {
        self.playerComponents.on('timecodeChange', tcStr => {
          compRef.instance.setCurrentTimecode(tcStr);
        });
      }

    });
  };
  /**
   * Add media (player) tab
   */
  addMediaLayout(self, file = null) {
    this.layout.registerComponent('Media', (container, componentState) => {
      if (!self.config.options.params.addMedia) {
        return;
      }
      let targetFile = self.config.options.file;
      if (file) {
        targetFile = file;
      }
      let compRef;
      this.translateTitle(container, '.media');
      switch (self.config.options.params.mediaType)
      {
        case 'htmlPlayer': {
          let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXHtmlPlayerComponent);
          compRef = this.viewContainer.createComponent(factory);
          compRef.instance.clipBtns = false; // self.config.moduleContext.config.options.clipBtns;
          compRef.instance.id = self.config.options.file['ID'];
          compRef.instance.isLive = self.config.options.file['IsLive'];
          compRef.instance.src = self.config.options.file['PROXY_URL'];
          compRef.instance.type = self.config.options.file['MEDIA_TYPE'];
          compRef.instance.subtitles = self.config.options.file['Subtitles'];
          compRef.instance.file = self.config.options.file;

          container.on('setMarkers', function (data) {
            if ((<any>window)._popoutWindow) {
              (<any>window)._popoutWindow.imfxPlayer.setMarkers(data);
            }
            compRef._component.setMarkers(data);
          });
          container.on('clearMarkers', function (data) {
            if ((<any>window)._popoutWindow) {
              (<any>window)._popoutWindow.imfxPlayer.clearMarkers(data);
            }
            compRef._component.clearMarkers(data);
          });
          container.on('disableAllMarkersButtons', function () {
            // for popout
            if ((<any>window)._popoutWindow) {
              (<any>window)._popoutWindow.imfxPlayer.disableAllMarkersButtons();
            }
            compRef._component.disableAllMarkersButtons();
          });
          container.on('setPercent', function (percent) {
            if ((<any>window)._popoutWindow) {
              (<any>window)._popoutWindow.imfxPlayer.setPersent(percent);
            }
            compRef._component.setPercent(percent);
          });
          container.on('setTimecode', function (percent) {
            if ((<any>window)._popoutWindow) {
              (<any>window)._popoutWindow.imfxPlayer.setTimecode(percent);
            }
            compRef._component.setTimecode(percent);
          });
          container.on('refresh', function () {
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
          compRef.instance.clipAdded.subscribe(data => {
            self.loggerComponent && self.loggerComponent.emit('addClip', {data: data, replace: false});
            if ((<any>window)._parentImfxWindow) {
              (<any>window)._parentImfxWindow.imfxLoggerComponent.emit('addClip', {data: data, replace: false});
            }
          });
          compRef.instance.clipReplaced.subscribe(data => {
            self.loggerComponent && self.loggerComponent.emit('addClip', {data: data.newClip, replace: true});
            if ((<any>window)._parentImfxWindow) {
              (<any>window)._parentImfxWindow.imfxLoggerComponent.emit('addClip', {data: data.newClip, replace: true});
            }
          });
          compRef.instance['elem'] = container;
          break;
        }
        case 'image': {
          let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXImageComponent);
          compRef = this.viewContainer.createComponent(factory);
          compRef.instance.PROXY_URL = self.config.options.file['PROXY_URL'];
          break;
        }
        default: {
          let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXNotAvailableComponent);
          compRef = this.viewContainer.createComponent(factory);
          break;
        }
      }
      container.on('loadComponentData', function(){
        compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
      });
      container.getElement().children().get(0) && container.getElement().children().get(0).remove();
      container.getElement().append($(compRef.location.nativeElement));
      self.playerComponents = container;
      compRef.instance['elem'] = container;
      container['compRef'] = compRef;
      compRef.changeDetectorRef.detectChanges();
    });
  }
  addSegments(self) {
    this.layout.registerComponent('Segments', (container, componentState) => {
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXSegmentsTabComponent);
      let compRef = this.viewContainer.createComponent(factory);
      let goldenRef = this;
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;
      compRef.instance['config'] = {
        file: self.config.options.file,
        typeDetailsLocal: self.config.options.typeDetailsLocal,
        typeDetails: self.config.options.typeDetails,
        elem: container,
        hideAudioGrid: true,
        context: this
      };
      container.on('loadComponentData', function(){
        compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
      });
      container.on('setMarkers', function (data) {
        self.playerComponents && self.playerComponents.emit('setMarkers', data);
      });
      container.on('addEvent', function () {
        self.playerComponents && self.playerComponents.compRef.instance.markersProvider.clipProvider.getCurrentPointClip().subscribe(res => {
          compRef.instance.addEventToGrid(res);
        });
      });
      container.on('setInOut', function (data) {
        self.playerComponents && self.playerComponents.compRef.instance.markersProvider.clipProvider.getInOutPoint(data).subscribe(res => {
          compRef.instance.addInOut(res);
        });
      });
      self.segmentsComponent = container;
      compRef.changeDetectorRef.detectChanges();
    });
  }
  addAudioTracks(self) {
    this.layout.registerComponent('AudioTracks', (container, componentState) => {
      this.translateTitle(container, '.audiotracks');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXAudioTracksTabComponent);
      let compRef = this.viewContainer.createComponent(factory);
      let goldenRef = this;
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;
      compRef.instance['config'] = {
        file: self.config.options.file,
        typeDetailsLocal: self.config.options.typeDetailsLocal,
        typeDetails: self.config.options.typeDetails,
        elem: container,
        hideSegmentsGrid: true,
        context: this
      };
      compRef.instance['config'].playerComponent = self.playerComponents;
      container.on('loadComponentData', function(){
        compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
      });
      container.on('setMarkers', function (data) {
        self.playerComponents && self.playerComponents.emit('setMarkers', data);
      });
      self.audiotracksComponent = container;
      compRef.changeDetectorRef.detectChanges();
    });
  }
  addMediaInfoTab(self) {
    this.layout.registerComponent('MediaInfo', (container, componentState) => {
      this.translateTitle(container, '.media_info');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXMediaInfoComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;

      compRef.instance['config'] = self.config.options.file;
      compRef.instance['readOnly'] = self.getReadOnlyModForTab(self.config.options.file);
      compRef.changeDetectorRef.detectChanges();
      self.mediaInfoComponents = container;
    });
  }
  addSubtitlesTab(self) {
    this.layout.registerComponent('Subtitles', (container, componentState) => {
      this.translateTitle(container, '.subtitles');
      let assessmentProvider = this.injector.get(AssessmentProvider);
      assessmentProvider.loadSubtitles(self.config.options.file.ID).subscribe((res: Array<MediaDetailMediaCaptionsResponse>) => {
        let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXSubtitlesGrid);
        let compRef = this.viewContainer.createComponent(factory);
        let goldenRef = this;
        container.getElement().append($(compRef.location.nativeElement));
        container['compRef'] = compRef;
        compRef.instance['config'] = {
            file: self.config.options.file,
            elem: container
        };
        compRef.instance['timecodeFormatString'] = self.config.options.file.TimecodeFormat || 'Pal';
        goldenRef.subtitlesGrid = compRef.instance;
        compRef.instance['subtitles'] = res;
        if (self.config.options.file.Subtitles && self.config.options.file.Subtitles.length > 0) {
          compRef.instance['additionalSubs'] = self.config.options.file.Subtitles;
        }
        container.on('setTimecode', function(tc){
          self.playerComponents && self.playerComponents.emit('setTimecode', tc);
        });
        self.playerComponents && self.playerComponents.on('timecodeChange', tcStr => {
          compRef.instance['selectRow'](tcStr);
        });
        self.subtitleComponent = container;
        compRef.changeDetectorRef.detectChanges();
      });
    });
  }
  addCustomMetadataTab(self) {
    this.layout.registerComponent('Metadata', (container, componentState) => {
      this.translateTitle(container, '.metadata');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXMetadataTabComponent);
      let compRef = this.viewContainer.createComponent(factory);
      let goldenRef = this;
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;

      compRef.instance['config'] = {
        file: self.config.options.file,
        typeDetailsLocal: self.config.options.typeDetails.replace('-','_'),
        readOnly: self.getReadOnlyModForTab(self.config.options.file)
      };
      container.on('loadComponentData', function(){
        compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
      });
        self.metadataComponent = container;
      compRef.changeDetectorRef.detectChanges();
    });
  };
  addNotesTab(self) {
    this.layout.registerComponent('Notes', (container, componentState) => {
      this.translateTitle(container, '.notes');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXNotesTabComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;
      compRef.instance['config'] = {
        fileNotes: <any>self.config.moduleContext.taskFile.TSK_NOTES,
        readOnly: this.getReadOnlyModForTab(self.config.options.file)
      };
      self.notesComponent = container;
      compRef.changeDetectorRef.detectChanges();
    });
  }
  addEventsTab(self) {
    this.layout.registerComponent('Events', (container, componentState) => {
      this.translateTitle(container, '.events');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXEventsTabComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;
      compRef.instance['config'] = {
        file: self.config.options.file,
        elem: container,
        readOnly: this.getReadOnlyModForTab(self.config.options.file)
      };
      container.on('loadComponentData', function(){
        compRef['_component'].loadComponentData && compRef['_component'].loadComponentData();
      });
      container.on('setMarkers', function (data) {
        self.playerComponents && self.playerComponents.emit('setMarkers', data);
      });
      container.on('addEvent', function () {
        self.playerComponents && self.playerComponents.compRef.instance.markersProvider.clipProvider.getCurrentPointClip().subscribe(res => {
          compRef.instance.addEventToGrid(res);
        });
      });
      container.on('setInOut', function (data) {
        self.playerComponents && self.playerComponents.compRef.instance.markersProvider.clipProvider.getInOutPoint(data).subscribe(res => {
          compRef.instance.addInOut(res);
        });
      });
      container.on('save', function (data) {
          let assessmentProvider = this.injector.get(AssessmentProvider);
      });
      compRef.changeDetectorRef.detectChanges();
      self.eventsComponents = container;
    });
  }
  addAiTab(self) {
    this.layout.registerComponent('AI', (container, componentState) => {
      this.translateTitle(container, '.ai');
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXAiTabComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container['compRef'] = compRef;
      compRef.instance['config'] = {
        file: self.config.options.file,
        elem: container,
        readOnly: false
      };
      container.on('setTimecode', function (data) {
        self.playerComponents && self.playerComponents.emit('setTimecode', data.InTc);
      });
      compRef.changeDetectorRef.detectChanges();
    });
  }
  translateTitle(container, type) {
    let fullKey = this.config.options.typeDetailsLocal + type;
    this.translate.get(fullKey).subscribe(
      (res: string) => {
        container._config.title = res;
      });
  };
  getReadOnlyModForTab(file) {
      return file.IsGanged && !file.IsGangedMain;
  }
}
