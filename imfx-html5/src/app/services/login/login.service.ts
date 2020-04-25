/**
 * Created by initr on 18.10.2016.
 */
import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { ProfileService } from '../profile/profile.service';
import { Observable, Subscription } from 'rxjs';
import { Response } from '@angular/http';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { ConfigService } from '../../../app/services/config/config.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
declare var window: any;

import * as Cookies from 'js-cookie';
/**
 * Service for authorization control of user
 */
@Injectable()
export class LoginService {
    // Flag of logged
    private loggedIn = false;
    private storagePrefix: string = 'auth.data';
    private targetPath: string;
    private defaultPage: string;
    private defaultPageSubscription;

    constructor(public httpService: HttpService,
                public profileService: ProfileService,
                public localStorage: LocalStorageService,
                public sessionStorage: SessionStorageService) {
        this.profileService.defaultPage.subscribe((page) => {
            this.defaultPage = page;
        });
        // this.defaultPageSubscription = this.profileService.defaultPage.subscribe((page)=>{
        //   this.targetPath = page;
        //   this.defaultPageSubscription.unsubscribe();
        // })
    }

    /**
     * Login auth
     *
     * @param username
     * @param password
     * @returns {Observable<Response>}
     */
    login(username, password): Observable<Subscription> {
        return Observable.create((observer) => {
                this.httpService
                    .auth(
                        '/token',
                        username,
                        password
                    )
                    .map((res) => {
                        return res.json();
                    })
                    .subscribe(
                        (authResp) => {
                            this.setAuthData(authResp);
                            this.httpService.setAccessToken(authResp.access_token);
                            this.httpService.setRefreshToken(authResp.refresh_token);
                            // user profile is contains access rules
                            // therefore better to load it at once after login
                            this.profileService.getUserProfile().subscribe(
                                (profileResp) => { // data cached in service
                                    this.loggedIn = true;
                                    this.httpService.authSuccess.emit();

                                    observer.next({
                                        authReps: authResp,
                                        profileResp: profileResp,
                                        targetRoute: ''
                                    });
                                },
                                (error) => {
                                    observer.error(error);
                                });
                        },
                        (error) => {
                            observer.error(error);
                        }
                    );
            }
        );
    }

    /**
     * Return data about auth
     * @returns {any|{}}
     */
    getAuthData(): Object {
        let jsstr = Cookies.get('auth_data');
        if (jsstr) {
            return JSON.parse(jsstr);
        } else {
            return {};
        }
        // return this.sessionStorage.retrieve(this.storagePrefix) || {};

    }


    setAuthData(authResp) {
        Cookies.set('auth_data', JSON.stringify(authResp), { expires: 1 });
        // this.sessionStorage.store(this.storagePrefix, authResp);
    }

    /**
     * Clear all data from current session
     */
    clear(): void {
        // Delete all
        Cookies.remove('auth_data');
        Cookies.remove('permissions');
        this.httpService.deleteAllTokens();

        // Clear all timeouts/timeintervals
        let lastTimeHandler = window.setTimeout(function () {
        }, 0);
        while (lastTimeHandler--) {
            // will do nothing if no timeout with id is present
            window.clearTimeout(lastTimeHandler);
        }

        this.sessionStorage.clear();
        this.loggedIn = false;
    }

    /**
     * Get authorization status
     * @returns {boolean}
     */
    isLoggedIn(): boolean {
        let res = false;
        if(this.httpService.getAccessToken()){
            res = true
        } else {
            // console.error('!!! Access token from cookie is empty !!!');
            // debugger
        }

        return res;
    }

    /**
     * Store target route for redirect to it after login if this  route is not reserved;
     * Else set main page as targetPath
     * @param path
     */
    setTargetPath(path: string): void {
        let routes = ConfigService.getSetupsForRoutes();
        if (path) {
            let reservedPages = [];
            reservedPages.push(routes.login); // login
            reservedPages.push(routes.logout); // logout
            reservedPages.push(routes.noAccess); // noAccess
            if (reservedPages.indexOf(path) === -1) {
                this.targetPath = path;
            }
        }
    }

    /**
     * Return target path
     * @returns {string}
     */
    getTargetPath(defaultPage?): string {
        if (defaultPage) {
            this.defaultPage = defaultPage;
        }
        return this.targetPath || this.defaultPage;
    }

    getDefaultPage(): string {
        return this.defaultPage;
    }

    clearTargetPath() {
        this.targetPath = '';
    }
}
