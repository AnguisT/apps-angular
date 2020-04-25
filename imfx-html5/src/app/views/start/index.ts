import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
// imfx modules
import {TranslateModule} from 'ng2-translate';

// components
import {StartSearchComponent} from "./start.search.component";

import StartSearchFormModule from "./components/search/index";
import { appRouter } from '../../constants/appRouter';


// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: StartSearchComponent, routerPath: appRouter.start, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        StartSearchComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        RouterModule.forChild(routes),
        StartSearchFormModule // moved to separate module to reuse in settings groups and simple search
    ],
    exports: [

    ]
})
export default class StartSearchModule {
    static routes = routes;
}
