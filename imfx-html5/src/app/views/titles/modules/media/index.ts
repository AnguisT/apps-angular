import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";

import {MediaInsideTitlesComponent} from "./media.component";
// For modal
import {ModalModule} from "../../../../modules/modal";
import {SearchColumnsComponent} from "../../../../modules/search/columns/search.columns";
// Search
import {SearchViewsModule} from "../../../../modules/search/views";
import {SearchFormModule} from "../../../../modules/search/form";
import {SearchThumbsModule} from "../../../../modules/search/thumbs";
import {SearchSettingsModule} from "../../../../modules/search/settings";
import {SearchColumnsModule} from "../../../../modules/search/columns";
import {SlickGridModule} from "../../../../modules/search/slick-grid/index";


@NgModule({
    declarations: [
        MediaInsideTitlesComponent,
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
        MediaInsideTitlesComponent
    ],
    entryComponents: [
        SearchColumnsComponent
    ]
})
export class MediaInsideTitlesModule {
    // static routes = routes;
}
