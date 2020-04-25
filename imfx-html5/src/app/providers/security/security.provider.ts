/**
 * Created by initr on 18.10.2016.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Route, CanLoad } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { ConfigService } from '../../services/config/config.service';
import { SecurityService } from '../../services/security/security.service';
import { Router } from '@angular/router';
import { appRouter } from '../../constants/appRouter';

@Injectable()
export class SecurityProvider implements CanLoad {
    constructor(private loginService: LoginService,
                private securityService: SecurityService,
                private router: Router) {
    }

    /**
     * @param route
     * @returns {boolean|Promise<boolean>}
     */
    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        // Is logged
        let isLoggedIn = this.loginService.isLoggedIn();
        // If has permissions to path - allow redirect else -- go to 403
        if (isLoggedIn) {
            if (this.securityService.hasPermissionByPath(route.path)) {
                return true;
            }
        } else {
          // /*debugger*/;
          // Store target path for redirect on it after login
          this.loginService.setTargetPath(location.hash.substr(2));
        }

        // If user is logged  - return 403 page else go to login
        let routes = ConfigService.getSetupsForRoutes();
        if (isLoggedIn) {
            this.router.navigate([appRouter.no_access]);
        } else {
            this.router.navigate([appRouter.login]);
        }

        return false;
    }
}
