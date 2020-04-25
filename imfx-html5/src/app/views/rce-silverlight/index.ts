

// async components must be named routes for WebpackAsyncRoute
import {RCESLComponent} from "./rce";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {RouterModule} from "@angular/router";
import {SafePipeModule} from "../../modules/pipes/safePipe/index";
import {IMFXSilverlightPlayerModule} from "../../modules/controls/silverlight.player/index";
import {IMFXNotAvailableModule} from "../../modules/controls/not.available.comp/index";
import {OverlayModule} from "../../modules/overlay/index";
import {NgModule} from "@angular/core";
import { appRouter } from '../../constants/appRouter';

export const routes = [
    {path: appRouter.empty, component: RCESLComponent, routerPath: appRouter.rce, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        RCESLComponent,
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
export default class RCESLModule {
    static routes = routes;
}
