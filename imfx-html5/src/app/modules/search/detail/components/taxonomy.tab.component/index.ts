import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
// imfx modules
import {IMFXControlsTreeModule} from "../../../../controls/tree/index";
import {IMFXTaxonomyComponent} from "./imfx.taxonomy.tab.component";
import {IMFXControlsSelect2Module} from "../../../../controls/select2/index";
import {TranslateModule} from "ng2-translate";

@NgModule({
    declarations: [
        IMFXTaxonomyComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IMFXControlsTreeModule,
        IMFXControlsSelect2Module,
        TranslateModule
    ],
    exports: [
        IMFXTaxonomyComponent
    ]
})
export class IMFXTaxonomyModule {
}
