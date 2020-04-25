import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// imfx modules
import {IMFXNotAvailableComponent} from './imfx.not.available.comp';
import {TranslateModule} from "ng2-translate";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      IMFXNotAvailableComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
      IMFXNotAvailableComponent,
    ]
})
export class IMFXNotAvailableModule {}
