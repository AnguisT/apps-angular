import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';


@Injectable()
export class ApiService {
   // private _baseUrl: string = 'https://crm.i-s-group.ru:3000/admin/';
   private _baseUrl: string = 'http://localhost:4000/admin/';

    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _router: Router,
    ) { }

    /**
     * 
     * @param url - request url
     * @param observe - httpOption for get full response,not required
     * @param responseType - httpOption for get full response on type text
     */
    public get(url: string, observe?, responseType?) {
        let accessToken = this._cookieService.get('accessToken') || '';
        let headers = new HttpHeaders({
            'Content-type': 'application/json',
            'token': accessToken,
        })
        let params = { headers: headers };
        if (observe == 'response')
            params['observe'] = 'response';
        if (responseType == 'text')
            params['responseType'] = 'text';
        return this._httpClient.get(this._baseUrl + url, params)
    }


    /**
     * 
     * @param url - request url, 
     * @param body - sending object
     * @param observe - httpOption for get full response
     * @param responseType 
     */
    public post(url: string, body: object, observe?, responseType?) {
        let accessToken = this._cookieService.get('accessToken') || '';
        let headers = new HttpHeaders({
            'Content-type': 'application/json',
            'token': accessToken,
        })
        let params = { headers: headers };
        if (observe == 'response')
            params['observe'] = 'response';
        if (responseType == 'text')
            params['responseType'] = 'text';

        return this._httpClient.post(this._baseUrl + url, body, params);
    }

    public postFormData(url: string, formData: FormData, observe?, responseType?) {
        let accessToken = this._cookieService.get('accessToken') || '';
        let headers = new HttpHeaders({
            'token': accessToken,
        })
        let params = { headers: headers };
        if (observe == 'response')
            params['observe'] = 'response';
        if (responseType == 'text')
            params['responseType'] = 'text';

        return this._httpClient.post(this._baseUrl + url, formData, params);
    }

    /**
     * 
     * @param url 
     * @param body 
     * @param observe 
     * @param responseType 
     */
    public put(url: string, body: object, observe?, responseType?) {
        let accessToken = this._cookieService.get('accessToken') || '';
        let headers = new HttpHeaders({
            'Content-type': 'application/json',
            'token': accessToken,
        })
        let params = { headers: headers };
        if (observe == 'response')
            params['observe'] = 'response';
        if (responseType == 'text')
            params['responseType'] = 'text';

        return this._httpClient.put(this._baseUrl + url, body, params);
    }
    /**
     * 
     * @param url 
     * @param observe 
     * @param responseType 
     */
    public delete(url: string, observe?, responseType?) {
        let accessToken = this._cookieService.get('accessToken') || '';
        let headers = new HttpHeaders({
            'Content-type': 'application/json',
            'token': accessToken
        })
        let params = { headers: headers };
        if (observe == 'response')
            params['observe'] = 'response';
        if (responseType == 'text')
            params['responseType'] = 'text';

        return this._httpClient.delete(this._baseUrl + url, params);
    }

    /**
     * 
     */
    public checkAccessToken() {
        return this.get('check/token', 'response', 'text')
            .pipe(
                map((data) => {
                    return true;
                }),
                catchError((err, caught) => {
                    return this._getAccessToken();
                }))
    }

    private _getAccessToken() {
        let accessToken = this._cookieService.get('accessToken') || '';
        let refreshToken = this._cookieService.get('refreshToken') || '';
        let headers = new HttpHeaders({
            'Content-type': 'application/json',
            'token': accessToken,
            'refreshToken': refreshToken
        })
        return this._httpClient.get(this._baseUrl + 'refresh/token', { headers: headers })
            .pipe(map((data) => {
                this._updateCookies(data);
                return true;
            }),
                catchError((err, caught) => {
                    this._router.navigate(['/login'])
                    return of(false);
                }))
    }
    /**
     * 
     * @param data 
     */
    private _updateCookies(data) {
        this._cookieService.put('accessToken', data.token);
        this._cookieService.put('refreshToken', data.refreshToken);
    }


}