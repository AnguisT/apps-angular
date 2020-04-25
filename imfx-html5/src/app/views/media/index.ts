import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { AngularSplitModule } from 'angular-split';
import {MediaComponent} from './media.component';
import { IMFXDropDownDirectiveModule } from '../../directives/dropdown/dropdown.directive.module';

// imfx
import { SearchGridModule } from '../../modules/search/grid';
import { SearchViewsModule } from '../../modules/search/views';
import { SearchFormModule } from '../../modules/search/form';
import { SearchThumbsModule } from '../../modules/search/thumbs';
import { SearchFacetsModule } from '../../modules/search/facets';
import { SearchColumnsModule } from '../../modules/search/columns';

import { InfoModalModule } from '../../modules/search/info.modal';
import { SearchAdvancedModule } from '../../modules/search/advanced';
import { SearchSettingsModule } from '../../modules/search/settings';
import { SearchRecentModule } from '../../modules/search/recent';
import { DetailModule } from '../../modules/search/detail';

// For modal
import { ModalModule } from '../../modules/modal';
import { SearchColumnsComponent } from '../../modules/search/columns/search.columns';
import { appRouter } from '../../constants/appRouter';
import { SlickGridModule } from '../../modules/search/slick-grid/index';
import {IMFXModalModule} from "../../modules/imfx-modal/index";
import {TitlesComponent} from "../titles/titles.component";
import TitlesModule from "../titles/index";
import {ProfileComponent} from "../profile/profile.component";
import ProfileModule from "../profile/index";
import {ExportComponent} from "../../modules/export/export";

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {
        path: appRouter.empty,
        routerPath: appRouter.media.search,
        component: MediaComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        MediaComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        // SearchGridModule,
        SlickGridModule,
        SearchViewsModule,
        SearchFormModule,
        SearchThumbsModule,
        SearchFacetsModule,
        SearchColumnsModule,
        SearchSettingsModule,
        InfoModalModule,
        DetailModule,
        SearchAdvancedModule,
        SearchRecentModule,
        AngularSplitModule,
        ModalModule,
        IMFXDropDownDirectiveModule,
        IMFXModalModule,
    ],
    exports: [],
    entryComponents: [
        SearchColumnsComponent,
        MediaComponent,
    ]
})
export default class MediaModule {
    // static routes = routes;
}
