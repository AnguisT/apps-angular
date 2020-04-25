import {ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation} from "@angular/core";
import {SettingsGroupsService} from "../../../../../../../services/system.config/settings.groups.service";
import {NotificationService} from "../../../../../../../modules/notification/services/notification.service";
import {ModalProvider} from "../../../../../../../modules/modal/providers/modal.provider";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

@Component({
    selector: 'global-settings-logger',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    entryComponents: [],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SettingsGroupsService
    ]
})

export class GlobalSettingsLoggerComponent implements OnInit {

    @ViewChild("loggerSettingsWrapper") private loggerSettingsWrapper;
    private data;
    private loggerData: LoggerData = {Url: "", MediaProxyLogger: ""};

    constructor(private cdr: ChangeDetectorRef,
                private settingsGroupsService: SettingsGroupsService,
                protected modalProvider: ModalProvider,
                private notificationRef: NotificationService) {
    };

    ngOnInit() {
        this.initLoggerSetting();
    }

    private getSetting(key) {
        if (this.data.TM_SETTINGS_KEYS) {
            return this.data.TM_SETTINGS_KEYS.filter(el => el.KEY == key)[0]
        }
    }

    initLoggerSetting() {
        let self = this;
        this.settingsGroupsService.getSettingsGroupById(0, true).subscribe((res) => {
            if (res) {
                /*debugger*/
                ;
                self.data = {
                    "ID": res.ID,
                    "NAME": res.NAME,
                    "DESCRIPTION": res.DESCRIPTION,
                    "TM_SETTINGS_KEYS": res.TM_SETTINGS_KEYS.map(el => {
                        el.EntityKey = null;
                        el.TM_SETTINGS_GROUPS = null;
                        el.TM_SETTINGS_GROUPSReference = null;
                        return el;
                    })
                };
                let loggerData = self.getSetting("globallogger");
                if (loggerData) {
                    self.loggerData = <LoggerData>JSON.parse(loggerData.DATA);
                }
            }
        });
    }

    SaveLoggerUrl() {
        let self = this;
        if (this.loggerData.Url.trim().length > 0) {
            this.cdr.detectChanges();
            if (this.getSetting("globallogger")) {
                this.data.TM_SETTINGS_KEYS.filter(el => el.KEY == "globallogger")[0].DATA = JSON.stringify(this.loggerData);
            } else {
                this.data.TM_SETTINGS_KEYS.push({
                    "KEY": "globallogger",
                    "DATA": JSON.stringify(this.loggerData),
                });
            }
            this.settingsGroupsService.saveSettingsGroup(this.data).subscribe(res => {
                self.notificationRef.notifyShow(1, "Parameters saved");
            });
        } else {
            self.notificationRef.notifyShow(2, "Empty endpoint url");
        }
    }
}

export class LoggerData {
    public Url: string = "";
    public MediaProxyLogger: string = "";
}
