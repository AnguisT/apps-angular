import {Component, ViewChild, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'imfx-schema-tree',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class IMFXSchemaTreeComponent {
  @ViewChild('control') private control;
  @Input() groups;
  @Output() selected:EventEmitter<any> = new EventEmitter();

  public onSelect(items, id, curItem) {
    for (let g of this.groups) {
      for (let i of g.Children) {
        i.selected = false;
      }
    }
    curItem.selected = true;
    this.selected.emit(''+id);
  }
}
