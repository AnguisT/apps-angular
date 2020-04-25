import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {VersionWizardComponent} from "./wizard";
import {OverlayModule} from "../../modules/overlay/index";
import {IMFXControlsSelect2Module} from "../../modules/controls/select2/index";
import VersionWizardMediaModule from "./comps/media/index";
@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        VersionWizardComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        OverlayModule,
        IMFXControlsSelect2Module,
        VersionWizardMediaModule
    ],
    exports: [
        VersionWizardComponent
    ],
    entryComponents: [
        VersionWizardComponent
    ]
})
export class VersionWizardModule {
}
