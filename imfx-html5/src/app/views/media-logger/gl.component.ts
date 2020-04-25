import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import * as $ from 'jquery';
import { IMFXAccordionComponent } from '../../modules/search/detail/components/accordion.component/imfx.accordion.component';
import { IMFXHtmlPlayerComponent } from '../../modules/controls/html.player/imfx.html.player';
import { IMFXSilverlightPlayerComponent } from '../../modules/controls/silverlight.player/imfx.silverlight.player';
import { IMFXDefaultTabComponent } from '../../modules/search/detail/components/default.tab.component/imfx.default.tab.component';

import { IMFXImageComponent } from '../../modules/search/detail/components/image.component/imfx.image.component';
import { IMFXMediaTaggingTabComponent } from '../../modules/search/detail/components/media.tagging.tab.component/imfx.media.tagging.tab.component';

import { IMFXLocatorsComponent } from '../../modules/controls/locators/imfx.locators.component';
import { IMFXTaxonomyComponent } from '../../modules/search/detail/components/taxonomy.tab.component/imfx.taxonomy.tab.component';

import 'style-loader!golden-layout/src/css/default-theme.css';
import 'style-loader!golden-layout/src/css/goldenlayout-base.css';
import 'style-loader!golden-layout/src/css/goldenlayout-light-theme.css';
import 'script-loader!golden-layout/lib/jquery.js';
import 'script-loader!golden-layout/dist/goldenlayout.js';

import { IMFXTimelineComponent } from '../../modules/controls/timeline/imfx.timeline';
import { TimelineConfig } from '../../modules/controls/timeline/timeline.config';
import { IMFXVideoInfoComponent } from '../../modules/search/detail/components/video.info.component/video.info.component';

import { GLComponent} from '../../modules/search/detail/gl.component';

import { GoldenConfig } from '../../modules/search/detail//detail.config';
import {TimeCodeFormat, TMDTimecode} from "../../utils/tmd.timecode";
import {
  LayoutManagerDefaults,
  LayoutManagerModel, LayoutType
} from "../../modules/controls/layout.manager/models/layout.manager.model";

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
        IMFXImageComponent,
        IMFXMediaTaggingTabComponent,
        IMFXLocatorsComponent,
        IMFXTaxonomyComponent
    ]
})

export class GLLoggerComponent extends GLComponent {
  private layoutModel: LayoutManagerModel;
  private layoutType: LayoutType = LayoutType.Logging;
  private timelineComponent: any;

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
      componentName: 'Taxonomy',
      tTitle: 'Taxonomy',
      title: 'Taxonomy'
    }
  ]

  ngOnInit() {
    console.log("Waiting layout...");
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
          this.layoutConfig = JSON.parse(LayoutManagerDefaults.Logging);
        }
      }
      else {
        this.layoutConfig = JSON.parse(LayoutManagerDefaults.Logging);
      }
    }
    this.postOnInit();
  }

  postOnInit() {
    this.setView();
    (<any>window).GoldenLayout.__lm.items.Stack.prototype._highlightHeaderDropZone = this._highlightHeaderDropZoneOverride;
    (<any>window).GoldenLayout.__lm.LayoutManager.prototype._$createRootItemAreas = this._$createRootItemAreasOverride;
    //  (<any>window).GoldenLayout.__lm.controls.BrowserPopout.prototype.popIn = this._popIn;

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
      container["compRef"] = compRef;
      compRef.changeDetectorRef.detectChanges();
    });

    this.addMediaLayout(self);
    this.addTimeline(self);

    this.layout.registerComponent('VideoInfo', (container, componentState) => {
      let fullKey = this.config.options.typeDetailsLocal + '.videoInfo';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
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

    this.layout.registerComponent('Tagging', (container, componentState) => {
      let fullKey = this.config.options.typeDetailsLocal + '.tagging';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXLocatorsComponent);
      let compRef = this.viewContainer.createComponent(factory);
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
      container.on('clipAdded', function (data) {
          self.timelineComponent && self.timelineComponent.emit('clipAdded', data);
      });
      container.on('clipReplaced', function (data) {
          self.timelineComponent && self.timelineComponent.emit('clipReplaced', data);
      });
      compRef.instance['config'] = {
        file: self.config.options.file,
        series: self.config.options.series,
        elem: container,
        componentContext: self.config.componentContext,
        commentsColumns: [/*"thumbIn", "thumbOut",*/ "indicator", "InTc", "OutTc", "Notes", "Tags"],
        blackDetectedColumns: ["InTc", "OutTc", "Notes", "Tags"],
        options: {},
        loadedSeries: self._deepCopy(self.config.options.series)
      };
      (<any>window).imfxLoggerComponent = self.loggerComponent = container;
      container.on('addClip', function (data) {
        compRef['_component'].addClip(data);
      });
      compRef.changeDetectorRef.detectChanges();
    });
    this.addTaxonomy(self);
    this.setEvents();
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
    })
    this.layout.on('poppedOut', function (contentItem ) {
     // debugger
    })
    this.layout.on('popIn', function (contentItem ) {
     // debugger
    })
    this.layout.init();
    this.createNewTabsAfterInit();
    this.splashProvider.onHideSpinner.emit();
    this.layout.root && this.layout.root.getItemsByFilter(function (el) {
      return el.type == "stack" && el.contentItems.length == 0
    }).forEach(function (elem) {
      elem.remove();
    });
    this.createDragButtons();
  };

  addTaxonomy(self) {
    this.layout.registerComponent('Taxonomy', (container, componentState) => {
      let fullKey = this.config.options.typeDetailsLocal + '.taxonomy';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXTaxonomyComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container["compRef"] = compRef;
      compRef.instance['config'] = {
        elem: container
      };
      container.on('addTag', function(data){
        self.loggerComponent && self.loggerComponent.emit('addTag', data);
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
    this.saveLayoutHandler($event);
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
  addTimeline(self) {
    this.layout.registerComponent('Timeline', (container, componentState) => {
      let fullKey = this.config.options.typeDetailsLocal + '.timeline';
      this.translate.get(fullKey).subscribe(
        (res: string) => {
          container._config.title = res;
        });
      let factory = this.componentFactoryResolver.resolveComponentFactory(IMFXTimelineComponent);
      let compRef = this.viewContainer.createComponent(factory);
      container.getElement().append($(compRef.location.nativeElement));
      container["compRef"] = compRef;
      let types = ['Comments', 'Legal', 'Cuts'];
    if (self.playerComponents && (self.config.options.file["EOM_text"] == null || self.config.options.file["EOM_text"] == '00:00:00:00')) {
        self.playerComponents.on('playerReady', () => {
            let playerDuration = self.playerComponents.compRef.instance.player.duration();
            compRef.instance.setTimecodeFromPlayer(playerDuration);
        });
    }
      let timelineConfig: TimelineConfig = {
        SOM: self.config.options.file["SOM_text"],
        startTimecode: self.config.options.file["SOM_text"],
        endTimecode: self.config.options.file["EOM_text"],
        series: []
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
                    };
                })
            });
        }
        compRef.instance['timecodeFormatString'] = 'Pal';  // TODO: pick up from the file
        compRef.instance['timelineConfig'] = timelineConfig;
        compRef.instance.onSelect.subscribe(tcStr => {
            self.playerComponents && self.playerComponents.emit('setTimecode', tcStr.in);
        });
        container.on('clipAdded', function(data){
            let serieName = self.loggerComponent ? self.loggerComponent.compRef.instance.active : '';
            compRef.instance.addItem(serieName, {
                startTimecode: data.startTimecodeString,
                endTimecode: data.stopTimecodeString,
                itemID: data.itemID,
                id: data.customId
            });
        });
        container.on('clipReplaced', function(o){
            let serieName = self.loggerComponent ? self.loggerComponent.compRef.instance.active : '';
            compRef.instance.replaceItem(serieName, o.oldClipId, {
                startTimecode: o.newClip.startTimecodeString,
                endTimecode: o.newClip.stopTimecodeString,
                itemID: o.newClip.itemID,
                id: o.newClip.customId
            });
        });
        compRef.changeDetectorRef.detectChanges();
        if (self.playerComponents) {
            self.playerComponents.on('timecodeChange', tcStr => {
                compRef.instance.setCurrentTimecode(tcStr);
            });
        }
        (<any>window).imfxTimelineComponent = self.timelineComponent = container;
    });
  };
}
