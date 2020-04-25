import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LoginResponse } from '../types/types';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
    // private _baseUrl: string = 'https://crm.i-s-group.ru:3000/admin/';
    private _baseUrl = 'http://localhost:4000/admin/';

    constructor(private _cookieService: CookieService, private _httpClient: HttpClient) { }

    public logIn(email: string, password: string): Observable<object> {
        return this._httpClient.post(this._baseUrl + 'login', {
            Username: email,
            Password: password
        })
            .pipe(
                map((data: LoginResponse) => {
                    this._cookieService.put('accessToken', data.token);
                    this._cookieService.put('refreshToken', data.refreshToken);
                    this._cookieService.put('Id', data.Id);
                    this._cookieService.put('PositionID', data.PositionId);
                    return data;
                })
            );
    }
}
