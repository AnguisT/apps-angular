import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// imfx modules
import {TranslateModule} from "ng2-translate";
import {IMFXMediaInfoComponent} from "./imfx.mediainfo.tab.component";
import {IMFXControlsSelect2Module} from "../../../../controls/select2/index";
import {ComboSingleModule} from "../../../advanced/comps/criteria/comps/controls/comps/container/comps/combosingle/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXMediaInfoComponent
    ],
    imports: [
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ComboSingleModule,
        IMFXControlsSelect2Module,
        // AccordionModule.forRoot()
    ],
    exports: [
        IMFXMediaInfoComponent,
    ]
})
export class IMFXMediaInfoModule {
}
