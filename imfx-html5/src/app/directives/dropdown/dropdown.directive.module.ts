/**
 * Created by dvvla on 28.08.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DropDownDirective} from "./dropdown.directive";

@NgModule({
  declarations: [
    DropDownDirective
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  exports: [
    DropDownDirective
  ]
})
export class IMFXDropDownDirectiveModule {
}
