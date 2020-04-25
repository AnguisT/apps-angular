import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IMFXEventsTabComponent} from "./imfx.events.tab.component";
import {SlickGridModule} from "../../../slick-grid/index";
import {TranslateModule} from "ng2-translate";
import {TimecodeInputFormatterComp} from "../../../slick-grid/formatters/timecode-input/timecode.input.formatter";

// imfx modules


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXEventsTabComponent,
    TimecodeInputFormatterComp
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SlickGridModule
  ],
  exports: [
    IMFXEventsTabComponent,
    TimecodeInputFormatterComp
  ],
  entryComponents: [
    TimecodeInputFormatterComp
  ]
})
export class IMFXEventsTabModule {}
