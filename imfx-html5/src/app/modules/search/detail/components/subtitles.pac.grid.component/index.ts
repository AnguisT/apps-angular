import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {SubtitlesPacGrid} from './subtitles.pac.grid.component';
import {IMFXGridModule} from "../../../../controls/grid/index";
import { SlickGridModule } from '../../../slick-grid';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SubtitlesPacGrid
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SlickGridModule,
        IMFXGridModule
    ],
    exports: [
        SubtitlesPacGrid,
    ]
})
export class SubtitlesPacGridModule {}
