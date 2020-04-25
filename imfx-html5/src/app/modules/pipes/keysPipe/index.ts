/**
 * Created by Sergey on 09.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';

// Pipes
import {KeysPipe} from './KeysPipe';

@NgModule({
  declarations: [
    KeysPipe
  ],
  imports: [
    TranslateModule,
    CommonModule
  ],
  exports: [
    KeysPipe
  ],
})
export class KeysPipeModule {
}
