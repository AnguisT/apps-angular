import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _apiService: ApiService) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return this._apiService.checkAccessToken();
    }
}