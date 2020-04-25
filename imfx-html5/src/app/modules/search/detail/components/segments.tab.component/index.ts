import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IMFXSegmentsTabComponent} from "./imfx.segments.tab.component";
import {SlickGridModule} from "../../../slick-grid/index";
import {TranslateModule} from "ng2-translate";

// imfx modules


@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      IMFXSegmentsTabComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SlickGridModule,
        TranslateModule
    ],
    exports: [
      IMFXSegmentsTabComponent,
    ]
})
export class IMFXSegmentsTabModule {
}
