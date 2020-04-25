/**
 * Created by Sergey Trizna on 13.01.2017.
 */
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// comps
import {DemoTreeComponent} from './tree.component';

// IMFX modules
import {IMFXControlsTreeModule} from '../../../../modules/controls/tree';
import { appRouter } from '../../../../constants/appRouter';

console.log('`DemoXmlComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: DemoTreeComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DemoTreeComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        IMFXControlsTreeModule,
    ],
    exports: [
        IMFXControlsTreeModule
    ]
})
export default class DemoTreeModule {
    static routes = routes;
}
