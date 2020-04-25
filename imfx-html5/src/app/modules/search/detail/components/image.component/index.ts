import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXImageComponent} from './imfx.image.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXImageComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    IMFXImageComponent,
  ]
})
export class IMFXImageModule {}