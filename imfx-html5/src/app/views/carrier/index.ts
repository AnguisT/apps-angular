import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from 'ng2-translate';
import {AngularSplitModule} from 'angular-split';
import {CarrierComponent} from './carrier.component';

// Search
import {SearchViewsModule} from '../../modules/search/views';
import {SearchFormModule} from '../../modules/search/form';
import {SearchThumbsModule} from '../../modules/search/thumbs';
import {SearchFacetsModule} from '../../modules/search/facets';
import {SearchSettingsModule} from '../../modules/search/settings';
import {SearchColumnsModule} from '../../modules/search/columns';
import {SearchAdvancedModule} from '../../modules/search/advanced';
import {SearchRecentModule} from '../../modules/search/recent';
import {DetailModule} from '../../modules/search/detail';
import {InfoModalModule} from '../../modules/search/info.modal';
import {ModalModule} from "../../modules/modal/index";
import {SearchColumnsComponent} from "../../modules/search/columns/search.columns";
import { appRouter } from '../../constants/appRouter';
import {SlickGridModule} from "../../modules/search/slick-grid/index";

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: CarrierComponent, routerPath: appRouter.carrier, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        CarrierComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SearchViewsModule,
        SearchFormModule,
        SearchThumbsModule,
        SearchFacetsModule,
        SearchSettingsModule,
        SearchColumnsModule,
        DetailModule,
        SearchAdvancedModule,
        SearchRecentModule,
        AngularSplitModule,
        InfoModalModule,
        ModalModule,
        SlickGridModule
    ],
    exports: [],
    entryComponents: [
      SearchColumnsComponent
    ]
})
export default class CarrierModule {
    // static routes = routes;
}
