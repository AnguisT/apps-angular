import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';

import { VersionsInsideUploadComponent } from './versions.component';

// For modal
import { ModalModule } from '../../../../modules/modal';
import { SearchColumnsComponent } from '../../../../modules/search/columns/search.columns';

// Search
import { SearchViewsModule } from '../../../../modules/search/views';
import { SearchFormModule } from '../../../../modules/search/form';
import { SearchThumbsModule } from '../../../../modules/search/thumbs';
import { SearchSettingsModule } from '../../../../modules/search/settings';
import { SearchColumnsModule } from '../../../../modules/search/columns';
import { InfoModalModule } from '../../../../modules/search/info.modal';
import { SearchFacetsModule } from '../../../search/facets/index';
import { DetailModule } from '../../../search/detail/index';
import { SearchAdvancedModule } from '../../../search/advanced/index';
import { AngularSplitModule } from 'angular-split';
import { BsDropdownModule } from 'ngx-bootstrap';
import { SearchRecentModule } from '../../../search/recent/index';
import { SlickGridModule } from '../../../search/slick-grid/index';


@NgModule({
    declarations: [
        VersionsInsideUploadComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
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
        ModalModule,
        BsDropdownModule,
        SlickGridModule,
    ],
    exports: [
        VersionsInsideUploadComponent,
        SearchColumnsComponent
    ],
    entryComponents: [
        VersionsInsideUploadComponent,
        SearchColumnsComponent,
    ]
})
export class VersionsInsideUploadModule {
    // static routes = routes;
}
