/**
 * Created by Sergey Klimenko on 05.04.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TmdFullImageDirective} from "./fullimage.directive";

@NgModule({
  declarations: [
    TmdFullImageDirective
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  exports: [
    TmdFullImageDirective
  ]
})
export class IMFXFullImageDirectiveModule {
}
