import {
  Component, Input,
  ViewEncapsulation
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';
import {ProgressComponent} from "../../../../../controls/progress/progress";

@Component({
  selector: 'grid-column-progress-component',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [
    ProgressComponent
  ]
})
export class ProgressColumnComponent implements AgRendererComponent {
  private params: any;
  @Input() private progress: string;

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.progress = this.params.value;
  }

  // called when the cell is refreshed
  refresh(params: any): void {
    this.params = params;
    this.progress = this.params.value;
  }
}

