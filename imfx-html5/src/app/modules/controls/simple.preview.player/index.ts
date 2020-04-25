import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "ng2-translate";
import {SimplePreviewPlayerComponent} from "./simple.preview.player.component";


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
      SimplePreviewPlayerComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
      SimplePreviewPlayerComponent,
  ]
})
export class SimplePreviewPlayerModule {}
