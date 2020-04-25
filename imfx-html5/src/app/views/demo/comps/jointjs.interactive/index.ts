/**
 * Created by Pavel on 21.03.2017.
 */
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// comps
import {JointJsInteractiveComponent} from "./jointjs.interactive.component";
import {DemoJointComponent} from "./joint";
import {JointModule} from "../../../../modules/joint";
import { appRouter } from '../../../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: JointJsInteractiveComponent, pathMatch: 'full'},
    {path: appRouter.joint, component: DemoJointComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        JointJsInteractiveComponent,
        DemoJointComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        JointModule
    ]
})
export default class DemoGoJsModule {
    static routes = routes;
}
