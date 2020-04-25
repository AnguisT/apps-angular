import {Injectable} from "@angular/core";
import {IMFXHtmlPlayerComponent} from "../imfx.html.player";
import {AbstractPlayerProvider} from "./abstract.player.provider";

@Injectable()
export class SubtitlesProvider extends AbstractPlayerProvider {

  initSubtitles() {
    for (var track of this.componentRef.subtitles) {
      let tr = this.componentRef.player.addRemoteTextTrack({
        kind: 'subtitles',
        src: track.Url,
        //srclang: 'en',
        label: track.Language
      });
    }
  }
}
