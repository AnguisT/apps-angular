import {TimeCodeFormat, TMDTimecode} from "../../../../utils/tmd.timecode";
import {Injectable} from "@angular/core";
import {AbstractPlayerProvider} from "./abstract.player.provider";
import {ClipsProvider} from "./clips.provider";

@Injectable()
export class MarkersProvider extends AbstractPlayerProvider {

  constructor(private clipProvider: ClipsProvider) {
    super();
  }


  init() {
    this.componentRef.player.markers && (!!this.componentRef.player.markers.call) && this.componentRef.player.markers({
      markers: []
    });
  }

  setMarkers(o) {
    let providerRef = this;

    if (!this.componentRef.player.markers)
      return;
    let markers = o.markers;
    let m_type = o.m_type;
    if (m_type == 'locator') {
      this.componentRef.player.markers.removeAll();
      let som = 0;
      if (this.componentRef.videoDetails) {
        som = this.componentRef.videoDetails.FileSomMs ? this.componentRef.videoDetails.FileSomMs : 0;
      }
      markers.forEach(function (marker) {
        let timecodeFormat = TimeCodeFormat[providerRef.componentRef.videoDetails.TimecodeFormat];
        if (som) {
          var time = TMDTimecode.fromString(marker.time, timecodeFormat).substract(TMDTimecode.fromMilliseconds(som, timecodeFormat)).toSeconds();
        }
        else {
          var time = TMDTimecode.fromString(marker.time, timecodeFormat).toSeconds();
        }
        providerRef.componentRef.player.markers.add([{
          time: time,
          text: time,
          point: 0,
          class: 'tags-marker'
        }]);
      });
      this.componentRef.player.currentTime(this.componentRef.player.markers.getMarkers()[0].time);
    }
    else if (m_type == 'clip') {
      this.clipProvider.selectClip(o);
    }
  }

}
