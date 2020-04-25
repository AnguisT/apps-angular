/**
 * Created by Sergey Trizna on 13.01.2017.
 */
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AgGridModule} from 'ag-grid-ng2/main';

// comps
import {DemoTableTreeComponent} from './tabletree.component';

// IMFX modules
import {IMFXControlsTreeModule} from '../../../../modules/controls/tree';
import {IMFXGridModule} from "../../../../modules/controls/grid/index";
import { appRouter } from '../../../../constants/appRouter';

console.log('`DemoXmlComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: DemoTableTreeComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DemoTableTreeComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        IMFXControlsTreeModule,
        IMFXGridModule,
    ],
    exports: [
        IMFXControlsTreeModule
    ]
})
export default class DemoTableTreeModule {
    static routes = routes;
}
