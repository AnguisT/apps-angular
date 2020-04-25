import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXAccordionComponent} from './imfx.accordion.component';
import {TranslateModule} from "ng2-translate";
import {AccordionModule} from 'ngx-bootstrap';
// Pipes
import {LocalDateModule} from '../../../../pipes/localDate/index';
import {ShowItemsModule} from '../../../../pipes/showItems/index';

import {StatusColumnModule} from '../../../grid/comps/columns/status/index';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXAccordionComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AccordionModule.forRoot(),
    LocalDateModule,
    ShowItemsModule,
    StatusColumnModule
  ],
  exports: [
    IMFXAccordionComponent,
  ]
})
export class IMFXAccordionModule {}
