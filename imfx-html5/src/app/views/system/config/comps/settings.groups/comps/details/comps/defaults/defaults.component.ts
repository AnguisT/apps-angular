/**
 * Created by dvvla on 28.09.2017.
 */

import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'settings-groups-detail-defaults',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
  ]
})

export class SettingsGroupsDetailsDefaultsComponent implements OnInit {
  @Input('configDefault') private configDefault: any;
  @Output('defaultSearchEmit') private defaultSearchEmit: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

  searchChange(s) {
    this.defaultSearchEmit.emit(s.target.value);
  }

  selectLogo(index) {
    this.configDefault.logoImages.forEach(function (el, ind) {
      if (ind === index) {
        el.select = true;
      } else {
        el.select = false;
      }
    });
  }

}
