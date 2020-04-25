import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXSilverlightPlayerComponent} from './imfx.silverlight.player';
import {TranslateModule} from "ng2-translate";


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXSilverlightPlayerComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    IMFXSilverlightPlayerComponent,
  ]
})
export class IMFXSilverlightPlayerModule {}
