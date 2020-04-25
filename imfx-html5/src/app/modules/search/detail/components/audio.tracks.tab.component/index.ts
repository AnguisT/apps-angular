import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IMFXAudioTracksTabComponent} from "./imfx.audio.tracks.tab.component";
import {SlickGridModule} from "../../../slick-grid/index";
import {TranslateModule} from "ng2-translate";
import {TabsModule} from "ngx-bootstrap";

// imfx modules


@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      IMFXAudioTracksTabComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SlickGridModule,
        TranslateModule,
        TabsModule
    ],
    exports: [
      IMFXAudioTracksTabComponent,
    ]
})
export class IMFXAudioTracksTabModule {
}
