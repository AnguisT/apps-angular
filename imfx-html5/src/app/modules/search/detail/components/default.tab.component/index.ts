import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXDefaultTabComponent} from './imfx.default.tab.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXDefaultTabComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    IMFXDefaultTabComponent,
  ]
})
export class IMFXDefaultTabModule {}