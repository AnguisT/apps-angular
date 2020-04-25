import {Component, ViewChild, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'imfx-simple-tree',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class IMFXSimpleTreeComponent {
  @ViewChild('control') private control;
  @Input() groups;
  @Output() selected:EventEmitter<any> = new EventEmitter();

  public onSelect(items, id, curItem) {
    for(var i=0; i < items.length; i++) {
      items[i].selected = false;
    }
    curItem.selected = true;
    this.selected.emit(''+id);
  }
}
