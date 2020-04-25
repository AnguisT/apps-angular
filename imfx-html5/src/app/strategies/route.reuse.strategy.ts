/**
 * Created by Pavel on 16.03.2017.
 */

import {ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle} from "@angular/router";
import {SessionStorageService, LocalStorageService} from "ng2-webstorage";
import {Inject, Injectable} from "@angular/core";
import {LoginComponent} from "../views/login/login.component";
import {RouteReuseProvider} from "./route.reuse.provider";

@Injectable()
export class IMFXRouteReuseStrategy implements RouteReuseStrategy {

    private reservedUrls = [
        /detail/,
        /media-logger/,
        /assessment/,
        /system\/config/,
        /dashboard/,
        /search/,
        // /simple/,
        // /media-logger-job/,
        /rce/,
        /media-logger-silver/,
        /clip-editor\/media/,
        /clip-editor\/version/
    ]
    private justFirstRestore: boolean = true;

    handlers: { [key: string]: DetachedRouteHandle } = {};
    currentLanguage: string;

    constructor(
      @Inject(SessionStorageService) private storage: SessionStorageService,
      @Inject(RouteReuseProvider) private routeReuseProvider: RouteReuseProvider,
      ) {
        this.currentLanguage = this.storage.retrieve('base.settings.lang');
        this.routeReuseProvider.clearRouteRequest.subscribe((url)=>{
         this.clearCacheByUrl(url);
        })
    }

    private clearCacheByUrl(url: string) {
      delete this.handlers[url];
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy:shouldDetach', route);
        let url = route.url.join("/") || route.parent.url.join("/");
        for (let reservedUrl of this.reservedUrls) {
            if (reservedUrl.test(url)) {
                return;
            }
        }
        return true;
    }

    store(route: any /*ActivatedRouteSnapshot*/, handle: DetachedRouteHandle): void {
        // console.debug('CustomReuseStrategy:store', route, handle);
        let url = route.url.join("/") || route.parent.url.join("/");
        this.handlers[url] = handle;
        // this.handlers[route.routeConfig.path || route.routeConfig.routerPath] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy:shouldAttach', route);
        let newLang = this.storage.retrieve('base.settings.lang');
        if (newLang != this.currentLanguage) {
            this.currentLanguage = newLang;
            this.handlers = {};
            console.debug('CustomReuseStrategy:shouldAttach', false);
            return false;
        }
        if (route.component == LoginComponent) {
            this.handlers = {};
            return false;
        }
        let url = route.url.join("/") || route.parent.url.join("/");
        for (let reservedUrl of this.reservedUrls) {
            if (reservedUrl.test(url)) {
                return false;
            }
        }
        let strategyRef = this;
        this.justFirstRestore && setTimeout(() => {
            delete strategyRef.handlers[url];
        })
        return !!route.routeConfig && !!this.handlers[url];
        // return !!route.routeConfig && !!this.handlers[route.routeConfig.path || route.routeConfig.routerPath];
    }

    retrieve(route: any /*ActivatedRouteSnapshot*/): DetachedRouteHandle {
        // console.debug('CustomReuseStrategy:retrieve', route);
        if (!route.routeConfig) return null;
        return this.handlers[route.url.join("/") || route.parent.url.join("/")];
        // return this.handlers[route.routeConfig.path || route.routeConfig.routerPath];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy:shouldReuseRoute', future, curr);
        return future.routeConfig === curr.routeConfig;
    }

}
