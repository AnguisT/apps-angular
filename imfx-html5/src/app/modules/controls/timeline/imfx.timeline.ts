import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild, OnInit, OnChanges
} from "@angular/core";

// Loading jQuery
import * as $ from "jquery";

// Loading jQueryUI
import "style-loader!jquery-ui-bundle/jquery-ui.min.css";
import "style-loader!jquery-ui-bundle/jquery-ui.structure.min.css";
import "style-loader!jquery-ui-bundle/jquery-ui.theme.min.css";
import "jquery-ui-bundle/jquery-ui.min.js";

// vis
import "style-loader!vis/dist/vis.css";
import "style-loader!vis/dist/vis-timeline-graph2d.min.css";
import * as vis from 'vis';
import {Timeline} from "vis";

import {TMDTimecode, TimeCodeFormat} from "../../../utils/tmd.timecode";
import {TimelineConfig, TimelineSerieItem} from "./timeline.config";
import {ThemesProvider} from "../../../providers/design/themes.providers";
import {NotificationService} from "../../notification/services/notification.service";
import {ItemTypes} from "../html.player/item.types";
require('./plugins/html5slider');
declare var window: any;
@Component({
  selector: 'imfx-timeline',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})



export class IMFXTimelineComponent implements OnInit {
  @Input() private timecodeFormatString: string;
  @Input() private timelineConfig: TimelineConfig;
  @Input() private stickyItemsMode: boolean = false;

  @Output() onSelect: EventEmitter<{ in: string, out: string, id: string, itemID?: string, thumbnail?:string }> = new EventEmitter<{ in: string, out: string, id: string, itemID?: string }>();
  @Output() onItemsUpdate: EventEmitter<any> = new EventEmitter<any>();

  private itemsPlain: any = {};
  private playbackPosition: any;

  private timecodeFormat: number;

  private timeline: any;

  constructor(private themesProvider: ThemesProvider,
              protected notificationRef: NotificationService) {

  }

  private getMilliseconds(src) {
    let ms = src.getMilliseconds();
    let sec = src.getSeconds();
    let min = src.getMinutes();
    let hours = src.getHours();

    return ms
      + sec * 1000
      + min * 60 * 1000
      + hours * 60 * 60 * 1000
  }

  private getTcWithoutSom(tcStr) {
    return TMDTimecode.fromString(tcStr, this.timecodeFormat).substract(TMDTimecode.fromString(this.timelineConfig.SOM, this.timecodeFormat))
  }

  private doSubstract(a, b) {
    return TMDTimecode.fromString(a, this.timecodeFormat).substract(TMDTimecode.fromString(b, this.timecodeFormat))
  }

  private doAdd(a, b) {
    return TMDTimecode.fromString(a, this.timecodeFormat).add(TMDTimecode.fromString(b, this.timecodeFormat))
  }

  private getDateFromTimecode(tcStr) {
    // let tcWithoutSom = this.getTcWithoutSom(tcStr);
    let date = new Date(TMDTimecode.fromString(tcStr, this.timecodeFormat).toMilliseconds());
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
    return date;
  }

  private getTimecodeFromDateMs(ms) {
    let date = new Date();
    return TMDTimecode.fromMilliseconds(ms - 60 * date.getTimezoneOffset() * 1000, this.timecodeFormat)
  }

  private getNextDateFromTimecode(tcStr) {
    // let tcWithoutSom = this.getTcWithoutSom(tcStr);
    let date = new Date(TMDTimecode.fromString(tcStr, this.timecodeFormat).toMilliseconds() + 1);
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
    return date;
  }

  public ngOnInit(): void {
    let self = this;
    this.themesProvider.changed.subscribe((res) => {
      self.setZoomGradient(res);
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.viewInit())
  }

  public ngOnChanges() {
    if (this.timecodeFormatString && this.timelineConfig) {
      this.viewInit();
    }
  }

  private getItem(g, el, idx) {
    let startTime = this.getDateFromTimecode(el.startTimecode);
    let endTime = el.endTimecode && this.getDateFromTimecode(el.endTimecode);

    return {
      id: el.id || g + "_" + idx,
      group: g,
      content: el.label,
      start: startTime,
      startTimecode: el.startTimecode,
      end: el.endTimecode ? endTime : this.getNextDateFromTimecode(el.startTimecode),
      endTimecode: el.endTimecode ? el.endTimecode : el.startTimecode,
      thumbnail: el.thumbnail,
      itemID: el.itemID
    }
  }

  private getStickyItem(g, el, idx) {
    // just for 1 group

    let lastItemById = this.timeline.itemsData.get(this.timeline.itemsData.getIds().slice(-1)[0]);
    let lastItemByPosition = this.getLastItem();

    let startStickyTimecode = TMDTimecode.fromString(lastItemByPosition && lastItemByPosition.internalEndTimecode || "00:00:00:00", this.timecodeFormat);
    let durationTimecode = this.doSubstract(el.endTimecode, el.startTimecode);
    let endStickyTimecode = startStickyTimecode.add(durationTimecode);


    let startTime = this.getDateFromTimecode(startStickyTimecode.toString());
    let endTime = this.getDateFromTimecode(endStickyTimecode.toString());

    return {
      id: g + "_" + (lastItemById && lastItemById.id ? parseInt(lastItemById.id.split("_")[1]) + 1 : idx || idx),
      group: g,
      content: el.label,
      start: startTime,
      internalStartTimecode: startStickyTimecode.toString(),
      startTimecode: el.startTimecode,
      end: endTime,
      internalEndTimecode: endStickyTimecode.toString(),
      endTimecode: el.endTimecode,
      thumbnail: el.thumbnail,
      durationMs: endTime.getTime() - startTime.getTime(),
      itemID: el.itemID
    }
  }

  viewInit(): void {
    this.timecodeFormat = TimeCodeFormat[this.timecodeFormatString];
    this.setZoomGradient();

    var container = document.getElementById('timeline');
    container.innerHTML = "";

    let componentRef = this;


    let groups = new vis.DataSet();
    let items = new vis.DataSet();
    for (var g = 0; g < this.timelineConfig.series.length; g++) {
      let serie = this.timelineConfig.series[g];

      groups.add({
        id: g,
        content: serie.title
      });

      items.add(serie.items.map((el, idx) => {
        let item = this.getItem(g, el, idx);
        this.itemsPlain[item.id] = item;
        return item;
      }));

    }
    // if media type exist and it's media or audio
      if ( this.timelineConfig.mediaType && (this.timelineConfig.mediaType == ItemTypes.AUDIO || this.timelineConfig.mediaType == ItemTypes.MEDIA) ) {
          if (!this.stickyItemsMode && (this.timelineConfig.endTimecode == null || this.timelineConfig.endTimecode == '00:00:00:00')) {
              setTimeout(()=>{
                  this.notificationRef.notifyShow(2, 'rce.timeline_eom_isnull');
              },0);
          }
      }
    // Configuration for the Timeline
    let options = <any> {};
    options.min = this.getDateFromTimecode(this.stickyItemsMode ? "00:00:00:00" : this.timelineConfig.startTimecode);
    options.max = this.getDateFromTimecode(this.stickyItemsMode ? "00:00:10:00" : this.timelineConfig.endTimecode);
    options.zoomMin = 1000 * 5; // X sec
    options.maxMinorChars = 12;
    options.height = '210px';
    options.format = {
      minorLabels: (date, scale, step) => {
        return TMDTimecode.fromMilliseconds(this.getMilliseconds(date.toDate()), this.timecodeFormat).toString();
      },
      majorLabels: () => {
        return ""
      }
    }
    if (this.timelineConfig.template) {
      options.template = this.timelineConfig.template;
    }
    if (this.stickyItemsMode) {
      options.orientation = {item: "top"};
      options.stack = false;
      options.editable = true;
      options.onAdd = () => {
        return false
      }
      (<any>options).onMove = (item, cb) => {
        cb(item);
        this.fitItems();
        setTimeout(()=>this.onItemsUpdate.emit(this.getSortedItemsArray()));
      }
      (<any>options).onMoving = (item, cb) => {
        let zeroDate = this.getDateFromTimecode("00:00:00:00");
        if (item.start < zeroDate) {
          item.start = zeroDate;
        }

        if (item.durationMs == (item.end.getTime() - item.start.getTime())) {
          cb(item);
        }
      }
      (<any>options).onRemove = (item, cb) => {
        cb(item);
        this.fitItems();
        setTimeout(()=>this.onItemsUpdate.emit(this.getSortedItemsArray()));
      }
    }


    // Create a Timeline
    this.timeline = new vis.Timeline(container, items, groups, options);

    if (!this.stickyItemsMode) {
      let playbackId = this.timeline.addCustomTime(options.min, "playback_position");
      this.playbackPosition = (<any>this.timeline).customTimes[0];
    }

    let self = this;
    this.timeline.on("select", (prop) => {
      let items = this.getSortedItemsArray();
      let item = items.filter(el=>el.id==prop.items[0])[0];
      if (item) {
        this.onSelect.emit({
          // in: this.getTcWithoutSom(item.startTimecode).toString(),
          in: item.startTimecode.toString(),
          // out: this.getTcWithoutSom(item.endTimecode).toString(),
          out: item.endTimecode.toString(),
          id: item.id,
          itemID: self.itemsPlain[item.id].itemID,
          thumbnail: item.thumbnail
        });
      }
    });

    this.timeline.on("rangechange", (prop) => {
      if(this.isManual) {
        return;
      }
      let start = prop.start.getTime();
      let end = prop.end.getTime();
      let total = end - start;
      let length = 0;
      let data = $.map(self.timeline.itemsData._data, function(value, index) {
        return [value];
      });
      for(var i = 0; i < data.length; i++) {
        let partStart = data[i].start.getTime();
        // let partStart = self.getDateFromTimecode(data[i].internalStartTimecode.toString()).getTime();
        let partEnd = data[i].end.getTime();
        // let partEnd = self.getDateFromTimecode(data[i].internalEndTimecode.toString()).getTime();
        let partTotal = partEnd - partStart;
        length += partTotal;
      }
      let result = total / length < 0 ? 0 : total /length > 1 ? 1 : total / length;

      if(result <= 1 && result >= 0) {
        $('#zoom-seek').attr("value", result);
        $('#zoom-seek').val(result);
        this.setZoomGradient();
      }
    })
  }

  public getItems() {
    return this.getSortedItemsArray().map(item=>{
      return {
        in: item.startTimecode.toString(),
        out: item.endTimecode.toString(),
        id: item.id
      };
    });
  }

  private fitViewport() {
    setTimeout(() => {
      let lastItem = this.getLastItem();
      this.timeline.setWindow({
        start: this.getDateFromTimecode(this.stickyItemsMode ? "00:00:00:00" : this.timelineConfig.startTimecode),
        end: lastItem && lastItem.end ? new Date(lastItem.end.getTime() + 10*1000) : this.getDateFromTimecode("00:00:10:00")
      });
    });
  }

  private getSortedItemsArray() {
    let itemsPlainSorted = [];
    for (let i in this.timeline.itemSet.items) {
      itemsPlainSorted.push(this.timeline.itemSet.items[i]);
    }
    itemsPlainSorted = itemsPlainSorted
      .sort((a, b) => {
        return a.left - b.left
      })
      .map(el => el.data);
    return itemsPlainSorted;
  }

  private getLastItem() {
    return this.getSortedItemsArray().pop();
  }

  private fitItems() {
    let itemsPlainSorted = this.getSortedItemsArray();

    for (let i = 0; i < itemsPlainSorted.length; i++) {
      let item = itemsPlainSorted[i];
      let previousItem = itemsPlainSorted[i - 1];
      let previousEndTimecodeString;
      if (previousItem) {
        previousEndTimecodeString = previousItem.internalEndTimecode;
      } else {
        previousEndTimecodeString = this.stickyItemsMode ? "00:00:00:00" : this.timelineConfig.startTimecode;
      }

      item.internalStartTimecode = this.getTimecodeFromDateMs(item.start.getTime());
      item.internalEndTimecode = this.getTimecodeFromDateMs(item.end.getTime());

      let intStartStr = item.internalStartTimecode.toString();
      let differenceTc;
      if (TMDTimecode.compareStrings(intStartStr, previousEndTimecodeString) > 0) {
        differenceTc = this.doSubstract(intStartStr, previousEndTimecodeString);
        item.internalStartTimecode = item.internalStartTimecode.substract(differenceTc);
        item.internalEndTimecode = item.internalEndTimecode.substract(differenceTc);
      } else {
        differenceTc = this.doSubstract(previousEndTimecodeString, intStartStr);
        item.internalStartTimecode = item.internalStartTimecode.add(differenceTc);
        item.internalEndTimecode = item.internalEndTimecode.add(differenceTc);
      }

      item.start = this.stickyItemsMode ? this.getDateFromTimecode(item.internalStartTimecode.toString()) : this.getDateFromTimecode(item.startTimecode.toString())
      item.end = this.stickyItemsMode ? this.getDateFromTimecode(item.internalEndTimecode.toString()) : this.getDateFromTimecode(item.endTimecode.toString())

      item.internalStartTimecode = item.internalStartTimecode.toString();
      item.internalEndTimecode = item.internalEndTimecode.toString();

      this.timeline.itemsData.update({
        id: item.id,
        start: item.start,
        startTimecode: item.startTimecode,
        internalStartTimecode: item.internalStartTimecode,
        end: item.end,
        endTimecode: item.endTimecode,
        internalEndTimecode: item.internalEndTimecode,
        thumbnail: item.thumbnail
      });
    }
    this.timeline.setOptions({
      min: this.getDateFromTimecode(this.stickyItemsMode ? "00:00:00:00" : this.timelineConfig.startTimecode),
      max: new Date(itemsPlainSorted[itemsPlainSorted.length-1].end.getTime() + 10 * 1000)
    })
    this.fitViewport();
  }

  public setCurrentTimecode(tc: string) {
    if (this.playbackPosition) {
      this.playbackPosition.setCustomTime(this.getDateFromTimecode(tc));
    }
  }

  public addItem(serieName: string, externalItem: TimelineSerieItem) {
    let ids = this.timeline.groupsData.getIds();
    for (let i in ids) {
      let group = this.timeline.groupsData.get(i);
      if (group.content == serieName) {
        let item;
        if (this.stickyItemsMode) {
          item = this.getStickyItem(group.id, externalItem, this.timeline.itemsData.length)
          this.timeline.setOptions({
            max: new Date(item.end.getTime() + 10 * 1000)
          })
        } else {
          item = this.getItem(group.id, externalItem, this.timeline.itemsData.length);
        }
        this.itemsPlain[item.id] = item;
        this.timeline.itemsData.add([item]);
        break;
      }
    }
    this.fitViewport();
    this.beforeVal = 1;
    $('#zoom-seek').attr("value", 1);
    $('#zoom-seek').val(1);
    this.setZoomGradient();
  }

  public replaceItem(serieName: string, oldId:any, externalItem: TimelineSerieItem) {
    let items = this.getSortedItemsArray();
    let oldItem = items.filter(el=>el.id==oldId)[0];
    if (oldItem) {
      oldItem.label = externalItem.label;
      oldItem.startTimecode = externalItem.startTimecode;
      oldItem.start = this.getDateFromTimecode(externalItem.startTimecode);
      oldItem.endTimecode = externalItem.endTimecode;
      oldItem.thumbnail = externalItem.thumbnail ? externalItem.thumbnail : oldItem.thumbnail;

      let startMs = this.getDateFromTimecode(externalItem.startTimecode).getTime();
      let endMs = this.getDateFromTimecode(externalItem.endTimecode).getTime();
      let durationMs = endMs - startMs;

      oldItem.end = new Date(oldItem.start.getTime() + durationMs)

      this.fitItems();
    }
  }

  public setTimecodeFromPlayer(tc) {
      setTimeout(() => {
          let ms = (Math.floor(tc) * 1000) + (tc % 1) * 1000;
          this.timeline.setOptions({
              max: this.getDateFromTimecode(TMDTimecode.fromMilliseconds(ms, this.timecodeFormat).toString())
          });
          this.fitViewport();
          this.beforeVal = 1;
          $('#zoom-seek').attr("value", 1);
          $('#zoom-seek').val(1);
          this.setZoomGradient();
          setTimeout(() => {
              this.timeline.setWindow({
                  start: this.getDateFromTimecode("00:00:00:00"),
                  end: this.getDateFromTimecode(TMDTimecode.fromMilliseconds(ms, this.timecodeFormat).toString())
              });
          });
      })
  }

  private zoomIn() {
    this.timeline.zoomIn(0.2);
  }

  private zoomOut() {
    this.timeline.zoomOut(0.2);
  }

  private beforeVal = 1;
  private isManual = false;
  onChangeRange() {
    this.isManual = true;
    let value = $('#zoom-seek').val();
    if(this.beforeVal > value) {
      this.timeline.zoomIn(this.beforeVal - value);
    } else if(this.beforeVal < value) {
      this.timeline.zoomOut(value - this.beforeVal);
    }
    this.beforeVal = value;
    $('#zoom-seek').attr("value", value)
    this.setZoomGradient();
    let self = this;
    setTimeout(function(){self.isManual = false;},1000);
  }

  setZoomGradient(theme = null) {
    let valGrad:number = (parseFloat($('#zoom-seek').val()) - parseFloat($('#zoom-seek').attr('min'))) / (parseFloat($('#zoom-seek').attr('max')) - parseFloat($('#zoom-seek').attr('min')));
    $('#zoom-seek').css('background-image',
      '-webkit-gradient(linear, left top, right top, '
      + 'color-stop(' + valGrad + ', '+( theme == null ? ($('.common-app-wrapper').hasClass('default') ? '#EDF1F2' : '#34404A') : (theme == 'default' ? '#EDF1F2' : '#34404A'))+'), '
      + 'color-stop(' + valGrad + ', transparent)'
      + ')'
    );
  }

  private move(percentage) {
    var range = this.timeline.getWindow();
    var interval = range.end - range.start;

    this.timeline.setWindow({
      start: range.start.valueOf() - interval * percentage,
      end:   range.end.valueOf()   - interval * percentage
    });
  }

  private moveLeft() {
    this.move(0.2)
  }

  private moveRight() {
    this.move(-0.2)
  }
}
