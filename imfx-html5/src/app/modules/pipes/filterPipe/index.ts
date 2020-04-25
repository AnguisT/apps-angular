/**
 * Created by Sergey on 09.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';

// Pipes
import {FilterPipe} from './filterPipe';

@NgModule({
  declarations: [
    FilterPipe
  ],
  imports: [
    TranslateModule,
    CommonModule
  ],
  exports: [
    FilterPipe
  ],
})
export class FilterPipeModule {
}
