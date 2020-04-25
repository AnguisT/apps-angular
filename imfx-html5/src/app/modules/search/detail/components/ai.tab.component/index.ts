import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXAiTabComponent} from "./ai.tab.component";
import {TranslateModule} from "ng2-translate";
import {IMFXGridModule} from "../../../../controls/grid/index";

@NgModule({
  declarations: [
    IMFXAiTabComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IMFXGridModule
  ],
  exports: [
    IMFXAiTabComponent
  ]
})
export class IMFXAiTabModule {}
