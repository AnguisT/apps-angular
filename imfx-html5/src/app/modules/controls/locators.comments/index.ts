import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-ng2/main";
import {TranslateModule} from "ng2-translate";
// imfx modules
import {IMFXLocatorsCommentsComponent} from "./imfx.locators.comments.component";
import {TagsComponent} from "app/modules/controls/tags/tags.component";
import {InputComponent} from "app/modules/controls/table.input/table.input.component";
import {DeleteRowComponent} from "app/modules/search/grid/comps/rows/delete.row/delete.row";
import {IMFXGridModule} from "app/modules/controls/grid/index";
import {IMFXControlsSelect2Module} from "app/modules/controls/select2/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXLocatorsCommentsComponent,
        InputComponent,
        DeleteRowComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AgGridModule.withComponents([TagsComponent, InputComponent, DeleteRowComponent]),
        IMFXGridModule,
        TranslateModule,
        IMFXControlsSelect2Module
    ],
    exports: [
        IMFXLocatorsCommentsComponent,
    ]
})
export class IMFXLocatorsCommentsModule {
}
