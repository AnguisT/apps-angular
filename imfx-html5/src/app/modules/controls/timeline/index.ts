/**
 * Created by Sergey Trizna on 17.12.2016.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXTimelineComponent} from './imfx.timeline';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      IMFXTimelineComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    exports: [
      IMFXTimelineComponent,
    ]
})
export class IMFXTimelineModule {}
