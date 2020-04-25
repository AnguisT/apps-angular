/**
 * Created by Sergey Trizna on 31.07.2017.
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {SilverlightProvider} from "../../providers/common/silverlight.provider";
import {LoggerData} from "../system/config/comps/global.settings/comps/logger/global.settings.logger.component";
import {SettingsGroupsService} from "../../services/system.config/settings.groups.service";
import {SplashProvider} from '../../providers/design/splash.provider';

@Component({
    selector: 'media-logger-job-silver',
    templateUrl: './tpl/index.html',
    styleUrls: ['./styles/index.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SilverlightProvider
    ]
})

export class MediaLoggerJobSilverComponent {
    @ViewChild("iframe") private iframeRef: any;
    @ViewChild("wrap") private wrap: any;
    @ViewChild('overlay') private overlay: any;
    id: number;
    url: string;
    private endpoint: string;
    private sub: any;

    constructor(private route: ActivatedRoute,
                private silver: SilverlightProvider,
                private location: Location,
                private cdr: ChangeDetectorRef,
                private settingsGroupsService: SettingsGroupsService,
                private splashProvider: SplashProvider) {
    }

    ngOnInit() {
        let self = this;
        this.settingsGroupsService.getSettingsGroupById(0, true).subscribe((res) => {
            if (res) {
                /*debugger*/
                ;
                let data = {
                    "ID": res.ID,
                    "NAME": res.NAME,
                    "DESCRIPTION": res.DESCRIPTION,
                    "TM_SETTINGS_KEYS": res.TM_SETTINGS_KEYS
                };
                let loggerData;
                if (data.TM_SETTINGS_KEYS) {
                    loggerData = data.TM_SETTINGS_KEYS.filter(el => el.KEY == "globallogger")[0];
                }
                if (loggerData) {
                    let mediaLoggerData = <LoggerData>JSON.parse(loggerData.DATA);
                    self.endpoint = mediaLoggerData.Url;
                    self.sub = self.route.params.subscribe(params => {
                        self.id = +params['id'];
                        self.url = self.getSrc();
                        self.cdr.markForCheck();
                    });
                }
            }
            self.splashProvider.onHideSpinner.emit();
        });
    }

    getSrc() {
        // http://192.168.90.39:888/Default.aspx?MediaLogger={mediaid}-TMDDBA-*.tmd02
        return this.endpoint + "/Default.aspx?MediaLoggerJob=" + this.id + "-TMDDBA-*.tmd02";
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    clickBack() {
        this.overlay.showWhole();
        setTimeout(() => {
            this.location.back();
        }, 600)
        // this.wrap.nativeElement.innerHTML = "";

        // this.wrap.nativeElement.innerText = "";
        // $(this.wrap.nativeElement).html('')

        // setTimeout(() => {
        //     debugger;
        //     this.iframeRef.nativeElement.innerHTML = "";
        // })
        // this.cdr.markForCheck();
        // this.cdr.detectChanges();
    }
}
