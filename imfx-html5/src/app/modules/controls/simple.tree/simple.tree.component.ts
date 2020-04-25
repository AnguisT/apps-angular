import {
  Component, ViewChild, Input, Output, EventEmitter, ViewEncapsulation,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {letProto} from "rxjs/operator/let";

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
    @Input() freeze = false;
    @Output() selected: EventEmitter<any> = new EventEmitter();

    constructor(private cdr: ChangeDetectorRef) {
    }

    public onSelect(items, id, curItem) {
        if(this.freeze)
            return;
        for (let i = 0; i < this.groups.length; i++) {
            for (let j = 0; j < this.groups[i].Children.length; j++) {
                this.groups[i].Children[j].selected = false;
            }
        }

        curItem.selected = true;
        this.selected.emit('' + id);
    }

    public updateData() {
        this.cdr.detectChanges();
    }
}
