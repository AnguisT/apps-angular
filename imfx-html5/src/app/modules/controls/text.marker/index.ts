import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// imfx modules
import { IMFXTextMarkerComponent } from './imfx.text.marker';

@NgModule({
  declarations: [
    IMFXTextMarkerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    IMFXTextMarkerComponent
  ]
})
export class IMFXTextMarkerModule {}
