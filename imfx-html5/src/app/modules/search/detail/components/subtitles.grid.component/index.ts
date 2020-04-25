import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IMFXTextMarkerModule} from "../../../../controls/text.marker/index";
// imfx modules
import {IMFXSubtitlesGrid} from "./subtitles.grid.component";
import {IMFXGridModule} from "../../../../controls/grid/index";
import {OverlayModule} from "../../../../overlay/index";
import { SlickGridModule } from '../../../slick-grid';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXSubtitlesGrid
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        IMFXGridModule,
        IMFXTextMarkerModule,
        OverlayModule,
      SlickGridModule
    ],
    exports: [
        IMFXSubtitlesGrid,
    ]
})
export class IMFXSubtitlesGridModule {
}
