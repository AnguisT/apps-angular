/**
 * Created by initr on 20.10.2016.
 */
import {
  Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output,
  EventEmitter, Inject, HostListener, NgZone, OnInit, AfterViewInit, OnChanges, OnDestroy, ViewChild, ElementRef
} from '@angular/core'
import {DatePipe} from "@angular/common";
import {DetailService} from "../../search/detail/services/detail.service";
import * as $ from "jquery";

import {ItemTypes} from "./item.types";
import {TMDTimecode, TimeCodeFormat} from "../../../utils/tmd.timecode";

import {ClipsProvider} from "./providers/clips.provider";


import "style-loader!jquery-ui-bundle/jquery-ui.min.css";
import "style-loader!jquery-ui-bundle/jquery-ui.structure.min.css";
import "style-loader!jquery-ui-bundle/jquery-ui.theme.min.css";
import "../timecode/libs/jquery.maskedinput.js";
import "jquery-ui-bundle/jquery-ui.min.js";
import {TranslateService} from "ng2-translate";
import {VideoJSCurrentTimeProvider} from "./providers/videojs.current.time.provider";
import {PluginsProvider} from "./providers/plugins.provider";
import {FormatProvider} from "./providers/format.provider";
import {SubtitlesProvider} from "./providers/subtitles.provider";
import {SubControlBarProvider} from "./providers/sub.control.bar.provider";
import {IMFXHtmlPlayerInterface} from "./imfx.html.player.interface";
import {ThumbnailsProvider} from "./providers/thumbnails.provider";
import {MarkersProvider} from "./providers/markers.provider";
import {TimecodeControlsProvider} from "./providers/timecode.controls.provider";
import {PosterProvider} from "./providers/poster.provider";
import {WaveformProvider} from "./providers/waveform.provider";
import {SmoothStreamingProvider} from "./providers/smooth.streaming.provider";
import {TextTracksProvider} from "./providers/text.tracks.provider";
import {ResizeProvider} from "./providers/resize.provider";
import {HelperProvider} from "./providers/helper.provider";
import {EventsHandlerProvider} from "./providers/events.handler.provider";
import {TimecodeProvider} from "./providers/timecode.provider";
import {AbstractPlayerProvider} from "./providers/abstract.player.provider";
import {ErrorProvider} from "./providers/error.provider";
import {LiveProvider} from "./providers/live.provider";
import {RestrictedContentProvider} from "./providers/restricted.content.provider";
import {FocusProvider} from "./providers/focus.provider";
import {HotkeysProvider} from "./providers/hotkeys.provider";
import {SegmentsProvider} from "./providers/segments.provider";
import {AudioSynchProvider} from "./providers/audio.synch.provider";



@Component({
  selector: 'html-player',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss',
    './styles/clipping.buttons.scss',
    './styles/videojs.thumbnails.scss',
    './styles/dist/video-js.min.css',
    './styles/player.progressbar.scss',
    './styles/big.play.button.scss',
    './styles/volume.menu.button.scss',
    './styles/playback.slider.scss',
    './styles/audio.subtitles.button.scss',
    './styles/fullscreen.button.scss',
    './styles/cinema.mode.button.scss',
    './styles/repeat.button.scss',
    './styles/overlay.button.scss',
    './styles/videojs.timecode.scss'
  ],
  providers: [
    DetailService,
    ClipsProvider,
    PosterProvider,
    VideoJSCurrentTimeProvider,
    FormatProvider,
    SubtitlesProvider,
    SubControlBarProvider,
    ThumbnailsProvider,
    SmoothStreamingProvider,
    EventsHandlerProvider,
    TextTracksProvider,
    WaveformProvider,
    ResizeProvider,
    MarkersProvider,
    HelperProvider,
    TimecodeControlsProvider,
    PluginsProvider,
    TimecodeProvider,
    ErrorProvider,
    FocusProvider,
    HotkeysProvider,
    LiveProvider,
    RestrictedContentProvider,
    SegmentsProvider,
    AudioSynchProvider
  ],
  host: {
    '(document:click)': 'focusProvider.onClick($event)',
    '(window:keydown)': 'hotkeysProvider.onKeyDown($event)'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class IMFXHtmlPlayerComponent implements IMFXHtmlPlayerInterface, OnInit, AfterViewInit, OnChanges, OnDestroy {
  player: any;
  audioPlayer: any;
  frameRate: number;
  videojs: any;
  currentTimecodeEl: Element;
  durationTimecodeEl: Element;
  videoDetails: any;
  som: any;
  timecodeUpdateInterval: any;
  isPlayerDataLoaded: boolean = false;

  public internalId = new Date().getTime() + '';

  @ViewChild('playerElement') public playerElement: ElementRef;

  @Input() src: string | Array<{id: number; src: string; seconds: number}> = '';
  @Input() type: number;
  @Input() id: number;
  @Input() typeDetails: String;
  @Input() subtitles = [];
  @Input() file: any;
  @Input() clipBtns: boolean = false;
  @Input() disabledClipBtns: boolean = false;
  @Input() clipBtnsCallback: any = null;
  @Input() simpleMode: boolean = false;
  @Input() autoPlay: boolean = false;
  @Input() cinemaMode: boolean = false;
  @Input() muted: boolean = false;
  @Input() simpleModeClass: boolean = true;
  @Input() ignoreSom: boolean = false;
  @Input() isLive: boolean = false;
  @Input() currentTime: number = 0;
  @Input() repeatMode: boolean = false;
  @Input() externalDownload: boolean = false; // for external loading player (silverlight)

  @Output() timecodeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() percentChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() playerReady: EventEmitter<number> = new EventEmitter<number>();
  @Output() clipAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() clipReplaced: EventEmitter<{
    oldClipId: any,
    newClip: any
  }> = new EventEmitter<{
    oldClipId: any,
    newClip: any
  }>();
  first = true;
  public isPlaying = false;
  public audioSrc: string | Array<{id: number; src: string; seconds: number}> = '';
  private onAudioPlaying = false;
  private onAudioPause = false;

  constructor(private cdr: ChangeDetectorRef,
              protected detailService: DetailService,
              @Inject(VideoJSCurrentTimeProvider) protected videojsCurrentTimeProvider: VideoJSCurrentTimeProvider,
              @Inject(FormatProvider) protected formatProvider: FormatProvider,
              @Inject(SubtitlesProvider) protected subtitlesProvider: SubtitlesProvider,
              @Inject(SubControlBarProvider) protected subControlBarProvider: SubControlBarProvider,
              @Inject(ThumbnailsProvider) protected thumbnailsProvider: ThumbnailsProvider,
              @Inject(SmoothStreamingProvider) protected smoothStreamingProvider: SmoothStreamingProvider,
              @Inject(PosterProvider) protected posterProvider: PosterProvider,
              @Inject(EventsHandlerProvider) protected eventsHandlerProvider: EventsHandlerProvider,
              @Inject(TextTracksProvider ) protected textTracksProvider : TextTracksProvider,
              @Inject(WaveformProvider) protected waveformProvider: WaveformProvider,
              @Inject(ResizeProvider) protected resizeProvider: ResizeProvider,
              @Inject(MarkersProvider) protected markersProvider: MarkersProvider,
              @Inject(ClipsProvider) protected clipsProvider: ClipsProvider,
              @Inject(HelperProvider) protected helperProvider: HelperProvider,
              @Inject(TimecodeControlsProvider) protected timecodeControlsProvider: TimecodeControlsProvider,
              @Inject(PluginsProvider) protected pluginsProvider: PluginsProvider,
              @Inject(ErrorProvider) protected errorProvider: ErrorProvider,
              @Inject(RestrictedContentProvider) protected restrictedContentProvider: RestrictedContentProvider,
              @Inject(FocusProvider) protected focusProvider: FocusProvider,
              @Inject(HotkeysProvider) protected hotkeysProvider: HotkeysProvider,
              @Inject(SegmentsProvider) protected segmentsProvider: SegmentsProvider,
              @Inject(AudioSynchProvider) public audioSynchProvider: AudioSynchProvider,
              @Inject(LiveProvider) protected liveProvider: LiveProvider) {
    this.audioSynchProvider.comp = this;
  }

  // Angular life cycle hooks

  ngOnInit() {
    this.requirePlugins();
    this.videojs = (<any>window).videojs;

    // init our custom providers
    for (var k in this) {
      if (<any>this[k] instanceof AbstractPlayerProvider) {
        (<any>this[k]).setComponentRef(this);
      }
    }
    if (this.file && this.file.ID) {
      this.internalId = this.file.ID + '-' + new Date().getTime();
    }
  }

  ngAfterViewInit() {
      new Promise((resolve, reject) => {
          resolve();
      }).then(
          () => {
              let self = this;
              (<any>window).imfxPlayer = this;
              this.viewInit();
              this.first = false;
              if (this.player) {
                  $(this.player.el_.parentElement).find('iframe')[0].onload = function() {
                      self.setResizeEvent();
                  };
              }
          },
          (err) => {
              console.log(err);
          }
      );
    // setTimeout(() => {
    //   let self = this;
    //   (<any>window).imfxPlayer = this;
    //   this.viewInit();
    //   this.first = false;
    //   if (this.player) {
    //     $(this.player.el_.parentElement).find('iframe')[0].onload = function() {
    //       self.setResizeEvent();
    //     };
    //   }
    // });
  }

  ngOnChanges() {
    if (this.first) {
      return;
    }
      new Promise((resolve, reject) => {
          resolve();
      }).then(
          () => {
              if (this.player) {
                  this.refresh();
              } else {
                  this.viewInit();
              }
          },
          (err) => {
              console.log(err);
          }
      );
    // setTimeout(() => {
    //   if (this.player) {
    //     this.refresh();
    //     // this.player.trigger('resetWaveform', this.type);
    //   } else {
    //     this.viewInit();
    //   }
    // });
  }

  public updateAudioSrc(src: string) {
      this.pauseAudio();
      this.audioSrc = src;
      this.onAudioPlaying = false;
      this.onAudioPause = false;
  }

  ngOnDestroy() {
    this.destroyPlayer();
  };


  private requirePlugins() {

    delete (<any>window).videojs;

    let c = require.cache;
    let b;

    b = require.resolve('video.js/dist/video.js'); delete c[b];
    require('video.js/dist/video.js');
    b = require.resolve('videojs-contrib-hls/dist/videojs-contrib-hls.js'); delete c[b];
    require('videojs-contrib-hls/dist/videojs-contrib-hls.js');
    b = require.resolve('./overrides/dash.all.debug.js'); delete c[b];
    require('./overrides/dash.all.debug.js');
    b = require.resolve('videojs-contrib-dash/dist/videojs-dash.js'); delete c[b];
    require('videojs-contrib-dash/dist/videojs-dash.js');
    b = require.resolve('./plugins/videojs.offset.js'); delete c[b];
    require('./plugins/videojs.offset.js');
    b = require.resolve('./plugins/videojs.markers'); delete c[b];
    require('./plugins/videojs.markers');
    b = require.resolve('videojs-markers/dist/videojs.markers.css'); delete c[b];
    require('videojs-markers/dist/videojs.markers.css');
    b = require.resolve('./plugins/videojs-framebyframe'); delete c[b];
    require('./plugins/videojs-framebyframe');
    if(!this.isLive) {
      b = require.resolve('./plugins/videojs.segment.js'); delete c[b];
      require('./plugins/videojs.segment.js');
    }
    b = require.resolve('./plugins/videojs.thumbnails'); delete c[b];
    require('./plugins/videojs.thumbnails');
    b = require.resolve('./plugins/videojs.wavesurfer'); delete c[b];
    require('./plugins/videojs.wavesurfer');
    b = require.resolve('./plugins/videojs.clippingButtons'); delete c[b];
    require('./plugins/videojs.clippingButtons');
    b = require.resolve('./plugins/videojs.big.play.button'); delete c[b];
    require('./plugins/videojs.big.play.button');
    b = require.resolve('./plugins/videojs.play.button'); delete c[b];
    require('./plugins/videojs.play.button');
    b = require.resolve('./plugins/videojs.volume.menu.button'); delete c[b];
    require('./plugins/videojs.volume.menu.button');
    b = require.resolve('./plugins/videojs.playback.slider.js'); delete c[b];
    require('./plugins/videojs.playback.slider.js');
    b = require.resolve('./plugins/videojs.timecode.control.js'); delete c[b];
    require('./plugins/videojs.timecode.control.js');
    b = require.resolve('./plugins/videojs.fullscreen.button.js'); delete c[b];
    require('./plugins/videojs.fullscreen.button.js');
    b = require.resolve('./plugins/videojs.subtitles.button.js'); delete c[b];
    require('./plugins/videojs.subtitles.button.js');
    b = require.resolve('./plugins/videojs.audio.button.js'); delete c[b];
    require('./plugins/videojs.audio.button.js');
    b = require.resolve('./plugins/videojs.cinema.mode.button.js'); delete c[b];
    require('./plugins/videojs.cinema.mode.button.js');
    b = require.resolve('./plugins/videojs.repeat.button.js'); delete c[b];
    require('./plugins/videojs.repeat.button.js');
    b = require.resolve('./plugins/videojs.overlay.button.js'); delete c[b];
    require('./plugins/videojs.overlay.button.js');
  }

  public playAudio() {
    if (this.audioPlayer.paused && !this.onAudioPlaying) {
      this.audioPlayer.play();
    }
  }

  public pauseAudio() {
    if (!this.audioPlayer.paused && !this.onAudioPause) {
      this.audioPlayer.pause();
    }
  }

  private viewInit() {
    if (this.restrictedContentProvider.isRestricted()) {
      this.restrictedContentProvider.clearSource()
    }
    // moved from ngOnChanges
    this.timecodeControlsProvider.clearTimecodeUpdateInterval();
    this.timecodeControlsProvider.resetInit();
    // --------
    let componentRef = this;

    if (!$('[data-imfx-id=' + 'imfx-video-' + this.internalId + ']')[0]) {
      return;
    }
    delete this.videojs.players['imfx-video-' + this.internalId];
    this.audioPlayer = $('[data-imfx-id=' + 'imfx-audio-' + this.internalId + ']')[0];

    $(this.audioPlayer).on('playing', function() {
      componentRef.onAudioPlaying = true;
      componentRef.onAudioPause = false;
    });

    $(this.audioPlayer).on('pause', function() {
      componentRef.onAudioPlaying = false;
      componentRef.onAudioPause = true;
    });
    $(this.audioPlayer).on('waiting', function() {
      componentRef.onAudioPlaying = false;
      componentRef.onAudioPause = true;
    });

    let plugins = this.pluginsProvider.getPlugins({
      clipBtns: this.clipBtns,
      cinemaMode: this.cinemaMode,
      disabledClipBtns: this.disabledClipBtns,
      clipBtnsCallback: this.clipBtnsCallback
    });
    this.videojsCurrentTimeProvider.init();
    componentRef.isPlayerDataLoaded = false;

    this.player = this.videojs("imfx-video-" + this.internalId, {
      html5: {
        dash: {
          setFastSwitchEnabled: true,
          setTrackSwitchModeFor: ['audio', 'alwaysReplace'],
        }
      },
      controlBar: {
        liveDisplay: false,
        currentTimeDisplay: false,
        timeDivider: false,
        durationDisplay: false,
        remainingTimeDisplay: false,
        volumeMenuButton: false,
        playToggle: false,
        fullscreenToggle: false,
        audioTrackButton: false,
        captionsButton: false,
        subtitles: false,
        chaptersButton: false,
        descriptionsButton: false,
        subtitlesButton: false,
        customControlSpacer: false,
        playbackRateMenuButton: false
      },
      inactivityTimeout: 0,
      controls: true,
      autoplay: this.autoPlay,
      preload: 'auto',
      muted: this.muted,
      bigPlayButton: false,
      poster: this.simpleMode ? '' : this.posterProvider.getPosterUrl(),
      textTrackSettings: true,
      loop: this.repeatMode,
      plugins: plugins
    }, function () {
      componentRef.subControlBarProvider.initSubControlBar();
      componentRef.formatProvider.handleVideoFormat();
      if (!this.simpleMode && componentRef.subtitles) {
        componentRef.subtitlesProvider.initSubtitles();
      }
      this.currentTime(componentRef.currentTime);
      // for hide big play button after progress click
      componentRef.player.controlBar.progressControl.one('mouseup', function(){
        componentRef.player.addClass('vjs-has-started');
      });
    });

    if (this.restrictedContentProvider.isRestricted()) {
      componentRef.restrictedContentProvider.showRestrictedPoster();
      return;
    }

    this.errorProvider.handleEmptySrc();
    this.eventsHandlerProvider.init();
    this.simpleMode || this.markersProvider.init();

    this.player.componentContext = this;
    if(this.isLive) {
      this.liveProvider.initLive();
    }
  };

  public toggleAudioIcon(show: boolean) {
    if(this.type == 150) {
      if ($('[data-imfx-id=' + 'imfx-video-' + this.internalId + ']')[0]) {
        let container = $('[data-imfx-id=' + 'imfx-video-' + this.internalId + ']')[0];
        if($(container).find('.imfx-audio-icon')[0]) {
          if(show && !$($(container).find('.imfx-audio-icon')[0]).is(":visible")) {
            $($(container).find('.imfx-audio-icon')[0]).show();
            this.cdr.detectChanges();
          }
          else if(!show && $($(container).find('.imfx-audio-icon')[0]).is(":visible")) {
            $($(container).find('.imfx-audio-icon')[0]).hide();
            this.cdr.detectChanges();
          }
        }
        else if(show) {
          $('<div class="imfx-audio-icon"><i class="icons-volume-high icon volume-high"></i></div>').insertAfter($(container).find('.vjs-poster'));
          this.cdr.detectChanges();
        }
      }

    }
  }

  // Implementation of public methods declared in IMFXHtmlPlayerInterface

  public setTimecode(tc: string) {
    if (this.isPlayerDataLoaded) {
      this.player.posterImage.hide();
      let som = this.videoDetails.FileSomMs ? this.videoDetails.FileSomMs : 0;
      let timecodeFormat = TimeCodeFormat[this.videoDetails.TimecodeFormat];
      let time = TMDTimecode.fromString(tc, timecodeFormat).substract(TMDTimecode.fromMilliseconds(this.som, timecodeFormat)).toSeconds();
      if(this.isLive) {
        this.liveProvider.onChangeRange(time);
      } else {
        console.log(time);
        this.player.currentTime(time);
      }
    }
  }

  public setPercent(percent: number) {
    this.player.posterImage.hide();
    this.player.currentTime(this.player.duration() * percent);
  }

  public setMarkers(o) {
    this.markersProvider.setMarkers(o);
  };
  // clear all markers from player
  public clearMarkers(clearAllPoints: false) {
    this.clipsProvider.clear(clearAllPoints);
  };
  public disableAllMarkersButtons() {
    this.clipsProvider.disableAllMarkersButtons();
  };

  public setResizeEvent() {
    this.resizeProvider.setResizeEvent();
  }


  private destroyPlayer() {
    if (this.player && this.player.el_) {
      this.player.muted(true);
      this.player.pause();
      this.player.surfer && this.player.surfer.pause();
      // this.player.dispose();
      delete this.videojs.players['imfx-video-' + this.internalId]
      this.isPlaying = false;
    }
    this.timecodeControlsProvider.clearTimecodeUpdateInterval();
  }

  public refresh() {
    let cinemaMode = this.player.cinemaMode;
    this.player.dispose();
    this.waveformProvider.destroy();
    $('#vjs-wrapper-' + this.internalId).append('<video id="imfx-video-' + this.internalId + '" data-imfx-id="imfx-video-' + this.internalId + '" class="video-js vjs-default-skin vjs-big-play-centered">' +
      '    <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>' +
      '  </video>')
    this.isPlaying = false;
    this.viewInit();
    this.player.cinemaMode = cinemaMode;
  }

  public getTvStandart() {
      return this.file.TV_STD;
  }


}
