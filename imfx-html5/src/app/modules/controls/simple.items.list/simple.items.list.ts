import {
  Input,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef, Output, EventEmitter
} from '@angular/core';

@Component({
  selector: 'simple-list-component',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SimpleListComponent {
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() items: Array<any>;
  private selectedItemIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {
  };

  ngOnInit() {
  }

  ngOnDestroy() {

  }
  public addItem(itemData) {
    if(!(this.items.filter(function( obj ) {return obj.ID == itemData.ID;}).length > 0)) {
      this.items.push(itemData);
    }
  }

  public selectItem(itemId, tc?) {
    let index = this.items.findIndex(x => x.ID == itemId);
    this.selectedItemIndex = index;
    this.onSelect.emit({file:this.items[index], tc:tc});
  }

  public loadComponentData() {
  };

  public refresh() {
  };
}
