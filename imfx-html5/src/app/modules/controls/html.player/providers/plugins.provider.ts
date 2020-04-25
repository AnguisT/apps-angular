import { ClipsProvider } from './clips.provider';
import { AbstractPlayerProvider } from './abstract.player.provider';
import { ItemTypes } from '../item.types';
import { Injectable } from '@angular/core';
import { HelperProvider } from './helper.provider';
import { TranslateService } from 'ng2-translate';
import { IMFXHtmlPlayerComponent } from '../imfx.html.player';
import {RestrictedContentProvider} from "./restricted.content.provider";

@Injectable()
export class PluginsProvider extends AbstractPlayerProvider{

  constructor(private helperProvider: HelperProvider,
              private clipProvider: ClipsProvider,
              private restrictedContentProvider: RestrictedContentProvider,
              private translate: TranslateService) {
    super();
  }

  public setComponentRef(ref: IMFXHtmlPlayerComponent) {
    super.setComponentRef(ref);
    this.clipProvider.moduleContext = this.componentRef;
  }

  public getPlugins(o: {
    clipBtns: boolean,
    cinemaMode: any,
    disabledClipBtns?: boolean,
    clipBtnsCallback?: any
  }) {
    if (this.componentRef.simpleMode && !this.componentRef.isLive || this.restrictedContentProvider.isRestricted())
      return {
        segment: {},
        bigplaybutton: {
          title: this.translate.instant('player.play')
        }
      };

    let plugins = this.getDefaultPluginsConfig();
    // if (this.componentRef.type == ItemTypes.AUDIO && this.helperProvider.doesBrowserSupportWebAudioAPI()) {
    //   plugins = Object.assign(plugins, {
    //     wavesurfer: this.getWavesurferConfig()
    //   });
    // }

    if (o.clipBtns) {
      plugins = Object.assign(plugins, {
        clippingbuttons: this.getClipsButtons(o.disabledClipBtns, o.clipBtnsCallback)
      });
    }

    if (o.cinemaMode) {
      plugins = Object.assign(plugins, {
        cinemamodebutton: Object.assign(o.cinemaMode, {
          cinemaModeTitle: this.translate.instant('player.cinemamode'),
          nonCinemaModeTitle: this.translate.instant('player.non_cinemamode')
        })
      });
    }
    return plugins;
  }

  private getDefaultPluginsConfig() {
    let plugins =  {
      bigplaybutton: {
        title: this.translate.instant('player.play')
      },
      playbutton: {
        pauseTitle: this.translate.instant('player.pause'),
        playTitle: this.translate.instant('player.play')
      },
      volumemenubutton: {
        muteTitle: this.translate.instant('player.mute'),
        unmuteTitle: this.translate.instant('player.unmute')
      },
      timecodecontrol: {},
      offset: {
        start: 0, // Start offset in seconds
        // end: 40,    //End offset in seconds
        // restart_beginning: false //Should the video go to the beginning when it ends
      },
      playbackSlider: {
        getFps: ()=>this.componentRef.frameRate,
        addfbfClass: 'fbf-smudge',
        stepsBack: [
          {
            icon: 'step-start',
            text: this.translate.instant("player.start"),
            step: "start"
          },
          {
            icon: 'step-backward-1',
            text: this.translate.instant("player.one_second_back"),
            step: "second-backward"
          },
          {
            icon: 'step-backward-2',
            text: this.translate.instant("player.one_frame_back"),
            step: -1
          }
        ],
        stepsForward: [
          {
            icon: 'step-forward-2',
            text: this.translate.instant("player.one_frame_forward"),
            step: 1
          },
          {
            icon: 'step-forward-1',
            text: this.translate.instant("player.one_second_forward"),
            step: "second-forward"
          },
          {
            icon: 'step-end',
            text: this.translate.instant("player.end"),
            step: "end"
          }
        ]
      },
      repeatbutton: {
        repeatTitle: this.translate.instant('player.repeat'),
      },
      fullscreenbutton: {
        fullscreenTitle: this.translate.instant('player.fullscreen'),
        nonFullscreenTitle: this.translate.instant('player.non_fullscreen')
      },
      audiotrackbutton: {
        title: this.translate.instant('player.audiotracks')
      },
      // subtitlesbutton: {},
      subtitlesbutton: {
        title: this.translate.instant('player.closed_captions'),
        titleCCOff: this.translate.instant('player.closed_captions_off')
      },
      overlaybutton:  (this.componentRef.type == ItemTypes.AUDIO) ? false : {
        title: this.translate.instant('player.overlay')
      }
    };
    if (!this.componentRef.isLive) {
      (<any>plugins).segment = {};
    }
    return plugins;
  }

  private getWavesurferConfig() {
    return {
      src: this.componentRef.src,
      msDisplayMax: 10,
      debug: false,
      waveColor: 'grey',
      progressColor: 'black',
      cursorColor: 'black',
      hideScrollbar: true
    }
  }

  private getClipsButtons(disabledBtns, callback?) {
    let btns = [
        {
          text: "Mark In",
          onClick: this.clipProvider.setIn,
          id: "markin",
          disabled: disabledBtns || false
        },
        {
          text: "Mark Out",
          onClick: this.clipProvider.setOut,
          id: "markout",
          disabled: disabledBtns || true
        },
        {
          text: "Mark Frame",
          onClick: this.clipProvider.markframe,
          id: "markframe",
          disabled: disabledBtns || false
        },
        {
          text: "Add",
          onClick: this.clipProvider.add,
          id: "addclip",
          disabled: disabledBtns || true
        },
        {
          text: "Replace",
          onClick: this.clipProvider.add,
          id: "replaceclip",
          disabled: disabledBtns || true
        },
        {
          text: "Go To In",
          onClick: this.clipProvider.goToIn,
          id: "gotoin",
          disabled: disabledBtns || false
        },
        {
          text: "Go To Out",
          onClick: this.clipProvider.goToOut,
          id: "gotoout",
          disabled: disabledBtns || true
        },
        {
          text: "Clear",
          onClick: this.clipProvider.clear,
          id: "clearclip",
          disabled: disabledBtns || true
        }
      ];
    callback && (btns = callback.call(this, btns));
    return {btns: btns};
  }
}
