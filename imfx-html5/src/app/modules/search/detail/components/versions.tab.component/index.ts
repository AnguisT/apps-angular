import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXVersionsTabComponent} from './imfx.versions.tab.component';
import {SlickGridModule} from "../../../slick-grid";

@NgModule({
    declarations: [
    // Components / Directives/ Pipes
        IMFXVersionsTabComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SlickGridModule
    ],
    exports: [
        IMFXVersionsTabComponent
    ]
})
export class IMFXVersionsTabModule {}
