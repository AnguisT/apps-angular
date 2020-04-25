import {Injectable} from "@angular/core";
import {IMFXHtmlPlayerComponent} from "../imfx.html.player";
import {AbstractPlayerProvider} from "./abstract.player.provider";

@Injectable()
export class TextTracksProvider extends AbstractPlayerProvider {

  resetTextTracks() {
    if (this.componentRef.player.textTracks().tracks_.length > 0) {
      let _tracks = this.componentRef.player.textTracks().tracks_;
      for (var i = _tracks.length - 1; i >= 0; i--) {
        this.componentRef.player.textTracks().removeTrack_(_tracks[i]);
      }
    }
  }

}
