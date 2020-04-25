/**
 * Created by dvvla on 28.09.2017.
 */

import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {StartSearchFormComponent} from '../../../../../../../../start/components/search/start.search.form.component';

@Component({
  selector: 'settings-groups-detail-search-screen',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    //SettingsGroupsService
  ]
})

export class SettingsGroupsDetailsSearchScreenComponent implements OnInit {
  @Input('context') private context: any;
  @ViewChild('startSearchForm') private startSearchForm: StartSearchFormComponent;
  @Output('startForm') private startForm: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    let self = this;
    this.context.startSearchSettings.subscribe((res) => {
      if (res && res.DATA) {
        let data = JSON.parse(res.DATA);
        self.startSearchForm.setCustomizedParams({
          title: data.Title,
          subtitle: data.Subtitle,
          selectedBackground: data.Background,
          selectedSearchLogo: data.Logo
        });
      } else {
        self.startSearchForm.setCustomizedParams({
          title: '',
          subtitle: '',
          selectedBackground: '',
        });
      }
      self.startForm.emit(self);
    });
  }


}
