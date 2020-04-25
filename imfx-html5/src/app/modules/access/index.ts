/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// Directives
import {AccessDirective} from "./directives/access.directive";

@NgModule({
  declarations: [
    AccessDirective
  ],
  imports: [

  ],
  exports: [
    AccessDirective
  ],
})
export class IMFXAccessControlModule {
}
