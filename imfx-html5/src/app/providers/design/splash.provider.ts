/**
 * Created by Sergey Trizna on 28.02.2017.
 */
// http://stackoverflow.com/questions/37069609/show-loading-screen-when-navigating-between-routes-in-angular-2
import {EventEmitter, Inject, NgZone} from '@angular/core';
import {
    Event as RouterEvent,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router
} from '@angular/router';


export class SplashProvider {
    changed: EventEmitter<any> = new EventEmitter<any>();
    onHideSpinner: EventEmitter<any> = new EventEmitter<any>();
    public enabled: boolean;
    // public loaderElRef: ElementRef;
    public overlay;

    constructor(@Inject(Router) protected router: Router,
                @Inject(NgZone) protected ngZone: NgZone) {
        router.events.subscribe((event: RouterEvent) => {
            this._navigationInterceptor(event);
        });
        this.onHideSpinner.subscribe(
            (data) => {
                this._hideSpinner();
            }
        );
    };

    public show() {
        this.overlay && this.overlay.showWhole();
        // this.renderer.setElementStyle(
        //     this.loaderElRef.nativeElement,
        //     'display',
        //     'block'
        // );
    }

    public hide() {
        this.overlay.hideWhole();
        // this.renderer.setElementStyle(
        //     this.loaderElRef.nativeElement,
        //     'display',
        //     'none'
        // );
    }

    private _navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.ngZone.runOutsideAngular(() => {
                this.show();
            });
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
            let url = window.location.hash;
            if (!(url.indexOf('detail') > -1 || url.indexOf('media-logger') > -1 || url.indexOf('clip-editor') > -1 || url.indexOf('assessment') > -1)) {
                this._hideSpinner();
            }
        }
    };

    private _hideSpinner(): void {
        this.ngZone.runOutsideAngular(() => {
            this.hide();
            // this.renderer.setElementStyle(
            //     this.loaderElRef.nativeElement,
            //     'display',
            //     'none'
            // );
        });
    };


}
