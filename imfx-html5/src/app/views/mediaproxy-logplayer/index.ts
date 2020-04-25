// async components must be named routes for WebpackAsyncRoute
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {RouterModule} from "@angular/router";
import {SafePipeModule} from "../../modules/pipes/safePipe/index";
import {IMFXNotAvailableModule} from "../../modules/controls/not.available.comp/index";
import {OverlayModule} from "../../modules/overlay/index";
import {NgModule} from "@angular/core";
import {MediaProxyLogPlayerComponent} from "./mediaproxy.logplayer";
import { appRouter } from '../../constants/appRouter';

export const routes = [
    {path: appRouter.empty, component: MediaProxyLogPlayerComponent, routerPath: appRouter.mediaproxy_logplayer, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        MediaProxyLogPlayerComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SafePipeModule,
        IMFXNotAvailableModule,
        OverlayModule
    ],
})
export default class MediaProxyLogPlayerModule {
    static routes = routes;
}
