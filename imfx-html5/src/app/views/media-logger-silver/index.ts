import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from 'ng2-translate';
import {MediaLoggerSilverComponent} from './media-logger-silver';
import {SafePipeModule} from "../../modules/pipes/safePipe/index";
import {IMFXSilverlightPlayerModule} from "../../modules/controls/silverlight.player/index";
import {IMFXNotAvailableModule} from "../../modules/controls/not.available.comp/index";
import {OverlayModule} from "../../modules/overlay/index";
import { appRouter } from '../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: MediaLoggerSilverComponent, routerPath: appRouter.media_logger.aspx, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        MediaLoggerSilverComponent,
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
export default class MediaLoggerSilverModule {
    static routes = routes;
}
