import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {TranslateModule} from "ng2-translate";
// imfx modules
import {IMFXMediaTaggingTabComponent} from "./imfx.media.tagging.tab.component";
import {IMFXGridModule} from "../../../../controls/grid/index";
import {TagsModule} from "../../../../controls/tags/index";
import {IMFXControlsSelect2Module} from "../../../../controls/select2/index";
import {SlickGridModule} from "../../../slick-grid/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXMediaTaggingTabComponent,
        // TagsComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        IMFXGridModule,
        TagsModule,
        // AgGridModule.withComponents(),
        TranslateModule,
        IMFXControlsSelect2Module,
        SlickGridModule
    ],
    exports: [
        IMFXMediaTaggingTabComponent,
    ]
})
export class IMFXMediaTaggingTabModule {
}
