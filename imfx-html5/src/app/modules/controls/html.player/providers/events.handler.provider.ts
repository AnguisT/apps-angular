import {TimeCodeFormat, TMDTimecode} from "../../../../utils/tmd.timecode";
import {ItemTypes} from "../item.types";
import {Injectable} from "@angular/core";
import {AbstractPlayerProvider} from "./abstract.player.provider";
import {TimecodeProvider} from "./timecode.provider";
import {TimecodeControlsProvider} from "./timecode.controls.provider";
import {HelperProvider} from "./helper.provider";
import {ThumbnailsProvider} from "./thumbnails.provider";
import {SmoothStreamingProvider} from "./smooth.streaming.provider";
import {DetailService} from "../../../search/detail/services/detail.service";
import { MediaDetailMediaVideoResponse } from '../../../../models/media/detail/mediavideo/media.detail.mediavideo.response';

@Injectable()
export class EventsHandlerProvider extends AbstractPlayerProvider {

  private imfxloadedmediaFired: boolean;

  constructor(private helperProvider: HelperProvider,
              private timecodeProvider: TimecodeProvider,
              private timecodeControlsProvider: TimecodeControlsProvider,
              private detailService: DetailService,
              private smoothStreamingProvider: SmoothStreamingProvider,
              private thumbnailsProvider: ThumbnailsProvider) {
    super();
  }

  init() {
    this.imfxloadedmediaFired = false;
    let providerRef = this;

    if (this.componentRef.simpleMode) {
      this.showPlayer();
    } else {

      this.componentRef.player.on("timeupdate", () => {
        this.emitEvents();
      })

      this.componentRef.player.on("error", (e) => {
        setTimeout(() => providerRef.showPlayer(), 500);
      })

      this.componentRef.player.on('loadedmetadata', () => {
        providerRef.showPlayer();
        // multi source RCE, used in videojs.markers plugin
        if (this.imfxloadedmediaFired) {
          this.componentRef.player.trigger('imfxloadedmedia');
          this.imfxloadedmediaFired = true;
        }
      });

      this.componentRef.player.on(['waiting', 'pause'], function() {
        if(providerRef.componentRef)
          providerRef.componentRef.isPlaying = false;
        if(providerRef.componentRef.audioPlayer) {
          providerRef.componentRef.pauseAudio();
        }
      });

      this.componentRef.player.on('playing', function() {
        if(providerRef.componentRef)
          providerRef.componentRef.isPlaying = true;
      });

      this.componentRef.player.on('loadeddata', () => {
        console.log("i-mediaflex v3 player  > media item loaded: " + providerRef.componentRef.id);
        providerRef.preventVideoRightClick();
        providerRef.showPlayer();
        providerRef.getVideoInfo();
      });

    }
  }

  public getVideoInfo() {
    let providerRef = this;
    let isSmooth = false;
    if (providerRef.componentRef.src instanceof Array) {
      isSmooth = providerRef.helperProvider.checkFileType('ism', providerRef.componentRef.src[0].src);
    }
    else {
      isSmooth = providerRef.helperProvider.checkFileType('ism', providerRef.componentRef.src);
    }
    if (isSmooth) {
      //add audiotracks
      providerRef.smoothStreamingProvider.addTextAndAudiotracksIntoSSPlayer();
    }
    if (providerRef.componentRef.type == ItemTypes.MEDIA || providerRef.componentRef.type == ItemTypes.AUDIO) {
      if (providerRef.componentRef.src instanceof Array && (!providerRef.componentRef.isLive && !isSmooth)) {
        providerRef.detailService.getMediaSmudges((<Array<any>>providerRef.componentRef.src).map(el=>el.id)).subscribe(
          (resp) => {
            providerRef.thumbnailsProvider.addSegmentedThumbnails(resp);
            providerRef.setPlayerConstants();
            this.timecodeControlsProvider.initTimecodeEvents();
            providerRef.componentRef.isPlayerDataLoaded = true;
            providerRef.componentRef.playerReady.emit();
          });
      } else {
        if (providerRef.componentRef.externalDownload) {
          providerRef.setPlayerConstants();
          if (typeof this.componentRef.src == "string") { // do not add thumbnails for multisegments player // src: Array
            providerRef.thumbnailsProvider.addThumbnails(providerRef.componentRef.videoDetails);
          }
          this.timecodeControlsProvider.initTimecodeEvents();
        }
        else {
          providerRef.detailService.getVideoInfo(providerRef.componentRef.id, {
            smudge: providerRef.componentRef.type == ItemTypes.MEDIA,
            waveform: providerRef.componentRef.type == ItemTypes.AUDIO,
          }).subscribe(
            (resp: MediaDetailMediaVideoResponse) => {
              providerRef.componentRef.videoDetails = resp;
              providerRef.setPlayerConstants();
              if (typeof this.componentRef.src == "string") { // do not add thumbnails for multisegments player // src: Array
                providerRef.thumbnailsProvider.addThumbnails(resp);
              }
              this.timecodeControlsProvider.initTimecodeEvents();
              providerRef.componentRef.isPlayerDataLoaded = true;
              providerRef.componentRef.playerReady.emit();
            });
        }
      }
        new Promise((resolve, reject) => {
            resolve();
        }).then(
            () => {
                providerRef.componentRef.setResizeEvent();
            },
            (err) => {
                console.log(err);
            }
        );
      // setTimeout(() => providerRef.componentRef.setResizeEvent());
    } else {
      delete providerRef.componentRef.videoDetails;
        new Promise((resolve, reject) => {
            resolve();
        }).then(
            () => {
                this.timecodeControlsProvider.initTimecodeEvents();
            },
            (err) => {
                console.log(err);
            }
        );
      // setTimeout(() => this.timecodeControlsProvider.initTimecodeEvents());
    }
  }

  private setPlayerConstants() {
    this.componentRef.som = this.componentRef.ignoreSom
                              ? 0
                              : this.componentRef.videoDetails.FileSomMs
                                  ? this.componentRef.videoDetails.FileSomMs
                                  : 0;
    let timecodeFormat = TimeCodeFormat[this.componentRef.videoDetails.TimecodeFormat];
    let time = TMDTimecode.fromString(this.componentRef.videoDetails.SomMs, timecodeFormat).substract(TMDTimecode.fromMilliseconds(this.componentRef.som, timecodeFormat)).toSeconds();
    if ( time > 0) {
      this.componentRef.player.currentTime(time);
    }
    this.componentRef.frameRate = this.componentRef.videoDetails.frameRate = TMDTimecode.getFrameRate(TimeCodeFormat[this.componentRef.videoDetails.TimecodeFormat]).frameRate;
  }


  private showPlayer() {
    $('.player-wrapper').css('opacity', '1');
  }


  private preventVideoRightClick() {
    $('video').bind('contextmenu', function (e) {
      return false;
    });
  }


  private emitEvents() {
    if (this.componentRef.videoDetails) {
      let tcStr = this.timecodeProvider.getTimecodeString(this.componentRef.player.currentTime(), TimeCodeFormat[this.componentRef.videoDetails.TimecodeFormat], this.componentRef.som);
      this.componentRef.timecodeChange.emit(tcStr);
      this.componentRef.percentChange.emit(this.componentRef.player.currentTime() / this.componentRef.player.duration());
    }
  }


}
