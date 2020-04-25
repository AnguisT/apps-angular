import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {ConfigService} from "../../../services/config/config.service";
import {IMFXHtmlPlayerComponent} from "../../controls/html.player/imfx.html.player";
import {SecurityService} from "../../../services/security/security.service";
import {ProfileService} from "../../../services/profile/profile.service";

@Component({
    selector: 'thumb-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbComponent {
    @ViewChild('thumbPlayer') player: IMFXHtmlPlayerComponent;
    @ViewChild('thumbWrapper') thumbWrapper: any;
    private params: any;
    private url: string;
    private proxyUrl: string;
    private playable: boolean;
    private isVideo: boolean;
    private hoverOnThumb: boolean = false;
    private start_hover: boolean = false;
    private currentVideoTime: number = 0;
    private initedFlag: boolean = false;
    private onHoverFlag: boolean = false;
    private muted = false;
    private personalSubscription;
    @Input() disablePlayer: boolean = false;

    @Input('params') set setParams(params) {
        if (params instanceof Object) {
            this.params = $.extend(true, this.params, params);
        }
        else {
            this.params = {
                value: params
            };
        }
    }

    constructor(private cdr: ChangeDetectorRef,
                private profileService: ProfileService,
                private securityService: SecurityService) {
    };

    ngOnInit() {
        this.url = this.params.value || this.params.THUMBURL ||
        (this.params.data && this.params.data['THUMBURL']) || './assets/img/default-thumb.PNG';
        if (!this.params.value && this.params.data && (this.params.data['THUMBID'] && this.params.data['THUMBID'] != -1)) {
            // if (this.params.data['THUMBID'] != -1) {}
            this.url = ConfigService.getAppApiUrl() + '/getfile.aspx?id=' + this.params.data['THUMBID'];
        }
        if (this.url.indexOf('id=-1') !== -1) {
            this.url = './assets/img/default-thumb.PNG';
        }
        this.thumbInit(this.params.data || this.params);
    }

    // called on init
    public thumbInit(params: any): void {
        this.initedFlag = false;
        if ((!this.securityService.hasPermissionByName("play_restricted_content")
            && params && params.MEDIA_STATUS == 1) || this.disablePlayer) {
            this.playable = false;
            return;
        }

        $(this.thumbWrapper.nativeElement).on('mouseenter', this, this.onmouseenter);
        $(this.thumbWrapper.nativeElement).on('mouseleave', this, this.onmouseleave);
        this.params = params;
        if (!this.params)
            return;
        this.proxyUrl = this.params.PROXY_URL || this.params.ProxyUrl;
        if (this.proxyUrl && this.proxyUrl.length > 0 && this.proxyUrl.match(/^(http|https):\/\//g) && this.proxyUrl.match(/^(http|https):\/\//g).length > 0) {
            this.playable = true;
        }
        let uA = window.navigator.userAgent,
            isIE = /msie\s|trident\/|edge\//i.test(uA);
        if (this.params && this.params['MEDIA_FORMAT_text'] == 'WEBM' && isIE) {
            this.playable = false;
        }

        if (this.params && (this.params['MediaTypeOriginal'] == undefined || this.params['MediaTypeOriginal'] == 100 || this.params['MediaTypeOriginal'] == 150)) {
            this.isVideo = true;
        }
    }

    ngOnDestroy() {

    }

    onmouseenter(event): void {
      let comp = event.data;
      if (comp) {
        comp.start_hover = true;
        comp.profileService.GetPersonal().subscribe((res) => {
          if (res) {
            comp.muted = res['Mute'];
          }
          if (comp.initedFlag === false) {
            comp.initedFlag = true;
          }
          if (comp) {
            if (comp.start_hover) {
              comp.hoverOnThumb = true;
              comp.cdr.markForCheck();
              if (comp.player && comp.player.player) {
                setTimeout(() => { comp.player.resizeProvider.onResize(); }, 0);
                // comp.player.player.play();
              }
            }
          }
        });
      }
    };

    onmouseleave(event): void {
        let comp = event.data;
        if (comp) {
            if (comp.player && comp.player.player) {

                comp.player.player.muted(true);
                comp.player.player.pause();
                if (comp.player.player.duration() !== comp.player.player.currentTime()) {
                    comp.currentVideoTime = comp.player.player.currentTime();
                }
                else {
                    comp.currentVideoTime = 0;
                }
            }
            comp.hoverOnThumb = false;
            comp.start_hover = false;
            comp.cdr.markForCheck();
        }
    };
}
