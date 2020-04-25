import {Injectable} from "@angular/core";
import {HelperProvider} from "./helper.provider";
import {TranslateService} from "ng2-translate";
import {IMFXHtmlPlayerComponent} from "../imfx.html.player";
import {AbstractPlayerProvider} from "./abstract.player.provider";

@Injectable()
export class SmoothStreamingProvider extends AbstractPlayerProvider {

  private MediaPlayer: any;
  private smoothStreamingPlayerInstance: any;

  constructor(private helperProvider: HelperProvider,
              private translate: TranslateService) {
    super();
    this.MediaPlayer = require('hasplayer.js/dist/hasplayer.js');
    let a = require('../overrides/hasplayer.text.track.override.js');
    this.MediaPlayer.utils.TextTrackExtensions = (<any>window)._TextTrackExtensions;
  }

  public initSmoothStreamingPlayer(src, playerId) {
    let providerRef = this;
    if (!this.helperProvider.doesBrowserSupportMediaSource()) {
      this.helperProvider.showPlayerError("MSE_MISSED", this.translate.instant("player.ss_not_supported"));
      return;
    }
    let video = $("video")[0];
    // let video = $('[data-imfx-id=' + 'imfx-video-' + this.componentRef.internalId + ']')[0];
    this.smoothStreamingPlayerInstance = new this.MediaPlayer(new this.MediaPlayer.di.Context());
    this.smoothStreamingPlayerInstance.init(video);
    this.smoothStreamingPlayerInstance.setAutoPlay(true);// if autoplay == false, player will not load metadata and will not show duration and first frame
    this.smoothStreamingPlayerInstance.setParams({
        "ManifestLoader.RetryAttempts": 0,
        "ManifestLoader.RetryInterval": 0,
        "backoffSeekToEnd": 0
    });
    this.smoothStreamingPlayerInstance.load({
      url: src
    });
    this.smoothStreamingPlayerInstance.eventBus.addEventListener("error", (err) => {
      if (err.data && err.data.code == "DOWNLOAD_ERR_MANIFEST") {
        this.helperProvider.showPlayerError("CORS_OR_NETWORK", err.data.data.url.split("/")[2]
          ? this.translate.instant("player.cors_or_network_error")
          : this.translate.instant("player.network_error"));
      }
    })
    this.componentRef.player.one("play", () => {
        providerRef.smoothStreamingPlayerInstance.stop();
        providerRef.componentRef.player.removeClass('vjs-has-started');
        // hidden it because it not working for clip editor
      //  providerRef.componentRef.player.pause();
      //   providerRef.componentRef.player.currentTime(0);
    });
  }

  public addTextAndAudiotracksIntoSSPlayer() {
    let player = this.componentRef.player;
    let videojs = this.componentRef.videojs;
    let providerRef = this;

    // clear tracks
    if (player.audioTracks().tracks_.length > 0) {
      let _tracks = player.audioTracks().tracks_;
      for (var i = _tracks.length - 1; i >= 0; i--) {
        player.audioTracks().removeTrack(_tracks[i]);
      }
    }

    // clear text tracks
    if (player.textTracks().tracks_.length > 0) {
      let _tracks = player.textTracks().tracks_;
      for (var i = _tracks.length - 1; i >= 0; i--) {
        player.textTracks().removeTrack_(_tracks[i]);
      }
    }

    // add new
    let audioTracks = this.smoothStreamingPlayerInstance.getTracks('audio');
    if (audioTracks && audioTracks.length > 0) {
      audioTracks.forEach((el, id) => {
        var track = new videojs.AudioTrack({
          id: el.id,
          kind: 'translation',
          label: el.id,
          language: el.lang
        });
        player.audioTracks().addTrack(track);
      });
    }

    // add new text track
    player.smoothTextTracks = this.smoothStreamingPlayerInstance.getTracks('text');
    if (player.smoothTextTracks && player.smoothTextTracks.length > 0) {
      player.smoothTextTracks.forEach((el, id) => {
        var t = player.addTextTrack('subtitles', el.lang, el.lang);
        el._id = t.id;
      });
    }
    var audioTrackList = player.audioTracks();

    // select first audiotrack
    if (audioTrackList.tracks_.length > 0) {
      audioTrackList.tracks_[0].enabled = true;
    }

    // Listen to the "change" event.
    audioTrackList.addEventListener('change', function () {
      for (var i = 0; i < audioTrackList.length; i++) {
        var track = audioTrackList[i];

        if (track.enabled) {
          // select audioTrack
          var audioTracks = providerRef.smoothStreamingPlayerInstance.getTracks('audio');
          var smoothTrack = audioTracks.filter(function (el) {
            return el.id == track.id;
          });
          if (smoothTrack.length > 0) {
            providerRef.smoothStreamingPlayerInstance.selectTrack('audio', smoothTrack[0]);
          }
          return;
        }
      }
    });

    var textTrackList = player.textTracks();

    // Listen to the "change" event.
    textTrackList.addEventListener('change', function () {
      for (var i = 0; i < textTrackList.length; i++) {
        var track = textTrackList[i];
        var activeSubs = false;

        if (track.mode == "showing") {
          activeSubs = true;
          var textTracks = player.smoothTextTracks;
          var smoothTrack = textTracks.filter(function (el) {
            return el._id == track.id
          });
          if (smoothTrack.length > 0) {
            providerRef.smoothStreamingPlayerInstance.selectTrack('text', smoothTrack[0]);
            providerRef.smoothStreamingPlayerInstance.enableSubtitles(true);
          }
          return;
        }
        if (!activeSubs) {
          providerRef.smoothStreamingPlayerInstance.enableSubtitles(false);
        }
      }
    });
    setTimeout(function() {
      let textTracksMenuItems = $('.vjs-custom-captions-button .vjs-menu-item');
      let len = textTracksMenuItems.length;
      for (i = 0; i < len; i++) {
        if (textTracksMenuItems[i].innerHTML.toLocaleLowerCase().indexOf('subtitles off') > -1) {
          $(textTracksMenuItems[i]).html(textTracksMenuItems[i].innerHTML.replace('subtitles off', 'Timed text off'));
        }
      }
    });
  }

}
