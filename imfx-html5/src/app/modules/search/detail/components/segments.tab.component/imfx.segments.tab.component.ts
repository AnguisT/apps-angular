import {
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Injectable,
    Injector,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions,
    SlickGridConfigPluginSetups
} from "../../../slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {SlickGridColumn, SlickGridSelect2FormatterEventData} from "../../../slick-grid/types";
import {Select2Formatter} from "../../../slick-grid/formatters/select2/select2.formatter";
import {LookupService} from "../../../../../services/lookup/lookup.service";
import {TextFormatter} from "../../../slick-grid/formatters/text/text.formatter";
import {IMFXHtmlPlayerComponent} from "../../../../controls/html.player/imfx.html.player";
import {VideoJSCurrentTimeProvider} from "../../../../controls/html.player/providers/videojs.current.time.provider";
import {SATThirdSlickGridProvider} from "./providers/sat.third.slickgrid.provider";
import {AudioTracksService} from "./services/audio.tracks.service";
import {SegmentsSlickGridProvider} from "./providers/segments.slickgrid.provider";
import {DeleteFormatter} from "../../../slick-grid/formatters/delete/delete.formatter";
import {TimecodeInputFormatter} from "../../../slick-grid/formatters/timecode-input/timecode.input.formatter";
import {SegmentsViewsProvider} from "./providers/views.provider";
import {DetailProvider} from "../../providers/detail.provider";
import {TMDTimecode, TimeCodeFormat} from "../../../../../utils/tmd.timecode";

@Component({
    selector: 'imfx-s-audio-tracks-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        SlickGridProvider,
        SegmentsSlickGridProvider,
        {provide: SlickGridProvider, useClass: SegmentsSlickGridProvider},
        SlickGridService,
        IMFXHtmlPlayerComponent,
        VideoJSCurrentTimeProvider,
        AudioTracksService,
        SegmentsViewsProvider,
        DetailProvider
    ]
})
@Injectable()
export class IMFXSegmentsTabComponent {
    @ViewChild('segmentsAudioGrid') private segmentsAudioGrid: SlickGridComponent;
    public onResize: EventEmitter<{ comp: any }> = new EventEmitter<{ comp: any }>();
    public onTimecodeEdit: EventEmitter<any> = new EventEmitter<any>();
    config: any;
    private segmentsAudioGridColumns = {
        tableColumns: <SlickGridColumn[]>[

        ]
    };

    private segmentsAudioGridOptions: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        // providerType: TitlesSlickGridProvider,
        providerType: SegmentsSlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                isThumbnails: false,
                search: {
                    enabled: false
                }
            },
            plugin: <SlickGridConfigPluginSetups>{
                rowHeight: 40,
                forceFitColumns: true
            }
        })
    });

    constructor(private cdr: ChangeDetectorRef,
                private lookup: LookupService,
                private injector: Injector,
                private slickGridProvider: SegmentsSlickGridProvider
    ) {
        // this.onResize.subscribe(() => {
        //     this.segmentsAudioGrid.provider.resize();
        // });
    }

    ngAfterViewInit() {
      this.setSegmentsAudioTracks();
      this.onTimecodeEdit.subscribe(data => {
          this.addInOut(data);
      });
    }

    public loadComponentData() {
        // setImmediate(() => {
        //     this.segmentsAudioGrid.provider.resize();
        // });
    }
    setSegmentsAudioTracks() {
      let globalColsView = this.injector.get(SegmentsViewsProvider).getCustomColumns(this.config.readOnly);
      if (this.config.readOnly === true) {
        this.selectSegmentsAudioTracks(globalColsView);
      } else {
        let select2ColIndex = null;
        globalColsView.forEach((c: SlickGridColumn, i: number) => {
          if (c.field == 'TYPE_text' || c.field == 'TYPE') {
            select2ColIndex = i;
          }
          return c;
        });
        this.lookup.getLookups('SegmentTypes').subscribe((resp) => {
          globalColsView[select2ColIndex].__deps.data = {
              values: resp,
              rule: this.lookup.getLookupRuleForConvertToSelect2Item('SegmentTypes'),
              validationEnabled: true
          };
          this.selectSegmentsAudioTracks(globalColsView);
        });
      }

      this.segmentsAudioGrid.provider.formatterSelect2OnSelect.subscribe((res: SlickGridSelect2FormatterEventData) => {
          let _segments = this.config.file['Segments'];
          let _id =  res.data.data.ID || res.data.data['customId'];
          _segments.forEach(el => {
              if ( el.ID === _id || el['customId'] === _id ) {
                  el[res.data.columnDef.field] = res.value.id;
              }
          });
          res.data.data[res.data.columnDef.field] = res.value.id;
      });

      this.segmentsAudioGrid.provider.formatterTextOnChange.subscribe((res: SlickGridSelect2FormatterEventData) => {
          let _segments = this.config.file['Segments'];
          let _id =  res.data.data.ID || res.data.data['customId'];
          _segments.forEach(el => {
              if ( el.ID === _id || el['customId'] === _id ) {
                  el[res.data.columnDef.field] = res.value;
              }
          });
          res.data.data[res.data.columnDef.field] = res.value;
      });
      this.segmentsAudioGrid.provider.onRowDelete.subscribe((res) => {
        let segments = this.config.file['Segments'];
        let id = null;
        segments.forEach((el, ind) => {
          if ( el.ID === res || el.customId === res )
            id = ind;
        });
        if (id !== null) {
          let _segment = segments.splice(id, 1);
            if (_segment[0].customId == null) {
                this.config.file.DeletedSegments.push(_segment[0]);
            }
        }
      });
    }
    selectSegmentsAudioTracks(globalColsView?) {
        if (!globalColsView) {
          globalColsView = this.injector.get(SegmentsViewsProvider).getCustomColumns(this.config.readOnly);
        }
        let tableRows = this.config.file['Segments'];
        this.segmentsAudioGrid.provider.setGlobalColumns(globalColsView);
        this.segmentsAudioGrid.provider.setDefaultColumns(globalColsView, [], true);
        let detailProvider = this.injector.get(DetailProvider);
        this.segmentsAudioGrid.provider.buildPageByData({Data: detailProvider._deepCopy(tableRows)});
    };

    addEvent() {
        this.config.elem.emit('addEvent');
    }
    addEventToGrid(data) {
        let segments = this.config.file['Segments'];
        let newItem = {
            DURATION_text: "00:00:00:00",
            PRT_TTL: null,
            SOMS: data.startTimecodeString,
            EOMS: data.stopTimecodeString,
            PRT_NUM: 1,
            SQ_NUM: segments.length + 1,
            TYPE: 0,
            ID: 0,
            MIID: this.config.file.ID,
            PAR_TYPE: 4000, // const for segments
            TimecodeFormat: this.config.file.TimecodeFormat,
            customId: new Date().getTime()
        };
        segments.push(newItem);
        let detailProvider = this.injector.get(DetailProvider);
        let _data = this.slickGridProvider.prepareData(detailProvider._deepCopy(segments), segments.length);
        this.slickGridProvider.setData(_data, true);
        this.slickGridProvider.setSelectedRow(_data.length - 1);
    }
    setIn() {
      this.config.elem.emit('setInOut', {type: 'In'});
    }
    setOut() {
      this.config.elem.emit('setInOut', {type: 'Out'});
    }
    addInOut(data) {
      if (!this.slickGridProvider.getSelectedRow()) return;
      let idx = this.slickGridProvider.slick.getSelectedRows()[0];
      let columns = this.slickGridProvider.getColumns();
      if (data.type == 'In') {
        this.slickGridProvider.getSelectedRow()['SOMS'] = data.timecode;
        let segments = this.config.file['Segments'];
        let editId = this.slickGridProvider.getSelectedRow()['customId'] || this.slickGridProvider.getSelectedRow()['ID'];
          segments.forEach(el => {
              if (el.customId == editId || el.ID == editId) {
                  el.SOMS = data.timecode;
              }
          });
        let colIdIn = -1;
        columns.forEach((el, idx) => {
            if (el.name == 'In') {
                colIdIn = idx;
            }
        });
        if (colIdIn > -1)
            this.slickGridProvider.slick.updateCell(idx, colIdIn);
      }
      else {
        this.slickGridProvider.getSelectedRow()['EOMS'] = data.timecode;
          let segments = this.config.file['Segments'];
          let editId = this.slickGridProvider.getSelectedRow()['customId'] || this.slickGridProvider.getSelectedRow()['ID'];
          segments.forEach(el => {
              if (el.customId == editId || el.ID == editId) {
                  el.EOMS = data.timecode;
              }
          });
          let colIdOut = -1;
          columns.forEach((el, idx) => {
              if (el.name == 'Out') {
                  colIdOut = idx;
              }
          });
          if (colIdOut > -1)
              this.slickGridProvider.slick.updateCell(idx, colIdOut);
      }
      if (!data.duration) {
          let soms = this.slickGridProvider.getSelectedRow()['SOMS'];
          let eoms = this.slickGridProvider.getSelectedRow()['EOMS'];
          let timecodeFormat = TimeCodeFormat[this.config.file.TimecodeFormat];
          this.slickGridProvider.getSelectedRow()['DURATION_text'] = TMDTimecode.fromString(eoms, timecodeFormat).substract(TMDTimecode.fromString(soms, timecodeFormat)).toString();
          let segments = this.config.file['Segments'];
          let editId = this.slickGridProvider.getSelectedRow()['customId'] || this.slickGridProvider.getSelectedRow()['ID'];
          segments.forEach(el => {
              if (el.customId == editId || el.ID == editId) {
                  el.DURATION_text = this.slickGridProvider.getSelectedRow()['DURATION_text'];
              }
          });
      } else {
          this.slickGridProvider.getSelectedRow()['DURATION_text'] = data.duration.toString();
          let segments = this.config.file['Segments'];
          let editId = this.slickGridProvider.getSelectedRow()['customId'] || this.slickGridProvider.getSelectedRow()['ID'];
          segments.forEach(el => {
              if (el.customId == editId || el.ID == editId) {
                  el.DURATION_text = data.duration.toString();
              }
          });
      }
        let colId = -1;
        columns.forEach((el, idx) => {
            if (el.name == 'Duration') {
                colId = idx;
            }
        });
        if (colId > -1)
            this.slickGridProvider.slick.updateCell(idx, colId);

      // let idx = this.slickGridProvider.slick.getSelectedRows()[0];
      // this.slickGridProvider.slick.invalidateRow(idx);
      // this.slickGridProvider.slick.render();
    }
    refreshGrid(data?: any, readOnly?: boolean) {
        if (readOnly != null) {
            this.config.readOnly = readOnly;
        };
        if (data) {
            this.config.file = data;
            this.setSegmentsAudioTracks();
        };
    };
    updateDataIds(ids) {
        let segments = this.config.file['Segments'].filter(el => {
            return el.customId != null;
        });
        segments.forEach((el, idx) => {
            el.ID = ids[idx];
            delete el.customId;
        });
    }
    getValidation() {
        if (this.config.readOnly) {
            return true;
        } else {
            let isValid = true;
            let segments = this.config.file['Segments'];
            segments.forEach(el => {
                if (!el.PRT_TTL || el.PRT_TTL == '' || !el.TYPE) {
                    isValid = false;
                }
            });
            // this.segmentsAudioGrid.provider.onGetValidation.emit(function(valid){
            //     isValid = isValid && valid ? true : false;
            // });
            return isValid;
        }
    }
}
