import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';

import {VersionsInsideTitlesComponent} from './versions.component';

// For modal
import {ModalModule} from '../../../../modules/modal';
import {SearchColumnsComponent} from '../../../../modules/search/columns/search.columns';

// Search
import {SearchGridModule} from '../../../../modules/search/grid';
import {SearchViewsModule} from '../../../../modules/search/views';
import {SearchFormModule} from '../../../../modules/search/form';
import {SearchThumbsModule} from '../../../../modules/search/thumbs';
import {SearchSettingsModule} from '../../../../modules/search/settings';
import {SearchColumnsModule} from '../../../../modules/search/columns';
import {InfoModalModule} from '../../../../modules/search/info.modal';
import {SlickGridModule} from "../../../../modules/search/slick-grid/index";

@NgModule({
    declarations: [
        VersionsInsideTitlesComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        SlickGridModule,
        SearchViewsModule,
        SearchFormModule,
        SearchThumbsModule,
        SearchSettingsModule,
        SearchColumnsModule,
        InfoModalModule,
        ModalModule
    ],
    exports: [
        VersionsInsideTitlesComponent,
        SearchColumnsComponent
    ]
})
export class VersionsInsideTitlesModule {
    // static routes = routes;
}
