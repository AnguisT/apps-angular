import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from 'ng2-translate';

// component modules
import {MediaDetailComponent} from './detail.component';
import {DetailModule} from '../../../modules/search/detail';
import {SearchThumbsModule} from '../../../modules/search/thumbs';
import { appRouter } from '../../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, routerPath: appRouter.media.detail, component: MediaDetailComponent}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        MediaDetailComponent,
    ],
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        DetailModule,
        SearchThumbsModule
    ],
    exports: [
    ]
})
export default class MediaDetailModule {
    static routes = routes;
}
