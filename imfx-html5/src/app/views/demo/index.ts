/**
 * Created by Sergey Trizna on 13.01.2017.
 */
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// comps
import {DemoComponent} from './demo.component';
import { appRouter } from '../../constants/appRouter';
import {SimplePreviewPlayerModule} from "../../modules/controls/simple.preview.player/index";

// IMFX modules
// import {IMFXControlsTreeModule} from 'app/modules/controls/tree';

console.log('`DemoComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: DemoComponent, routerPath: 'demo', pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DemoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SimplePreviewPlayerModule
        // IMFXControlsTreeModule,
    ],
    exports: [
        // IMFXControlsTreeModule
    ]
})
export default class DemoModule {
    static routes = routes;
}
