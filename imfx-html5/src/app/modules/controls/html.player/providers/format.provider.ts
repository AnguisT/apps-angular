import {AbstractPlayerProvider} from "./abstract.player.provider";
import {HelperProvider} from "./helper.provider";
import {TranslateService} from "ng2-translate";
import {SmoothStreamingProvider} from "./smooth.streaming.provider";
import {Injectable} from "@angular/core";
import {TimecodeControlsProvider} from "./timecode.controls.provider";
import {EventsHandlerProvider} from "./events.handler.provider";
import {TimeCodeFormat, TMDTimecode} from "../../../../utils/tmd.timecode";
@Injectable()

export class FormatProvider extends AbstractPlayerProvider {

  constructor(private helperProvider: HelperProvider,
              private translate: TranslateService,
              private timecodeControlsProvider: TimecodeControlsProvider,
              private eventsHandlerProvider: EventsHandlerProvider,
              private smoothStreamingProvider: SmoothStreamingProvider) {
    super();
  }

  handleVideoFormat() {
    let componentRefSRC = {};
    if (this.componentRef.src instanceof Array) {
        if (this.componentRef.src.length === 1) { // for media clip editor
            this.componentRef.player.src(this.componentRef.src[0].src);
        } else {
            this.componentRef.player.src(this.componentRef.src);
        }
      this.componentRef.videoDetails = this.componentRef.file;
      this.componentRef.videoDetails.FileSomMs = this.componentRef.ignoreSom
                                              ? 0
                                              :TMDTimecode.fromString(this.componentRef.file.SOM_text, TimeCodeFormat[this.componentRef.file.TimecodeFormat]).toSeconds() * 1000;
      if (this.componentRef.src[0] && this.componentRef.src[0].src == "") {
        this.timecodeControlsProvider.initTimecodeEvents();
        this.eventsHandlerProvider.getVideoInfo();
      }
      if (this.componentRef.src.length === 1) {
        componentRefSRC = this.componentRef.src[0].src;
      }
    } else {
      componentRefSRC = this.componentRef.src;
    }
    let srcOpts = {
      // type: "video/mp4",
      // type: "application/x-mpegURL",
      // type: 'application/dash+xml',
      // src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
      src: componentRefSRC
    };

    if (this.helperProvider.checkFileType('m3u8', componentRefSRC)) {
      (<any>srcOpts).type = "application/x-mpegURL";
    }

    if (this.helperProvider.checkFileType('mpd', componentRefSRC)) {
      if (!this.helperProvider.doesBrowserSupportMediaSource()) {
        this.helperProvider.showPlayerError ("MSE_MISSED", this.translate.instant("player.dash_not_supported"));
        return;
      }
      (<any>srcOpts).type = "application/dash+xml";
    }
    if (this.helperProvider.checkFileType('m3u8', componentRefSRC)) {
      if (!this.helperProvider.doesBrowserSupportMediaSource()) {
        this.helperProvider.showPlayerError ("MSE_MISSED", this.translate.instant("player.hls_not_supported"));
        return;
      }
    };
    if (this.helperProvider.isSmoothStreaming(componentRefSRC)) {
      setTimeout(() => {
        this.smoothStreamingProvider.initSmoothStreamingPlayer(componentRefSRC, "imfx-video-"+this.componentRef.internalId)
      });
    } else if (!this.componentRef.isLive) {
      this.componentRef.player.src(srcOpts);
      if (srcOpts && srcOpts.src === "") {
        this.timecodeControlsProvider.initTimecodeEvents();
      }
    }
  }

}
