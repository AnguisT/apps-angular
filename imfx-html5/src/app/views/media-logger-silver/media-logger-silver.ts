/**
 * Created by Sergey Trizna on 31.07.2017.
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {SilverlightProvider} from "../../providers/common/silverlight.provider";
import {SettingsGroupsService} from "../../services/system.config/settings.groups.service";
import {LoggerData} from "../system/config/comps/global.settings/comps/logger/global.settings.logger.component";
import {SplashProvider} from '../../providers/design/splash.provider';

@Component({
    selector: 'media-logger-silver',
    templateUrl: './tpl/index.html',
    styleUrls: ['./styles/index.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SilverlightProvider
    ]
})

export class MediaLoggerSilverComponent {
    id: number;
    url: string;
    private endpoint: string;
    private sub: any;
    @ViewChild('overlay') private overlay: any;

    constructor(private route: ActivatedRoute,
                private silver: SilverlightProvider,
                private cdr: ChangeDetectorRef,
                private location: Location,
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
        // this.sub = this.route.params.subscribe(params => {
        //     this.id = +params['id'];
        //     this.url = this.getSrc();
        // });
    }

    getSrc() {
        // http://192.168.90.39:888/Default.aspx?MediaLogger={mediaid}-TMDDBA-*.tmd02
        return this.endpoint + "/Default.aspx?MediaLogger="+this.id+"-TMDDBA-*.tmd02";

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    clickBack() {
        this.overlay.showWhole();
        setTimeout(() => {
            this.location.back();
        }, 600)
    }
}
