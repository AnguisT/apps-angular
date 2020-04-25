import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IMFXNotesTabComponent} from "./imfx.notes.tab.component";

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXNotesTabComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    IMFXNotesTabComponent,
  ]
})
export class IMFXNotesTabModule {}
