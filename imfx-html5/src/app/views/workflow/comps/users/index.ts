import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {WorkflowUsersComponent} from "./users";
import {OverlayModule} from "../../../../modules/overlay/index";
import {AppointmentModule} from "./comps/appointment/index";
import {IMFXControlsTreeModule} from "../../../../modules/controls/tree/index";
import {ModalModule} from "../../../../modules/modal/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        WorkflowUsersComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        OverlayModule,
        IMFXControlsTreeModule,
        AppointmentModule,
        ModalModule
    ],
    exports: [
        WorkflowUsersComponent
    ],
    entryComponents: [
        WorkflowUsersComponent
    ]
})
export class WorkflowUsersModule {
}
