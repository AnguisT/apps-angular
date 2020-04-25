import {IMFXHtmlPlayerComponent} from "../imfx.html.player";
import {TimeCodeFormat} from "../../../../utils/tmd.timecode";
import {ItemTypes} from "../item.types";
import {Injectable, NgZone} from "@angular/core";
import {TimecodeProvider} from "./timecode.provider";
import {HelperProvider} from "./helper.provider";
import {AbstractPlayerProvider} from "./abstract.player.provider";

@Injectable()
export class TimecodeControlsProvider  extends AbstractPlayerProvider  {

  timecodeUpdateInterval;

  currentTimecodeEl: Element;
  durationTimecodeEl: Element;

  private alreadyInited: boolean = false;

  constructor(private timecodeProvider: TimecodeProvider,
              private helperProvider: HelperProvider,
              private zone: NgZone) {
    super();
  }

  private startTimecodeUpdate() {
    let providerRef = this;
    this.zone.runOutsideAngular(() => {
      this.clearTimecodeUpdateInterval();
      this.timecodeUpdateInterval = (<any>window).timecodeUpdateInterval = setInterval(function () {
        providerRef.updateTimecode();
      }, 1000 / (providerRef.componentRef.frameRate || 30) );
    })
  }

  public resetInit() {
    this.alreadyInited = false;
  }

  public initTimecodeEvents() {
    if (this.alreadyInited) {
      return
    }
    this.alreadyInited = true;
    let providerRef = this;
    this.updateTimecode();
    delete this.currentTimecodeEl;
    delete this.durationTimecodeEl;
    this.clearTimecodeUpdateInterval();

    setTimeout(() => {
      this.componentRef.player.on("play", () => {
        providerRef.startTimecodeUpdate();
        providerRef.componentRef.toggleAudioIcon(true);
      });
      this.componentRef.player.on("timeupdate", () => {
        providerRef.componentRef.toggleAudioIcon(true);
        if (!providerRef.timecodeUpdateInterval) {
          providerRef.updateTimecode(false);
        }
      });
      this.componentRef.player.on("pause", () => {
        clearInterval(providerRef.timecodeUpdateInterval);
        //providerRef.componentRef.toggleAudioIcon(false);
      });
      this.componentRef.player.on("seeking", (e) => {
        providerRef.updateTimecode();
      });
      this.componentRef.player.on("seeked", (e) => {
        providerRef.updateTimecode();
        providerRef.componentRef.player.posterImage.hide();
        if (providerRef.componentRef.player.waveform && providerRef.componentRef.type == ItemTypes.AUDIO && providerRef.helperProvider.doesBrowserSupportWebAudioAPI()) {
          providerRef.componentRef.player.waveform.surfer.backend.seekTo(providerRef.componentRef.player.currentTime());
          providerRef.componentRef.player.waveform.surfer.backend.play();
          providerRef.componentRef.player.waveform.surfer.backend.setVolume(0);
          providerRef.componentRef.player.trigger("play");
          providerRef.componentRef.player.waveform.surfer.drawer.progress(providerRef.componentRef.player.waveform.surfer.backend.getPlayedPercents());
        }
      });
    });
  }

  updateTimecode(emitChange: boolean = true, durationUpdate: boolean = false) {
    if (!($("video").length || $("audio").length )) {
      return;
    }
    this.currentTimecodeEl = this.currentTimecodeEl || $(this.componentRef.playerElement.nativeElement).find(".currentTimecode")[0];
    let needSetDuration = !this.durationTimecodeEl;
    this.durationTimecodeEl = this.durationTimecodeEl || $(this.componentRef.playerElement.nativeElement).find(".durationTimecode")[0];
    if (durationUpdate) {
        if (this.componentRef.type == ItemTypes.MEDIA || ( this.componentRef.type == ItemTypes.AUDIO && this.componentRef.getTvStandart() && this.componentRef.videoDetails.TimecodeFormat )) {
            this.durationTimecodeEl.innerHTML = this.timecodeProvider.getTimecodeString(this.componentRef.player.currentTime(), TimeCodeFormat[this.componentRef.videoDetails.TimecodeFormat], this.componentRef.som);
        } else if (this.componentRef.type == ItemTypes.AUDIO && (!this.componentRef.getTvStandart() || !this.componentRef.videoDetails.TimecodeFormat)) {
            this.durationTimecodeEl.innerHTML = this.timecodeProvider.getAudioTimeString(this.componentRef.player.currentTime(), this.componentRef.som);
        } else {
            this.durationTimecodeEl.innerHTML = this.timecodeProvider.getTimeString(this.componentRef.player.currentTime());
        }
    }
    if (this.componentRef.type == ItemTypes.MEDIA || ( this.componentRef.type == ItemTypes.AUDIO && this.componentRef.getTvStandart() && this.componentRef.videoDetails.TimecodeFormat )) {
      if (this.currentTimecodeEl) {
        let tcStr = this.timecodeProvider.getTimecodeString(this.componentRef.player.currentTime(), TimeCodeFormat[this.componentRef.videoDetails.TimecodeFormat], this.componentRef.som);
        let scBar = this.componentRef.player.controlBar.getChildById ? this.componentRef.player.controlBar.getChildById("sub_control_bar") : null;
        if (scBar) {
          scBar.getChildById("left_control_bar").getChildById('timeControl').setCurrentTime(tcStr);
        }
      }
      if (needSetDuration && this.durationTimecodeEl) {
        this.durationTimecodeEl.innerHTML = this.timecodeProvider.getTimecodeString(this.componentRef.player.duration(), TimeCodeFormat[this.componentRef.videoDetails.TimecodeFormat], this.componentRef.som);
      }
    } else if (this.componentRef.type == ItemTypes.AUDIO && (!this.componentRef.getTvStandart() || !this.componentRef.videoDetails.TimecodeFormat)) { // if no timecode format
      if (this.currentTimecodeEl) {
        let scBar = this.componentRef.player.controlBar.getChildById ? this.componentRef.player.controlBar.getChildById("sub_control_bar") : null;
        if (scBar) {
          scBar.getChildById("left_control_bar").getChildById('timeControl').setCurrentTime(this.timecodeProvider.getAudioTimeString(this.componentRef.player.currentTime(), this.componentRef.som));
        }
      }
      if (needSetDuration && this.durationTimecodeEl) {
        this.durationTimecodeEl.innerHTML = this.timecodeProvider.getAudioTimeString(this.componentRef.player.duration(), this.componentRef.som);
      }
    } else {
        if (this.currentTimecodeEl) {
            let scBar = this.componentRef.player.controlBar.getChildById ? this.componentRef.player.controlBar.getChildById("sub_control_bar") : null;
            if (scBar) {
                scBar.getChildById("left_control_bar").getChildById('timeControl').setCurrentTime(this.timecodeProvider.getTimeString(this.componentRef.player.currentTime()));
            }
        }
        if (needSetDuration && this.durationTimecodeEl) {
            this.durationTimecodeEl.innerHTML = this.timecodeProvider.getTimeString(this.componentRef.player.duration());
        }
    }
    if(this.componentRef.audioSrc) {
      if(this.componentRef.isPlaying) {
        this.componentRef.playAudio();
        if(!this.componentRef.player.muted()) {
          this.componentRef.player.muted(true);
        }
        if(this.componentRef.audioPlayer &&
          (this.componentRef.audioPlayer.currentTime + 1 < this.componentRef.player.currentTime() ||
            this.componentRef.audioPlayer.currentTime - 1 >  this.componentRef.player.currentTime())) {
          this.componentRef.audioPlayer.currentTime = this.componentRef.player.currentTime();
        }
      }
      else {
        if(this.componentRef.audioPlayer) {
          this.componentRef.pauseAudio();
          if(this.componentRef.audioPlayer.currentTime != this.componentRef.player.currentTime()) {
            this.componentRef.audioPlayer.currentTime = this.componentRef.player.currentTime();
          }
        }
      }
    }
  };


  public clearTimecodeUpdateInterval() {
    clearInterval(this.timecodeUpdateInterval);
    clearInterval((<any>window).timecodeUpdateInterval);
    delete this.timecodeUpdateInterval;
  }


}
