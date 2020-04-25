import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMFXHtmlPlayerModule } from '../html.player/index'
// imfx modules
import { ThumbComponent } from './thumb.ts';

@NgModule({
  declarations: [
    ThumbComponent,
  ],
  imports: [
    CommonModule,
    IMFXHtmlPlayerModule
  ],
  exports: [
    ThumbComponent,
  ]
})
export class ThumbModule {}
