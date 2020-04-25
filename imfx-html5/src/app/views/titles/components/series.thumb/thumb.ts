import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
  selector: 'grid-column-thumb-component',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class SeriesThumbColumnComponent implements AgRendererComponent {
  private params: any;
  private url: string = "http://192.168.90.39/getfile.aspx?id=3006682";

  private showThumb: boolean = false;

  // called on init
  agInit(params: any): void {
    this.showThumb = params.node.level == 0;
    // /*debugger*/;
    this.params = params;
    // this.url = this.params.value;
  }

  // called when the cell is refreshed
  refresh(params: any): void {
    this.showThumb = params.node.level == 0;
    this.params = params;
    // this.url = this.params.value;
  }
}

