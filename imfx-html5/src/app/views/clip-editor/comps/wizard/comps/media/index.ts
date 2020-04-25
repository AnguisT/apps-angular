import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {SearchGridModule} from "../../../../../../modules/search/grid/index";
import {SearchViewsModule} from "../../../../../../modules/search/views/index";
import {SearchThumbsModule} from "../../../../../../modules/search/thumbs/index";
import {IMFXDropDownDirectiveModule} from "../../../../../../directives/dropdown/dropdown.directive.module";
import {WizardMediaTableComponent} from "./wizard.media.table.component";
import {FormsModule} from "@angular/forms";
import {SlickGridModule} from "../../../../../../modules/search/slick-grid";

@NgModule({
    declarations: [
        WizardMediaTableComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        SlickGridModule,
        SearchViewsModule,
        SearchThumbsModule,
        IMFXDropDownDirectiveModule
    ],
    exports: [
        IMFXDropDownDirectiveModule,
        WizardMediaTableComponent
    ]
})
export default class WizardMediaTableModule {
}
