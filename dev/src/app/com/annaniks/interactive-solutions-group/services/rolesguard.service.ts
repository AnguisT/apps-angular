import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { CookieService } from 'angular2-cookie';
import { ConfigurationService } from '../views/admin/configurations/configuration.service';
import { map } from 'rxjs/operators';


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private cookieService: CookieService,
        private router: Router,
        private _configurationService: ConfigurationService
    ) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        const positionId = this.cookieService.get('PositionID');
        const Id = this.cookieService.get('Id');
        return this._configurationService.getRightsAccess(Id).pipe(map(res => {
            if (Number(positionId) !== 17 && Number(positionId) !== 22) {
                if (res['message'][0].Rights) {
                    return res['message'][0].Rights.isConfigurator;
                } else {
                    this.router.navigate(['']);
                    return false;
                }
            }
            return true;
        }));
    }
}
