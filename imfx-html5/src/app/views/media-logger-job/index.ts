import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from 'ng2-translate';
import {SafePipeModule} from "../../modules/pipes/safePipe/index";
import {IMFXSilverlightPlayerModule} from "../../modules/controls/silverlight.player/index";
import {IMFXNotAvailableModule} from "../../modules/controls/not.available.comp/index";
import {MediaLoggerJobSilverComponent} from "./media-logger-job";
import {OverlayModule} from "../../modules/overlay/index";
import { appRouter } from '../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: MediaLoggerJobSilverComponent, routerPath: appRouter.media_logger.jos_aspx, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        MediaLoggerJobSilverComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SafePipeModule,
        IMFXSilverlightPlayerModule,
        IMFXNotAvailableModule,
        OverlayModule
    ],
})
export default class MediaLoggerJobSilverModule {
    static routes = routes;
}
