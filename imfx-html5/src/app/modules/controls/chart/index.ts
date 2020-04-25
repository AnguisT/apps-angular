/**
 * Created by Pavel on 17.01.2017.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

// import { TreeModule } from 'angular2-tree-component';
import {TranslateModule} from "ng2-translate";
import {ChartComponent} from "./chart.component";


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ChartComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ChartsModule
  ],
  exports: [
    ChartComponent,
  ]
})
export class ChartModule {}
