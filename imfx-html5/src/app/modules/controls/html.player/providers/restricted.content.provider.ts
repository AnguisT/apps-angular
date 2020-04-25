import {AbstractPlayerProvider} from "./abstract.player.provider";
import {HelperProvider} from "./helper.provider";
import {TranslateService} from "ng2-translate";
import {SmoothStreamingProvider} from "./smooth.streaming.provider";
import {Injectable} from "@angular/core";
import {SecurityService} from "../../../../services/security/security.service";
@Injectable()

export class RestrictedContentProvider extends AbstractPlayerProvider {

  constructor(private helperProvider: HelperProvider,
              private translate: TranslateService,
              private securityService: SecurityService,
              private smoothStreamingProvider: SmoothStreamingProvider) {
    super();
  }

  isRestricted() {
    if (this.securityService.hasPermissionByName("play_restricted_content")) {
      return false;
    }
    return this.componentRef.file && this.componentRef.file.MEDIA_STATUS == 1 && !(this.componentRef.src instanceof Array)
  }

  clearSource() {
    this.componentRef.src = null;
    setTimeout(()=>{
      $(".vjs-error-display").hide();
    });

  }

  showRestrictedPoster() {
    this.componentRef.player.poster("./assets/img/dpsinvert.png");
  }

}
