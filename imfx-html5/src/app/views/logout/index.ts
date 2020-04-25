import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {LogoutComponent} from './logout.component';

// Search
import {SearchGridModule} from 'app/modules/search/grid';
import {SearchViewsModule} from 'app/modules/search/views';
import {SearchFormModule} from 'app/modules/search/form';
import {SearchThumbsModule} from 'app/modules/search/thumbs';
import {SearchFacetsModule} from 'app/modules/search/facets';
import {SearchSettingsModule} from 'app/modules/search/settings';
import {SearchColumnsModule} from 'app/modules/search/columns';
import {SearchAdvancedModule} from 'app/modules/search/advanced';
import {SearchRecentModule} from 'app/modules/search/recent';
import {DetailModule} from 'app/modules/search/detail';
import { appRouter } from '../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: LogoutComponent, routerPath: appRouter.logout, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        LogoutComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    exports: []
})
export default class LogoutModule {
    // static routes = routes;
}
