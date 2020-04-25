import {
    ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Injectable, Injector, ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {
  SlickGridConfig, SlickGridConfigModuleSetups,
  SlickGridConfigOptions, SlickGridConfigPluginSetups
} from "../../../slick-grid/slick-grid.config";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {SearchFormProvider} from "../../../form/providers/search.form.provider";
import {EventsViewsProvider} from "./providers/views.provider";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {EventsSlickGridProvider} from "./providers/events.slick.grid.provider";
import {LookupService} from "../../../../../services/lookup/lookup.service";
import {SlickGridSelect2FormatterEventData} from "../../../slick-grid/types";
import {DetailProvider} from "../../providers/detail.provider";
import {TimeCodeFormat, TMDTimecode} from "../../../../../utils/tmd.timecode";

@Component({
    selector: 'imfx-events-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../styles/index.scss'
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: EventsSlickGridProvider},
        SearchFormProvider,
        SlickGridService,
        EventsViewsProvider,
        DetailProvider
    ],
})
@Injectable()
export class IMFXEventsTabComponent {
    config: any;
    public compIsLoaded = false;
    @ViewChild('slickGridComp') slickGrid: SlickGridComponent;
    public onTimecodeEdit: EventEmitter<any> = new EventEmitter<any>();
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
      componentContext: this,
      providerType: SlickGridProvider,
      serviceType: SlickGridService,
      options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
        module: <SlickGridConfigModuleSetups>{
          viewMode: 'table',
          onIsThumbnails: new EventEmitter<boolean>(),
          onSelectedView: new EventEmitter<any>(),
          isThumbnails: false
        },
        plugin: <SlickGridConfigPluginSetups>{
          rowHeight: 40,
          forceFitColumns: true
        }
      })
    });
    private mediaEventTypes: Array<any> = [];
    constructor(private cdr: ChangeDetectorRef,
                private lookup: LookupService,
              @Inject(Injector) public injector: Injector) {
    }
    ngAfterViewInit() {
        this.getEventsTypesFromLookup().subscribe(res => {
            this.selectEvents();
        });
        this.onTimecodeEdit.subscribe(data => {
            this.addInOut(data);
        });
    }

    public loadComponentData() {
      this.refreshGrid();
    };

    selectEvents() {
      let events = this.config.file['Events'];
      if (events !== null && this.config.readOnly) {
        events.forEach(el => {
          let eventType = this.mediaEventTypes.filter(function(elem){ return elem.ID === el.TYPE; });
          el.TYPE = eventType.length > 0 ? eventType[0].NAME : el.TYPE;
        });
      }
      let globalColsView = this.injector.get(EventsViewsProvider).getCustomColumns(this.config.readOnly);
      if (!this.config.readOnly) {
        globalColsView[5].__deps.data = {
            values: this.mediaEventTypes,
            rule: this.lookup.getLookupRuleForConvertToSelect2Item('MediaEventTypes'),
            validationEnabled: true
        };
        this.slickGrid.provider.formatterSelect2OnSelect.subscribe((res: SlickGridSelect2FormatterEventData) => {
            let _events = this.config.file['Events'];
            let _id =  res.data.data.ID || res.data.data['customId'];
            _events.forEach(el => {
                if ( el.ID === _id || el.customId === _id ) {
                    el[res.data.columnDef.field] = res.value.id;
                }
            });
            res.data.data[res.data.columnDef.field] = res.value.id;
        });

        this.slickGrid.provider.formatterTextOnChange.subscribe((res: SlickGridSelect2FormatterEventData) => {
            let _events = this.config.file['Events'];
            let _id =  res.data.data.ID || res.data.data['customId'];
            _events.forEach(el => {
                if ( el.ID === _id || el.customId === _id ) {
                    el[res.data.columnDef.field] = res.value;
                }
            });
            res.data.data[res.data.columnDef.field] = res.value;
        });
        this.slickGrid.provider.onRowDelete.subscribe((res) => {
          let events = this.config.file['Events'];
          let id = null;
          events.forEach((el, ind) => {
            if ( el.ID === res || el.customId === res )
              id = ind;
          });
          if (id !== null) {
            let _event = events.splice(id, 1);
            if (_event[0].customId == null) {
                this.config.file.DeletedEvents.push(_event[0]);
            }
          }
        });
      }
      this.slickGrid.provider.setGlobalColumns(globalColsView);
      this.slickGrid.provider.setDefaultColumns(globalColsView, [], true);
      let detailProvider = this.injector.get(DetailProvider);
      this.slickGrid.provider.buildPageByData({Data: detailProvider._deepCopy(events) || []});
      this.refreshGrid();
      this.compIsLoaded = true;
    };
    refreshGrid(data?: any, readOnly?: boolean) {
        if (readOnly != null) {
            this.config.readOnly = readOnly;
        };
        if (data) {
        this.config.file = data;
        this.selectEvents();
        };
      // setTimeout(() => {
      //   this.slickGrid.provider.resize();
      // }, 0);
    };
    getEventsTypesFromLookup(): Observable<Subscription> {
      return Observable.create((observer) => {
        this.lookup.getLookups('MediaEventTypes').subscribe(
          (res: any) => {
            this.mediaEventTypes = res;
            observer.next();
          }
        );
      });
    }

    addEvent() {
      this.config.elem.emit('addEvent');
    }
    addEventToGrid(data) {
        let events = this.config.file['Events'];
        let newItem = {
            DURATION_text: '00:00:00:00',
            SOMS: data.startTimecodeString,
            EOMS: data.stopTimecodeString,
            PRT_NUM: 0,
            SQ_NUM: events.length + 1,
            PRT_TTL: '',
            TYPE: 0,
            ID: 0,
            MIID: this.config.file.ID,
            PAR_TYPE: 4010, // const for events
            TimecodeFormat: this.config.file.TimecodeFormat,
            customId: new Date().getTime()
        }
        events.push(newItem);
        let detailProvider = this.injector.get(DetailProvider);
        let _data = this.slickGrid.provider.prepareData(detailProvider._deepCopy(events), events.length);
        this.slickGrid.provider.setData(_data, true);
        this.slickGrid.provider.setSelectedRow(_data.length - 1);
    }
    setIn() {
      this.config.elem.emit('setInOut', {type: 'In'});
    }
    setOut() {
      this.config.elem.emit('setInOut', {type: 'Out'});
    }
    addInOut(data) {
      if (!this.slickGrid.provider.getSelectedRow()) return;
      let idx = this.slickGrid.provider.slick.getSelectedRows()[0];
      let columns = this.slickGrid.provider.getColumns();
      if (data.type == 'In') {
          this.slickGrid.provider.getSelectedRow()['SOMS'] = data.timecode;
          let events = this.config.file['Events'];
          let editId = this.slickGrid.provider.getSelectedRow()['customId'] || this.slickGrid.provider.getSelectedRow()['ID'];
          events.forEach(el => {
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
              this.slickGrid.provider.slick.updateCell(idx, colIdIn);
      }
      else {
          this.slickGrid.provider.getSelectedRow()['EOMS'] = data.timecode;
          let events = this.config.file['Events'];
          let editId = this.slickGrid.provider.getSelectedRow()['customId'] || this.slickGrid.provider.getSelectedRow()['ID'];
          events.forEach(el => {
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
              this.slickGrid.provider.slick.updateCell(idx, colIdOut);
      }
        if (!data.duration) {
            let soms = this.slickGrid.provider.getSelectedRow()['SOMS'];
            let eoms = this.slickGrid.provider.getSelectedRow()['EOMS'];
            let timecodeFormat = TimeCodeFormat[this.config.file.TimecodeFormat];
            this.slickGrid.provider.getSelectedRow()['DURATION_text'] = TMDTimecode.fromString(eoms, timecodeFormat).substract(TMDTimecode.fromString(soms, timecodeFormat)).toString();
            let segments = this.config.file['Segments'];
            let editId = this.slickGrid.provider.getSelectedRow()['customId'] || this.slickGrid.provider.getSelectedRow()['ID'];
            segments.forEach(el => {
                if (el.customId == editId || el.ID == editId) {
                    el.DURATION_text = this.slickGrid.provider.getSelectedRow()['DURATION_text'];
                }
            });
        } else {
            this.slickGrid.provider.getSelectedRow()['DURATION_text'] = data.duration.toString();
            let events = this.config.file['Events'];
            let editId = this.slickGrid.provider.getSelectedRow()['customId'] || this.slickGrid.provider.getSelectedRow()['ID'];
            events.forEach(el => {
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
            this.slickGrid.provider.slick.updateCell(idx, colId);
    }
    save() {
        this.config.elem.emit('save', {events: this.config.file['Events']});
    }
    updateDataIds(ids) {
        let events = this.config.file['Events'].filter(el => {
            return el.customId != null;
        });
        events.forEach((el, idx) => {
            el.ID = ids[idx];
            delete el.customId;
        });
        let detailProvider = this.injector.get(DetailProvider);
        let _data = this.slickGrid.provider.prepareData(detailProvider._deepCopy(events), events.length);
        this.slickGrid.provider.setData(_data, true);
    }
    getValidation() {
        if (this.config.readOnly) {
            return true;
        } else {
            let isValid = true;
            let events = this.config.file['Events'];
            events.forEach(el => {
                if (!el.PRT_TTL || el.PRT_TTL == '' || !el.TYPE) {
                    isValid = false;
                }
            });
            // this.slickGrid.provider.onGetValidation.emit(function(valid){
            //     isValid = isValid && valid ? true : false;
            // });
            return isValid;
        }
    }
}
