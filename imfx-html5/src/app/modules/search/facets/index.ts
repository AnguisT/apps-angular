import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {SearchFacetsComponent} from './search.facets';
@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SearchFacetsComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
    ],
    exports: [
        SearchFacetsComponent
    ],
})
export class SearchFacetsModule {
}
