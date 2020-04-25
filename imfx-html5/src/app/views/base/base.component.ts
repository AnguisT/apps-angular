import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Injector,
    NgZone,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import {LoginProvider} from '../login/providers/login.provider';
import {ThemesProvider} from '../../providers/design/themes.providers';
import {SplashProvider} from '../../providers/design/splash.provider';
import {TopMenuProvider} from '../../providers/design/topmenu.provider';
import {ConfigService} from '../../services/config/config.service';
import {ProfileService} from '../../services/profile/profile.service';


import {SettingsGroupsService} from '../../services/system.config/settings.groups.service';
import 'style-loader!bootstrap/dist/css/bootstrap.min.css';
import 'style-loader!font-awesome/css/font-awesome.css';
import 'style-loader!ag-grid/dist/styles/ag-grid.css';
import 'style-loader!ag-grid/dist/styles/theme-fresh.css';
import {LocalStorageService} from 'ng2-webstorage';
import {LoginService} from '../../services/login/login.service';

import {Icons} from '../../services/system.config/icons';
import {RaiseWorkflowWizzardProvider} from '../../modules/rw.wizard/providers/rw.wizard.provider';
import {ModalPreviewPlayerProvider} from '../../modules/modal.preview.player/providers/modal.preview.player.provider';
import {appRouter} from '../../constants/appRouter';
import {BaseProvider} from './providers/base.provider';
import {BaseUploadMenuComponent} from "./components/base.upload/base.upload.component";
import {UploadProvider} from "../../modules/upload/providers/upload.provider";

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [
        './styles/theme.scss',
        // './styles/splash.scss',
        './styles/index.scss',
        '../../../assets/icons/font-icons/icons.css',
    ],
    templateUrl: './tpl/index.html',
    // in the future just import them if dont want create new instance of them
    providers: [
        {provide: LoginProvider, useClass: LoginProvider},
        {provide: ThemesProvider, useClass: ThemesProvider},
        {provide: SplashProvider, useClass: SplashProvider},
        {provide: TopMenuProvider, useClass: TopMenuProvider},
        {provide: SettingsGroupsService, useClass: SettingsGroupsService},
        BaseProvider
    ]
})

export class BaseComponent {
    public uploadProvider: UploadProvider;
    // @ViewChild('loaderEl') private loaderElRef: ElementRef;
    @ViewChild('successModal') private successModalRef: ViewContainerRef;
    @ViewChild('errorModal') private errorModalRef: ViewContainerRef;
    @ViewChild('confirmModal') private confirmModalRef: ViewContainerRef;
    @ViewChild('promptModal') private promptModalRef: ViewContainerRef;
    @ViewChild('warningModal') private warningModalRef: ViewContainerRef;
    @ViewChild('modalPreviewPlayer') private modalPreviewPlayer: ViewContainerRef;
    @ViewChild('baseUploadMenu') private baseUploadMenuRef: BaseUploadMenuComponent;
    // @ViewChild('exportModal') private exportModal: IMFXModalComponent;
    @ViewChild('overlay') private overlay;
    private appVersion: string;
    private mainLogo: any = '';
    // Login settings
    private loginSettings: {
        isLogged: boolean,
        onLogin?: EventEmitter<any>,
        onLogout?: EventEmitter<any>
    } = {
        isLogged: false,
    };
    // Themes settings
    private themesSettings: {
        storagePrefix: string,
        theme_class: string,
        changed?: EventEmitter<any>,
        storageService?: any
    } = {
        storagePrefix: 'color_schema',
        theme_class: 'default' // or dark
    };
    // Splash settings
    private splashSettings: {
        enabled: boolean,
        // loaderElRef: ElementRef,
        changed?: EventEmitter<any>,
    } = {
        enabled: true,
        // loaderElRef: this.loaderElRef
    };
    // Top menu settings
    private topMenuSettings: {
        showSidebarMenu: boolean
    } = {
        showSidebarMenu: false
    };

    constructor(private loginProvider: LoginProvider,
                private loginService: LoginService,
                private themesProvider: ThemesProvider,
                private splashProvider: SplashProvider,
                private topMenuProvider: TopMenuProvider,
                private profileService: ProfileService,
                private localStorage: LocalStorageService,
                private injector: Injector,
                private rwwizardprovider: RaiseWorkflowWizzardProvider,
                private modalPreviewPlayerProvider: ModalPreviewPlayerProvider,
                private cdr: ChangeDetectorRef,
                private router: Router,
                private zone: NgZone,
                protected sgs: SettingsGroupsService,
                private baseProvider: BaseProvider
                // private cdr: ChangeDetectorRef
    ) {
        this.uploadProvider = this.injector.get(UploadProvider)
        if (this.loginProvider.loginService.isLoggedIn() === true) {
            this.profileService.retrieveDefaultPage();
        }

        // Login settings
        this.loginSettings = Object.assign({}, this.loginSettings, loginProvider);
        // On logout
        this.loginSettings.onLogout.subscribe((res?) => {
            this.loginSettings.isLogged = false;
            // end
            return this.router.navigate([appRouter.login]);
        });
        // On login
        this.loginSettings.onLogin.subscribe((res?) => {
            this.loginSettings.isLogged = true;
            this.afterLogin();
            if (res && res.redirectTo.length > 0) {
                return this.router.navigate([res.redirectTo]);
            }
        });

        // Get profile data on load
        if (this.loginSettings.isLogged) {
            this.profileService.getUserProfile().subscribe((res) => {
            });
        }

        // Themes settings
        this.themesSettings = Object.assign({}, themesProvider, this.themesSettings);
        if (this.loginSettings.isLogged) {
            let themeClass = this.themesSettings.storageService.retrieve([this.themesSettings.storagePrefix]).subscribe((res) => {
                if (res && res[0] && res[0].Value) {
                    this.themesSettings.theme_class = res[0].Value.replace(/["']/g, '')
                } else if (res && res[this.themesSettings.storagePrefix]) {
                    this.themesSettings.theme_class = res ? res[this.themesSettings.storagePrefix]
                        ? res[this.themesSettings.storagePrefix]
                            .replace(/\"/g, '') : 'default' : 'default';
                }
            });
        }
        this.themesProvider.changed.subscribe((res) => {
            this.themesSettings.theme_class = res;
            this.cdr.detectChanges();
        });

        // Top menu
        this.topMenuSettings = Object.assign({}, topMenuProvider, this.topMenuSettings);

        this.uploadProvider.filesAdded.subscribe((data) => {
            setTimeout(() => {
                this.cdr.detectChanges();
            });
        });
        this.sgs.logoChanged.subscribe((logo) => {
            this._getUserLogo();
            // this.mainLogo = Icons[logo];
        });
    }

    ngOnInit() {
        this.refreshStorages();
        this.appVersion = ConfigService.getAppVersion();
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
        return this.isBusyApp();
    }

    ngAfterViewInit() {
        // Modal settings
        // this.splashProvider.loaderElRef = this.loaderElRef;
        this.splashProvider.overlay = this.overlay;
        // <--- // set name and reference for your modal
        if (this.loginSettings.isLogged === true) {
            this.loginService.clearTargetPath();
            this._getUserLogo();
            this._bindModalsAfterLogin();
        }

        // remove started overlay
        $('#loadingoverlay-prebootstraping').remove();
    }

    afterLogin() {
        setTimeout(() => {
            this._getUserLogo();
            this._bindModalsAfterLogin();
        });
    }

    onRouterOutletActivate($event) {
        this.baseProvider.outletComponent = $event;
    }

    private refreshStorages() {
        let keysDictionary = {
            'tmd.clip.editor.mediadetails.saved.state': 3,
            'tmd.clip.editor.versiondetails.saved.state': 3,
            'tmd.clip.editor.saved.state': 3,
            'tmd.dashboard.saved.state': 2,
            'tmd.media.details.media.saved.state': 4,
            'tmd.media.details.audio.saved.state': 3,
            'tmd.media.details.default.saved.state': 2,
            'tmd.media.details.physicalitem.saved.state': 2,
            'tmd.media.details.subtile.saved.state': 2,
            'tmd.media.details.archive.saved.state': 2,
            'tmd.media.details.image.saved.state': 2,
            'tmd.media.details.doc.saved.state': 2,
            'tmd.medialogger.saved.state': 19,
            'tmd.version.details.media.saved.state': 2,
            'tmd.version.details.audio.saved.state': 2,
            'tmd.version.details.default.saved.state': 2,
            'tmd.version.details.physicalitem.saved.state': 2,
            'tmd.version.details.subtile.saved.state': 2,
            'tmd.version.details.archive.saved.state': 2,
            'tmd.version.details.image.saved.state': 2,
            'tmd.version.details.doc.saved.state': 2,
            'tmd.carrier.details.media.saved.state': 1,
            'tmd.carrier.details.audio.saved.state': 1,
            'tmd.carrier.details.default.saved.state': 1,
            'tmd.carrier.details.physicalitem.saved.state': 1,
            'tmd.carrier.details.subtile.saved.state': 1,
            'tmd.carrier.details.archive.saved.state': 1,
            'tmd.carrier.details.image.saved.state': 1,
            'tmd.carrier.details.doc.saved.state': 1,
            'tmd.title.details.media.saved.state': 1,
            'tmd.title.details.audio.saved.state': 1,
            'tmd.title.details.default.saved.state': 1,
            'tmd.title.details.physicalitem.saved.state': 1,
            'tmd.title.details.subtile.saved.state': 1,
            'tmd.title.details.archive.saved.state': 1,
            'tmd.title.details.image.saved.state': 1,
            'tmd.title.details.doc.saved.state': 1,
            'tmd.assessment.saved.state': 9,
            'angular-imfx-split-state': 2
        };
        let cleanerData = this.localStorage.retrieve('storage.cleaner');
        let self = this;

        if (cleanerData) {
            $.each(keysDictionary, function (key, value) {
                if ((cleanerData[key] && cleanerData[key] !== value) || (!cleanerData[key])) {
                    localStorage.removeItem(key);
                }
            });
            self.localStorage.store('storage.cleaner', keysDictionary);
        } else {
            this.localStorage.store('storage.cleaner', keysDictionary);
            $.each(keysDictionary, function (key, value) {
                localStorage.removeItem(key);
            });
        }
    }

    // preventHover() {
    //   $('.main-menu .dropdown').addClass('prevent-dropdown-hover');
    //   $('.main-menu .dropdown').hover(function(){
    //     $('.main-menu .dropdown').removeClass('prevent-dropdown-hover')
    //   });
    // }

    private isBusyApp(): boolean {
        return !this.uploadProvider.getUploadModelsByStates('waiting', 'progress').length;
    }

    private getOverlayColor(theme) {
        let color = '#EDF1F2';
        switch (theme) {
            case 'default':
                color = '#EDF1F2';
                break;
            case 'dark':
                color = '#34404A';
                break;
            default:
                break;
        }
        $('.loadingoverlay').css('background-color', color);
        return color;
    }

    private goHome() {
        console.log('default ' + this.loginService.getDefaultPage());
        this.router.navigate([this.loginService.getDefaultPage()]);
    }

    private _bindModalsAfterLogin() {
        this.modalPreviewPlayerProvider.previewModal = this.modalPreviewPlayer;
        this.uploadProvider.baseUploadMenuRef = this.baseUploadMenuRef;
    }

    private _getUserLogo() {
        this.mainLogo = '';
        this.sgs.getSettingsUserById('logoImage').subscribe((setups) => {
            if (setups && setups[0] && setups[0].DATA) {
                let logo = JSON.parse(setups[0].DATA).LogoImage;
                if (logo) {
                    this.mainLogo = Icons[logo];
                    $('#favicon').attr('href', this.mainLogo);
                }
            }
        });
    }
}
