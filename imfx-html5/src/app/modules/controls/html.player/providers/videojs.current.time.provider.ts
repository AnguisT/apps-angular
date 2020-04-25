import {IMFXHtmlPlayerComponent} from "../imfx.html.player";
import {TimeCodeFormat} from "../../../../utils/tmd.timecode";
import {ItemTypes} from "../item.types";
import {Injectable} from "@angular/core";
import {TimecodeProvider} from "./timecode.provider";
import {AbstractPlayerProvider} from "./abstract.player.provider";
@Injectable()
export class VideoJSCurrentTimeProvider extends AbstractPlayerProvider {

  private _time;

  constructor(private timecodeProvider: TimecodeProvider) {
    super();
  }

  getTimelineTime() {
    return this._time;
  }

  init() {
    let providerRef = this;

    if (!this.componentRef.simpleMode) {
      this.componentRef.videojs.getComponent("MouseTimeDisplay").prototype.update = function update(newTime, position) {
        providerRef._time = newTime;
        let time;
        if (providerRef.componentRef.videoDetails) {
          if (providerRef.componentRef.type == ItemTypes.MEDIA  || ( providerRef.componentRef.type == ItemTypes.AUDIO && providerRef.componentRef.getTvStandart() && providerRef.componentRef.videoDetails.TimecodeFormat )) {
            time = providerRef.timecodeProvider.getTimecodeString(newTime, TimeCodeFormat[providerRef.componentRef.videoDetails.TimecodeFormat], providerRef.componentRef.som);
          } else if (providerRef.componentRef.type == ItemTypes.AUDIO && (!providerRef.componentRef.getTvStandart() || !providerRef.componentRef.videoDetails.TimecodeFormat)) {
            time = providerRef.timecodeProvider.getAudioTimeString(newTime, providerRef.componentRef.som);
          } else {
              time = providerRef.timecodeProvider.getTimeString(newTime);
          }
        }
        this.el().style.left = position + 'px';
        this.el().setAttribute('data-current-time', time || 'Loading');

        if (this.keepTooltipsInside) {
          let clampedPosition = this.clampPosition_(position);
          let difference = position - clampedPosition + 1;
          let tooltipWidth = 200;
          let tooltipWidthHalf = tooltipWidth / 2;

          this.tooltip.innerHTML = time;
          this.tooltip.style.right = '-' + (tooltipWidthHalf - difference) + 'px';
        }
      };

      this.componentRef.videojs.getComponent("PlayProgressBar").prototype.updateDataAttr = function updateDataAttr(event) {
        let time = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime();
        let timeStr;
        if (providerRef.componentRef.videoDetails) {
          if (providerRef.componentRef.type == ItemTypes.MEDIA  || ( providerRef.componentRef.type == ItemTypes.AUDIO && providerRef.componentRef.getTvStandart() && providerRef.componentRef.videoDetails.TimecodeFormat )) {
            timeStr = providerRef.timecodeProvider.getTimecodeString(time, TimeCodeFormat[providerRef.componentRef.videoDetails.TimecodeFormat], providerRef.componentRef.som);
          } else if (providerRef.componentRef.type == ItemTypes.AUDIO && (!providerRef.componentRef.getTvStandart() || !providerRef.componentRef.videoDetails.TimecodeFormat)) {
              timeStr = providerRef.timecodeProvider.getAudioTimeString(time, providerRef.componentRef.som);
          } else {
              timeStr = providerRef.timecodeProvider.getTimeString(time);
          }
        }
        this.el_.setAttribute('data-current-time', timeStr);
      };
    }
  }

}
