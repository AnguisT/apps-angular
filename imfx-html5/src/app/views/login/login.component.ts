import {ChangeDetectorRef, Component, ViewEncapsulation} from "@angular/core";
import {Location} from "@angular/common";
import {LoginService} from "../../services/login/login.service";
import {LoginProvider} from "./providers/login.provider";
import {ConfigService} from "../../services/config/config.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CapsLockProvider} from "../../providers/common/capslock.provider";
import {TranslateService} from "ng2-translate";
import {LocalStorageService} from "ng2-webstorage";
import {ProfileService} from "../../services/profile/profile.service";

@Component({
    encapsulation: ViewEncapsulation.None,
    moduleId: 'login',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    providers: [
        CapsLockProvider
    ]
})

export class LoginComponent {
    public loginForm: FormGroup;
    private appVersion: string;
    private currentYear: number;
    private isError: Boolean = false;
    private errorText: String;
    private disabledLoginBtn: boolean = false;
    private capsLockNotification: boolean = false;
    private loading: Boolean = false;
    private autologin: boolean = false;
    private defaultPageSubscription;

    constructor(private formBuilder: FormBuilder,
                private loginService: LoginService,
                private loginProvider: LoginProvider,
                private capsLockProvider: CapsLockProvider,
                private cdr: ChangeDetectorRef,
                private localStorage: LocalStorageService,
                private location: Location,
                private router: Router,
                private translate: TranslateService,
                private route: ActivatedRoute,
                private profileService: ProfileService) {
        // clear data about current session  (if the user was able to exit without /logout)
        if (this.loginProvider.loginService.isLoggedIn() === true) {
            this.doLogin();
        } else {
          this.route.queryParams.subscribe((res)=>{
            if(res['auto']!=undefined) {
              this.autologin = true;
              this.loginProvider.logout({redirectTo: 'login??auto'}, true);
            }
            else {
              this.autologin = false;
              this.loginProvider.logout({redirectTo: ''});
            }
          });

        }
        // this.doLogin();
    }

    ngOnInit() {
        // login form
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required], // tmddba
            password: ['', Validators.required], // *.tmd02
            rememberme: ['']
        });

        this.appVersion = ConfigService.getAppVersion();
        this.currentYear = new Date().getFullYear();
    }

    ngAfterViewInit() {
        this.disabledLoginBtn = !!(this.loginForm.value.username && this.loginForm.value.password);
        this.capsLockProvider.initCapsLockListener();
        this.capsLockProvider.onCapsLockEnable.subscribe((data) => {
            this.capsLockNotification = data.state;
        });
    }

    doLogin() {
        let compRef = this;
        this.defaultPageSubscription = this.profileService.defaultPage.subscribe((page) => {
            // this.router.navigate([page]);
            let path = this.loginService.getTargetPath(page);
            if (path) {
                if (compRef.defaultPageSubscription) {
                    compRef.defaultPageSubscription.unsubscribe();
                }
                console.log(path);
                this.router.navigate([path]);
                this.loginService.clearTargetPath();
            }
        });
        this.profileService.retrieveDefaultPage();
    }

    /**
     * Login method
     * @param event - event onSubmit
     * @param data - data form login form
     * @param isValid - is validity
     * @returns {boolean}
     */
    login(event, data, isValid) {
        event.preventDefault();
        if (!isValid) {
            return;
        }
        this.disabledLoginBtn = true;
        this.loading = true;
        // Request to login
        return this.loginService.login(data.username, data.password)
            .subscribe(
                (resp: any) => {
                    this.isError = false;
                    this.disabledLoginBtn = false;
                    this.doLogin();
                    return;
                },
                (error: any) => {
                    this.isError = true;
                    if (!error.statusText) {
                        this.disabledLoginBtn = false;
                        // throw Observable.throw('Empty response from server');
                        this.errorText = this.translate.instant("login.errorNetwork"); // 'Login failed: check you network connection';
                    } else {
                        this.disabledLoginBtn = false;

                        let errJson = error.json();
                        let errDescr = errJson.error_description;
                        if (errDescr) {
                            this.errorText = errDescr;
                        } else {
                            this.errorText = this.translate.instant("login.errorUnknown");
                        }
                    }
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            );
    }

    ngOnDestroy() {
        this.capsLockProvider.destroyCapsLockListener();
    }
}
