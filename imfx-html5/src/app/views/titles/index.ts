import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "ng2-translate";
import {AngularSplitModule} from "angular-split";
import {TitlesComponent} from "./titles.component";
// Search
import {SearchViewsModule} from "../../modules/search/views";
import {SearchFormModule} from "../../modules/search/form";
import {SearchThumbsModule} from "../../modules/search/thumbs";
import {SearchFacetsModule} from "../../modules/search/facets";
import {SearchSettingsModule} from "../../modules/search/settings";
import {SearchColumnsModule} from "../../modules/search/columns";
import {SearchAdvancedModule} from "../../modules/search/advanced";
import {SearchRecentModule} from "../../modules/search/recent";
import {InfoModalModule} from "../../modules/search/info.modal";

import {LinkColumnComponent} from "./components/link/link";
import {SeriesThumbColumnComponent} from "./components/series.thumb/thumb";
// For modal
import {ModalModule} from "../../modules/modal";
import {SearchColumnsComponent} from "../../modules/search/columns/search.columns";
// Modules inside titles
import {MediaInsideTitlesModule} from "./modules/media";
import {VersionsInsideTitlesModule} from "./modules/versions";
import {IMFXControlsSelect2Module} from "../../modules/controls/select2/index";
import {appRouter} from "../../constants/appRouter";
import {SlickGridModule} from "../../modules/search/slick-grid/index";


// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, routerPath: appRouter.title.search, component: TitlesComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        TitlesComponent,
        SeriesThumbColumnComponent,
        LinkColumnComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SlickGridModule,
        SearchViewsModule,
        SearchFormModule,
        SearchThumbsModule,
        SearchFacetsModule,
        SearchSettingsModule,
        SearchColumnsModule,
        SearchAdvancedModule,
        SearchRecentModule,
        AngularSplitModule,
        InfoModalModule,
        ModalModule,
        IMFXControlsSelect2Module,

        // inside
        MediaInsideTitlesModule,
        VersionsInsideTitlesModule
    ],
    exports: [
        TitlesComponent,
    ],
    entryComponents: [
        TitlesComponent,
        SeriesThumbColumnComponent,
        LinkColumnComponent,
        SearchColumnsComponent,
    ]
})
export default class TitlesModule {
    // static routes = routes;
}
