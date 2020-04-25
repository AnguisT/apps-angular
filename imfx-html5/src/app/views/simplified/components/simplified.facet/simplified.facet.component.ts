/**
 * Created by Sergey Klimeko on 09.02.2017.
 */
import {Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'simplified-facet-component',
    templateUrl: '/tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})

/**
 * Simplified item
 */
export class SimplifiedFacetComponent {
  @Input() facet;
  @Input() activeFields;
  @Output() selectedFilters:EventEmitter<any> = new EventEmitter();
  private searchCriteria = {};
  private activeField = null;

  constructor() {

  }

  collectSearchCriteria(fieldId, value) {
    if(this.activeField != value) {
      this.activeField = value;
      this.searchCriteria = {fieldId: fieldId, value: value};
      this.selectedFilters.emit(this.searchCriteria);
    } else {
      this.activeField = null;
      this.searchCriteria = {fieldId: fieldId, value: null};
      this.selectedFilters.emit(this.searchCriteria);
    }
  }

  ngOnInit() {
    for(var i = 0; i < this.activeFields.length; i++) {
      for(var j = 0; j < this.facet.FacetItems.length; j++) {
        if(this.facet.FacetItems[j].Facet == this.activeFields[i].FieldId) {
          this.activeField = this.activeFields[i].Value;
        }
      }
    }
  }
}
