/*
 * Angular 2 decorators and services
 */
import {ChangeDetectorRef, Inject, EventEmitter} from '@angular/core';
import {LoginService} from '../../../services/login/login.service';
import {SessionStorageService} from 'ng2-webstorage';
import {ConfigService} from '../../../services/config/config.service';
import {ActivatedRoute, Router} from "@angular/router";
export class LoginProvider {
    public isLogged = false;
    public onLogin: EventEmitter<any> = new EventEmitter<any>();
    public onLogout: EventEmitter<any> = new EventEmitter<any>();
    public showSidebarMenu = false;

    constructor(@Inject(LoginService) public loginService: LoginService,
                @Inject(ChangeDetectorRef) protected cdr: ChangeDetectorRef,
                @Inject(SessionStorageService) protected storageService: SessionStorageService,
                @Inject(ActivatedRoute) private route: ActivatedRoute) {
        // On 401 in any request mark the status application as not logged
        this.loginService.httpService.authFailed.subscribe(
            (res) => {
                this.logout(res);
            }
        );

        // On 200 in auth request mark the status application as is logged
        this.loginService.httpService.authSuccess.subscribe(
            (res) => {
                this.onLogin.emit(res);
            }
        );

        this.isLogged = this.loginService.isLoggedIn();
    }

    ngOnInit() {
        // get status of logged
        this.isLogged = this.loginService.isLoggedIn();
    }
    /**
     * Logout from application
     */
    logout(res = {}, isAuto: boolean = false): void {
        // if (!/login/.test(this.route.snapshot.url.join("/"))) {
        //   // setTimeout(()=>{
        //   //   window.location.reload()
        //   // })
        // }

        // Clear all data form current session
        this.loginService.clear();

        if(isAuto) {
          //this.onLogout.emit($.extend(true, {redirectTo: ConfigService.getSetupsForRoutes().loginauto}, res));
        }
        else {
          this.onLogout.emit($.extend(true, {redirectTo: ConfigService.getSetupsForRoutes().login}, res));
        }


        // setTimeout(()=>{
        //   window.location.reload()
        // })

    }

    /**
     * On success login
     */
    login(res): void {
        this.onLogin.emit(res);
    }

    /**
     * Return access token
     */
    getAccessToken(): string {
        return this.loginService.httpService.getAccessToken();
    }

    /**
     * Get refresh token
     */
    getRefreshToken():string {
        return this.loginService.httpService.getRefreshToken();
    }
}
