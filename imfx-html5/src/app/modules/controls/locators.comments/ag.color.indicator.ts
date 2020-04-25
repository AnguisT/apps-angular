import {ChangeDetectionStrategy, Component, Injector, ViewEncapsulation} from "@angular/core";
import {AgRendererComponent} from "ag-grid-ng2";
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'ag-color-formatter-comp',
  templateUrl: './tpl/ag-color-index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AgColorIndicatorComponent implements AgRendererComponent {
  private params: any;

  constructor() {
  }
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): void {
    this.params = params;
  }
}


@NgModule({
  declarations: [
    AgColorIndicatorComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AgColorIndicatorComponent,
  ],
  entryComponents: [
    AgColorIndicatorComponent
  ]
})
export class AgColorIndicatorModule {};
