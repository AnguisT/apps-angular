import {Component, ViewChild} from '@angular/core';
import {IMFXTimelineComponent} from "../../../../modules/controls/timeline/imfx.timeline";
import {TimelineConfig} from "../../../../modules/controls/timeline/timeline.config";

@Component({
  selector: 'demo-tree',
  templateUrl: './tpl/index.html',
  entryComponents: [
    IMFXTimelineComponent
  ]
})

export class DemoTimelineComponent {
  @ViewChild('control') private control;
  private test = 123;
  private timelineConfig: TimelineConfig = {
    SOM: "00:00:00:00",
    startTimecode: "00:00:00:00",
    endTimecode: "00:00:10:00",
    series: [{
      title: "First",
      items: [{
        startTimecode: "00:00:02:00"
      },{
        startTimecode: "00:00:01:00",
        endTimecode: "00:00:01:10"
      },{
        startTimecode: "00:00:05:00",
        endTimecode: "00:00:05:30"
      },{
        startTimecode: "00:00:09:00",
        endTimecode: "00:00:09:20"
      }]
    }, {
      title: "Second",
      items: [{
        startTimecode: "00:00:03:00"
      },{
        startTimecode: "00:00:03:10",
        endTimecode: "00:00:04:10"
      },{
        startTimecode: "00:00:06:00",
        endTimecode: "00:00:06:30"
      },{
        startTimecode: "00:00:08:00",
        endTimecode: "00:00:08:20"
      }]
    }]
  };
}
