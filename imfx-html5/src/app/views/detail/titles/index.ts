import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { GLTitlesComponent }   from './gl.component';

import {TranslateModule} from 'ng2-translate';

// component modules
import {TitlesDetailComponent} from './detail.component';
import {DetailModule} from '../../../modules/search/detail';
import { appRouter } from '../../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, routerPath: appRouter.media.detail, component: TitlesDetailComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        TitlesDetailComponent,
        GLTitlesComponent
    ],
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        DetailModule
    ],
    exports: [
        GLTitlesComponent
    ]
})
export default class MediaDetailModule {
    static routes = routes;
}
