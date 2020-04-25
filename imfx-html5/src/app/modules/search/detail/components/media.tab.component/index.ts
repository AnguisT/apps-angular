import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';

import {IMFXMediaTabComponent} from './imfx.media.tab.component';
// For modal
import {ModalModule} from '../../../../../modules/modal';
import {SearchColumnsComponent} from '../../../../../modules/search/columns/search.columns';
// Search
import {SearchViewsModule} from '../../../../../modules/search/views';
import {SearchFormModule} from '../../../../../modules/search/form';
import {SearchThumbsModule} from '../../../../../modules/search/thumbs';
import {SearchSettingsModule} from '../../../../../modules/search/settings';
import {SearchColumnsModule} from '../../../../../modules/search/columns';
import {SlickGridModule} from "../../../slick-grid";

@NgModule({
    declarations: [
        IMFXMediaTabComponent,
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
        ModalModule,
        // InfoModalModule,
    ],
    exports: [
        IMFXMediaTabComponent
    ],
    entryComponents: [
        SearchColumnsComponent
    ]
})
export class IMFXMediaTabModule {
    // static routes = routes;
}

