/**
 * Created by Sergey Trizna on 13.01.2017.
 */
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// comps
import {DemoXmlComponent} from './xml.component';

// IMFX modules
import {IMFXControlsTreeModule} from '../../../../modules/controls/tree';
import {IMFXXMLTreeModule} from "../../../../modules/controls/xml.tree/index";
import { appRouter } from '../../../../constants/appRouter';

console.log('`DemoXmlComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: DemoXmlComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DemoXmlComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        IMFXXMLTreeModule,
    ]
})
export default class DemoTreeModule {
    static routes = routes;
}
