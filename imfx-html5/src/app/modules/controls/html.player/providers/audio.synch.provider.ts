import { AbstractPlayerProvider } from './abstract.player.provider';
import { Injectable } from '@angular/core';
import { IMFXHtmlPlayerComponent } from '../imfx.html.player';
@Injectable()
export class AudioSynchProvider extends AbstractPlayerProvider {

  public comp: IMFXHtmlPlayerComponent;
  constructor() {
    super();
  }

  public updateAudioSrc(src: string) {
    this.comp.updateAudioSrc(src);
  }
}
