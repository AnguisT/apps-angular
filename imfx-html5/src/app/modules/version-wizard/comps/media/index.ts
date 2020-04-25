import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {SearchViewsModule} from "../../../../modules/search/views/index";
import {SearchThumbsModule} from "../../../../modules/search/thumbs/index";
import {IMFXDropDownDirectiveModule} from "../../../../directives/dropdown/dropdown.directive.module";
import {VersionWizardMediaComponent} from "./version.wizard.media.component";
import {SlickGridModule} from "../../../../modules/search/slick-grid";

@NgModule({
    declarations: [
        VersionWizardMediaComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        // RouterModule.forChild(routes),
        SlickGridModule,
        SearchViewsModule,
        SearchThumbsModule,
        IMFXDropDownDirectiveModule
    ],
    exports: [
        IMFXDropDownDirectiveModule,
        VersionWizardMediaComponent
    ],
    // entryComponents: [
    //     VersionWizardMediaComponent
    // ]
})
export default class VersionWizardMediaModule {
    // static routes = routes;
}
