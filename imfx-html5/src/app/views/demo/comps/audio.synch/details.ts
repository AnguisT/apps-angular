
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// IMFX modules
import {IMFXHtmlPlayerModule} from "../../../../modules/controls/html.player/index";
import {DemoAudioSynchDetailsComponent} from "./audio.synch.details.component";
import { appRouter } from '../../../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: DemoAudioSynchDetailsComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      DemoAudioSynchDetailsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IMFXHtmlPlayerModule,
        RouterModule.forChild(routes),
    ]
})
export default class DemoAudioSynchDetailsModule {
    static routes = routes;
}
