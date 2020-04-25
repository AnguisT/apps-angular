import {
  Component, ViewEncapsulation, Input, Injectable, Inject, ChangeDetectorRef,
  EventEmitter, ViewChild, Injector
} from '@angular/core';
import {DetailService} from "../../../../../modules/search/detail/services/detail.service";

import { IMFXGrid } from '../../../../controls/grid/grid';
import {Select2ListTypes} from "../../../../controls/select2/types";

import { MediaDetailMediaTaggingResponse } from '../../../../../models/media/detail/mediatagging/media.detail.media.tagging.response';
import {IMFXControlsLookupsSelect2Component} from "../../../../controls/select2/imfx.select2.lookups";
import {
  SlickGridConfig, SlickGridConfigModuleSetups, SlickGridConfigOptions,
  SlickGridConfigPluginSetups
} from "../../../slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {TaggingSlickGridProvider} from "./providers/tagging.slick.grid.provider";
import {SearchFormProvider} from "../../../form/providers/search.form.provider";
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {TaggingViewsProvider} from "./providers/views.provider";
import {setTimeout} from "timers";
import {ViewsProvider} from "../../../views/providers/views.provider";

@Component({
    selector: 'imfx-media-tagging-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../slick-grid/styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        DetailService,
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: TaggingSlickGridProvider},
        SearchFormProvider,
        SlickGridService,
        {provide: ViewsProvider, useClass: TaggingViewsProvider},
        {provide: ViewsProvider, useClass: TaggingViewsProvider},
        TaggingViewsProvider
    ],
    entryComponents: [IMFXGrid]
})
@Injectable()
export class IMFXMediaTaggingTabComponent {
    private config = <any>{
      hasOuterFilter: true
    };
    public compIsLoaded = false;
    @ViewChild('slickGridComp') slickGrid: SlickGridComponent;
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
      componentContext: this,
      providerType: SlickGridProvider,
      serviceType: SlickGridService,
      options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
        module: <SlickGridConfigModuleSetups>{
          viewMode: 'table',
          onIsThumbnails: new EventEmitter<boolean>(),
          onSelectedView: new EventEmitter<any>(),
          hasOuterFilter: this.config.hasOuterFilter,
        //  colNameForSetRowHeight: 'Tags',
          isThumbnails: false
        },
        plugin: <SlickGridConfigPluginSetups>{
          forceFitColumns: true,
            multiAutoHeight: true,

          rowHeight: 30  // wil not work until call this.slickGrid.provider.setRowHeight('Tags');
        }
      })
    });
    @Input('config') set setParams(config) {
      this.config = $.extend(true, this.config, config);
      this.searchGridConfig.options.module.hasOuterFilter = this.config.hasOuterFilter;
    }

    private tableRows = [];
    private selectedTagTypes = ['Comments', 'Legal', 'Cuts'];
    private selectedTagTypesIds = [];
    @ViewChild('select') private select: IMFXControlsLookupsSelect2Component;
    constructor(private cdr: ChangeDetectorRef,
                private detailService: DetailService,
                @Inject(Injector) public injector: Injector) {
    }
    ngAfterViewInit() {
        this.config.moduleContext = this;
        if (this.config.elem && !this.config.elem._config._isHidden) {
            this.selectMediaTagging();
        }
        if (this.config.locatorsComponent && this.config.locatorsComponent.onSelectLocatorTab) {
          this.config.locatorsComponent.onSelectLocatorTab.subscribe( (data) => {
            this.refreshGrid(data);
          });
        }
    }
    selectMediaTagging() {
        let self = this;
        if (!!this.config.series) {
            this.fillTableRows(this.config.series);
        }
        else {
            this.detailService.getDetailMediaTagging(this.config.file["ID"])
                .subscribe((res: MediaDetailMediaTaggingResponse) => {
                    if(self.config.isSimpleDetail) {
                      self.config.detailContext.toggleOverlayForTagging(false, res);
                    }
                    self.fillTableRows(res);
                });
        }
    };
    fillTableRows(series) {
      this.tableRows = [];
      let self = this;
      let index = 1;
      let maxTagsLength = 0, tagsCount = 0;
      series.forEach(el => {
           this.tableRows.push({
              $id: index++,
              TagType: el.TagType,
              InTc: el.InTc,
              OutTc: el.OutTc,
              Notes: el.Notes,
              Tags: el.Tags,
              thumbIn: self.config.file["THUMBURL"],
              thumbOut: self.config.file["THUMBURL"],
              indicator: this.getCssClass(el)
          });
           if (el.Tags.join('').length > maxTagsLength) {
             maxTagsLength = el.Tags.join('').length;
             tagsCount = el.Tags.length;
           }
      });
      let globalColsView = this.injector.get(TaggingViewsProvider).getCustomColumns();
      this.slickGrid.provider.setGlobalColumns(globalColsView);
      this.slickGrid.provider.setDefaultColumns(globalColsView, [], true);
      if(this.config.isSimpleDetail) {
        this.slickGrid.provider.changeColParams('InTc', {width: 100, resizable: false});
        this.slickGrid.provider.changeColParams('OutTc', {
          width: 0,
          resizable: false,
          headerCssClass: "simple-detail-locator-hider",
          cssClass: "simple-detail-locator-hider",
          minWidth: 0});
      }
  //    this.slickGrid.provider.setRowHeight('Tags');

      this.slickGrid.provider.buildPageByData({Data: this.tableRows});
      this.refreshGrid();
      // -----------------------------
      this.compIsLoaded = true;
      if (this.config.hasOuterFilter) {
        let tagTypes = this.getValuesOfTagTypes(series);
        let lowerLevelValuesS2: Select2ListTypes = this.select.turnArrayOfObjectToStandart(tagTypes, {
          key: 'ID',
          text: 'Name',
          selected: 'selected'
        });
        this.select.setData(lowerLevelValuesS2, true);
        this.select.setSelectedByIds(this.selectedTagTypesIds);
      }
    }
    setNode(o) {
      if(this.config.isSimpleDetail) {
        this.config.detailContext.detailVideo.setMarkers({markers: o.markers, m_type: 'locator', id: o.id});
      }
      else {
        this.config.elem.emit('setMarkers', {markers: o.markers, m_type: 'locator', id: o.id});
      }
    };
    public loadComponentData() {
        if (!this.compIsLoaded) {
           this.selectMediaTagging();
        }
    };
    unselectRow() {
      // this.gridOptions.api.deselectAll();
    }
    getValuesOfTagTypes(series) {
      let tagTypes = [];
      let index = 0;
      series.forEach(el => {
        var newItem = true;
        tagTypes.forEach(elem => {
          if (elem.Name == el.TagType) {
            newItem = false;
          }
        })
        if (newItem) {
          tagTypes.push({
            ID: index,
            Name: el.TagType,
            selected: !(el.TagType === 'Blackdetect')
          });
          // default selected
          if ( !(el.TagType === 'Blackdetect') ) {
            this.selectedTagTypesIds.push(index);
          }
          index++;
        }
      });
      return tagTypes;
    }
    onSelect() {
      let txt = this.select.getSelectedText();
      (<TaggingSlickGridProvider>this.slickGrid.provider).setSelectedTagTypes(txt);
      this.slickGrid.provider.dataView.setFilter(this.slickGrid.provider.getFilter());
      // this.slickGrid.provider.resize();
    }
    refreshGrid(data?: any) {
      if (data) {
        this.config.series = data.series.filter(el => { return el.TagType.toLowerCase() == this.config.tagType.toLowerCase(); });
        this.fillTableRows(this.config.series);
      };
      // setTimeout(() => {
      //   this.slickGrid.provider.resize();
      // }, 0);
    }
    getCssClass(locator) {
      let cssClass = '';
      switch (locator.Origin) {
        case 'iMfxOriginal':
          cssClass = 'green';
          break;
        case 'AvidLocator':
          cssClass = 'red';
          break;
        case 'FCP':
          cssClass = 'yellow';
          break;
        case 'Premier':
          cssClass = 'blue';
          break;
          // AvidRestriction,  AiService
        default: break;
      }
      return {cssClass: cssClass, title: locator.Origin};
    }
}
