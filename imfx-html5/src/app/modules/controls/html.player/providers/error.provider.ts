import {AbstractPlayerProvider} from "./abstract.player.provider";
import {HelperProvider} from "./helper.provider";
import {TranslateService} from "ng2-translate";
import {SmoothStreamingProvider} from "./smooth.streaming.provider";
import {Injectable} from "@angular/core";
@Injectable()

export class ErrorProvider extends AbstractPlayerProvider {

  constructor(private helperProvider: HelperProvider,
              private translate: TranslateService,
              private smoothStreamingProvider: SmoothStreamingProvider) {
    super();
  }

  handleEmptySrc() {
    let originalCallback = this.componentRef.player.error;
    this.componentRef.player.error = (err)=> {
      if (err && err.code == 4) { // MEDIA_ELEMENT_ERROR: Empty src attribute
        console.log(err);
        return;
      }
      originalCallback.call(this.componentRef.player, err);
    }
  }

}
