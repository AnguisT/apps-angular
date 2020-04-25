/**
 * Created by Sergey on 02.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXHtmlPlayerComponent} from './imfx.html.player';
import {TranslateModule} from "ng2-translate";


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXHtmlPlayerComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    IMFXHtmlPlayerComponent,
  ]
})
export class IMFXHtmlPlayerModule {}

