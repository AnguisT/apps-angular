/**
 * Created by Pavel on 25.04.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TristateDirective} from "./tristate.checkbox.directive";

@NgModule({
  declarations: [
    TristateDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TristateDirective
  ]
})
export class IMFXTristateDirectiveModule {
}
