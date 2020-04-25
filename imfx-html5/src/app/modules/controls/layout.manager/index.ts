/**
 * Created by Sergey K. on 09.03.2018.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from 'ng2-translate';
import {LayoutManagerComponent} from './layout.manager.component';
import {ModalModule} from "../../modal/index";
import {SaveLayoutModalComponent} from "./modals/save.layout.modal/save.layout.modal.component";
import {LoadLayoutModalComponent} from "./modals/load.layout.modal/load.layout.modal.component";


@NgModule({
  declarations: [
    LayoutManagerComponent,
    SaveLayoutModalComponent,
    LoadLayoutModalComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalModule
  ],
  exports: [
    LayoutManagerComponent,
    SaveLayoutModalComponent,
    LoadLayoutModalComponent
  ],
  entryComponents: [
    SaveLayoutModalComponent,
    LoadLayoutModalComponent
  ]
})
export class LayoutManagerModule {}
