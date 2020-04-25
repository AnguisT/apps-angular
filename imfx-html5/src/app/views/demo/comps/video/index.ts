
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// comps
import {DemoVideoComponent} from './video.component';

// IMFX modules
import {IMFXControlsTreeModule} from '../../../../modules/controls/tree';
import {IMFXXMLTreeModule} from "../../../../modules/controls/xml.tree/index";
import {IMFXHtmlPlayerModule} from "../../../../modules/controls/html.player/index";
import {DemoVideoDetailsComponent} from "./video.details.component";
import { appRouter } from '../../../../constants/appRouter';

console.log('`DemoMSEComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: DemoVideoComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      DemoVideoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IMFXHtmlPlayerModule,
        RouterModule.forChild(routes),
    ]
})
export default class DemoVideoModule {
    static routes = routes;
}
