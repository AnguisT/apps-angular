/**
 * Created by Sergey on 09.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';

// Pipes
import {ShowItems} from './ShowItems';

@NgModule({
  declarations: [
    ShowItems
  ],
  imports: [
    TranslateModule,
    CommonModule
  ],
  exports: [
    ShowItems
  ],
})
export class ShowItemsModule {
}
