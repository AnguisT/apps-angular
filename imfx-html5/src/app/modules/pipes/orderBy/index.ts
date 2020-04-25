/**
 * Created by Sergey on 09.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';

// Pipes
import {OrderBy} from './OrderBy';

@NgModule({
  declarations: [
    OrderBy
  ],
  imports: [
    TranslateModule,
    CommonModule
  ],
  exports: [
    OrderBy
  ],
})
export class OrderByModule {
}
