/**
 * Created by dvvla on 28.09.2017.
 */

import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Input, ViewChild, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'settings-groups-detail-search-by-fields',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    //SettingsGroupsService
  ]
})

export class SettingsGroupsDetailsSearchByFieldsComponent implements OnInit {
  @Input('searchFields') private searchFields: any;
  @Output('changeFields') private changeFields: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

  changeSearchFields() {
    this.changeFields.emit();
  }
}
