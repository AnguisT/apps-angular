import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "ng2-translate";
import {AngularSplitModule} from "angular-split";
import {MisrComponent} from "./misr.component";
// Search
import {SearchViewsModule} from "../../modules/search/views";
import {SearchFormModule} from "../../modules/search/form";
import {SearchSettingsModule} from "../../modules/search/settings";
import {SearchColumnsModule} from "../../modules/search/columns";
import {InfoModalModule} from "../../modules/search/info.modal";
import {SearchAdvancedModule} from "../../modules/search/advanced";
import {SearchRecentModule} from "../../modules/search/recent";

import {SearchChartModule} from "../../modules/search/chart";
// For modal
import {ModalModule} from "../../modules/modal";
import {SearchColumnsComponent} from "../../modules/search/columns/search.columns";
import {appRouter} from "../../constants/appRouter";
import {CacheManagerExpandRowComponent} from "./comps/grid/formatters/expand.row/expand.row.formatter";
import {SlickGridModule} from "../../modules/search/slick-grid/index";
import {CacheManagerComponent} from "./cachemanager.component";
import {CacheManagerStatusModule} from "./modules/status";
import {CacheManagerStatusComp} from "./modules/status/cm-status";
// cm status

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {
        path: appRouter.empty,
        routerPath: appRouter.cachemanager.search,
        component: CacheManagerComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        CacheManagerComponent,
        CacheManagerExpandRowComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SlickGridModule,
        SearchViewsModule,
        SearchFormModule,
        SearchSettingsModule,
        SearchColumnsModule,
        InfoModalModule,
        SearchAdvancedModule,
        SearchRecentModule,
        AngularSplitModule,
        SearchChartModule,
        ModalModule,
        CacheManagerStatusModule
    ],
    entryComponents: [
        SearchColumnsComponent,
        CacheManagerExpandRowComponent
    ]
})
export default class CacheManagerModule {
    // static routes = routes;
}
