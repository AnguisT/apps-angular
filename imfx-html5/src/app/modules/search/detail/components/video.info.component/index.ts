import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXVideoInfoComponent} from './video.info.component';
import {IMFXFrameSelectorComponent} from "./components/frame.selector.component/frame.selector.component";

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXVideoInfoComponent,
    IMFXFrameSelectorComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    IMFXVideoInfoComponent,
  ]
})
export class IMFXVideoInfoModule {}
