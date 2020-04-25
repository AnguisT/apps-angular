/**
 * Created by Sergey Trizna on 16.02.2017.
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// comps
import {DemoPermissionsComponent} from './permissions.component';
import { appRouter } from '../../../../constants/appRouter';

console.log('`DemoXmlComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute

export const routes = [
    {path: appRouter.empty, component: DemoPermissionsComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DemoPermissionsComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    exports: [
        DemoPermissionsComponent
    ]
})
export default class DemoPermissionsModule {
    static routes = routes;
}
