import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {TasksControlButtonsComponent} from "./tcb";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        TasksControlButtonsComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
    ],
    exports: [
        TasksControlButtonsComponent
    ],
    entryComponents: []
})
export class TasksControlButtonsModule {
}
