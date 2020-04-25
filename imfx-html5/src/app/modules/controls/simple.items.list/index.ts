import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SimpleListComponent} from "./simple.items.list";
import {ThumbModule} from "../thumb/index";
import {TranslateModule} from "ng2-translate";

@NgModule({
  declarations: [
    SimpleListComponent,
  ],
  imports: [
    CommonModule,
    ThumbModule,
    TranslateModule
  ],
  exports: [
    SimpleListComponent,
  ]
})
export class SimpleListModule {}
