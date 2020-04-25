import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {TasksUsersComponent} from "./users";
import {OverlayModule} from "../../../../modules/overlay/index";
import {AppointmentModule} from "./comps/appointment/index";
import {IMFXControlsTreeModule} from "../../../../modules/controls/tree/index";
import {ModalModule} from "../../../../modules/modal/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        TasksUsersComponent
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
        TasksUsersComponent
    ],
    entryComponents: [
        TasksUsersComponent
    ]
})
export class TasksUsersModule {
}
