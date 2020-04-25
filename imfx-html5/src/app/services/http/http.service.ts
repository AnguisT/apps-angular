/**
 * Created by initr on 26.10.2016.
 */
import { EventEmitter, Injectable } from '@angular/core';
import {
    Headers,
    Http,
    Request,
    RequestMethod,
    RequestOptions,
    RequestOptionsArgs,
    Response,
    ResponseContentType,
    URLSearchParams
} from '@angular/http';

import { ConfigService } from '../config/config.service';
import * as Rx from 'rxjs';
import { ErrorManager } from '../../../app/modules/error/error.manager';
import { NetworkError } from '../../modules/error/models/network.error';
import { ArrayProvider } from '../../providers/common/array.provider';
import * as Cookies from 'js-cookie';
// error manager

export enum Action { QueryStart, QueryStop }

@Injectable()
export class HttpService {
    process: EventEmitter<any> = new EventEmitter<any>();
    authFailed: EventEmitter<any> = new EventEmitter<any>();
    authSuccess: EventEmitter<any> = new EventEmitter<any>();
    baseUrl = ConfigService.getAppApiUrl();
    errorMessage: boolean;
    private notShowErrorForItRoutes = [
        'token',
        'MediaOrder',
        'user-preferences',
        'export'
    ];

    constructor(public _http: Http,
                private errorManager: ErrorManager,
                private arrayProvier: ArrayProvider) {
    }

    public auth(url: string, username: string,
                password: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
        let body = 'username=' + username + '&password=' + password;

        return this._request(RequestMethod.Post, url, body, options, {'specialType': 'auth'});
    }

    public get(url: string, options?: RequestOptionsArgs,
        specialOptions = {}): Rx.Observable<Response> {

        return this._request(RequestMethod.Get, url, null, options, specialOptions);
    }

    public post(url: string, body: string, options?: RequestOptionsArgs,
        specialOptions = {}, errorMessage = true): Rx.Observable<Response> {
        this.errorMessage = errorMessage;
        return this._request(RequestMethod.Post, url, body, options, specialOptions);
    }

    public put(url: string, body: string, options?: RequestOptionsArgs,
        specialOptions = {}): Rx.Observable<Response> {
        return this._request(RequestMethod.Put, url, body, options, specialOptions);
    }

    public remove(url: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
        return this._request(RequestMethod.Delete, url, null, options);
    }

    public patch(url: string, body: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
        return this._request(RequestMethod.Patch, url, body, options);
    }

    public head(url: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
        return this._request(RequestMethod.Head, url, null, options);
    }

    public getBlob(url: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Get, url, null, {responseType: ResponseContentType.Blob})
            .map(response => (<Response>response).blob());
    }

    public refreshToken(url: string = '/token', refreshToken: string = this.getRefreshToken(),
        options?: RequestOptionsArgs): Rx.Observable<Response> {
        let body = 'refresh_token=' + refreshToken;

        return this._request(RequestMethod.Post, url, body, options,
            {'specialType': 'refreshToken'});
    }

    public getBaseUrl(): string {
        return this.baseUrl;
    }

    public setRefreshToken(refreshToken: string): void {
        Cookies.set('refresh_token', refreshToken, { expires: 1 });
    }


    public setAccessToken(accessToken: string): void {
        Cookies.set('access_token', accessToken, { expires: 1 });
    }

    public deleteAllTokens(): void {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
    }

    public getAccessToken(): string {
      return Cookies.get('access_token');
    }

    public getRefreshToken(): string {
      return Cookies.get('refresh_token');
    }

    private updateAllTokens(res: any): void {
        this.setRefreshToken(res.refresh_token);
        this.setAccessToken(res.access_token);
    }

    private _request(method: RequestMethod, url: string,
                    body?: string, options?: RequestOptionsArgs,
                    specialOptions: any = {isRelativeURL: true}): Rx.Observable<Response> {
        let so = Object.assign({}, {isRelativeURL: true}, specialOptions);
        // let authData = JSON.parse(Cookie.get('auth_data'));
        let accessToken = this.getAccessToken();
        let requestOptions = new RequestOptions(Object.assign({
            method: method,
            url: so.isRelativeURL === true ? this.baseUrl + url : url,
            body: body
        }, options));

        if (!requestOptions.headers) {
            requestOptions.headers = new Headers();
        }
        if (!requestOptions.headers.get('Content-Type')) {
            requestOptions.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        }

        // Custom TMD type
        requestOptions.headers.set('Accept', 'application/vnd.tmd.mediaflex.api+json;version=1');

        if (specialOptions.specialType) {
            if (so.specialType === 'auth') {
                requestOptions.body += '&grant_type=password';
            } else if (so.specialType === 'refreshToken') {
                requestOptions.body += '&grant_type=refresh_token';
            }
        } else {
            requestOptions.headers.set('Authorization', 'Bearer ' + accessToken);
        }

        if (!requestOptions.params) {
            requestOptions.params = new URLSearchParams();
        }

        requestOptions.params.set('_dc', new Date().getTime().toString());

        let self = this;

        return Rx.Observable.create((observer) => {
                this.process.next(Action.QueryStart);
                this._http.request(new Request(requestOptions))
                // .map(res=> res.json())
                    .finally(() => {
                        this.process.next(Action.QueryStop);
                    })
                    .subscribe(
                        (res) => {
                            // if (specialType == 'auth') {
                            //     // this.authSuccess.next(res);
                            // } else if (specialType != 'refreshToken') {
                            //     // this.refreshToken().subscribe(
                            //     //     (data) => {
                            //     //         /*debugger*/
                            //     //     },
                            //     //     (err) => {
                            //     //         /*debugger*/;
                            //     //     }
                            //     // );
                            // }
                            observer.next(res);
                            observer.complete();
                        },
                        (err) => {
                            // this.authFailed.next(err);
                            // observer.error(err);

                            // throw error to user interface
                            switch (err.status) {
                                case 401:
                                    // intercept 401
                                    this.authFailed.next(err);
                                    observer.error(err);
                                    break;
                                case 400:
                                    // intercept 400
                                    observer.error(err);
                                    // prevent show network error,
                                    // need to handle it inside the component
                                    return;
                                default:
                                    observer.error(err);
                                    break;
                            }


                            setTimeout(() => {
                                if (self.errorMessage) {
                                    let showErr = true;
                                    if(err.url){
                                        let urll = err.url.replace(/\?(.*)/, '');
                                        let paths = urll.split('/');
                                        let uris = paths.splice(3);

                                        $.each(self.notShowErrorForItRoutes, (k, routeItem) => {
                                            if (self.arrayProvier.inArray(uris, routeItem)) {
                                                showErr = false;
                                                return false;
                                            }
                                        });
                                    }

                                    if (showErr) {
                                        let error = new NetworkError();
                                        error.setOriginalError(err);
                                        error.setRequest(requestOptions);
                                        self.errorManager.throwError(error);
                                    }
                                }
                            });
                        });
            }
        );
    }
}
