import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import { AgRendererComponent } from 'ag-grid-ng2/main';

@Component({
  selector: 'local-date-component',
  templateUrl: 'tpl/index.html',
  encapsulation: ViewEncapsulation.None
})
export class LocalDateGridComponent implements AgRendererComponent {
  private date: any;

  // called on init
  agInit(params: any): void {
    this.date = params.value;
  }

  // called when the cell is refreshed
  refresh(params: any): void {
    this.date = params.value;
  }
}

