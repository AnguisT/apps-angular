/**
 * Created by dvvla on 28.09.2017.
 */

import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {SimplifiedItemSettingsComponent} from "../../../../../../../../../modules/settings/simplified/item/simplified.item.settings.component";

@Component({
  selector: 'settings-groups-detail-item-layout',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    //SettingsGroupsService
  ]
})

export class SettingsGroupsDetailsItemLayoutComponent implements OnInit {
  @ViewChild('simplifiedItemSettingsComponent') private simplifiedItemSettingsComponent: SimplifiedItemSettingsComponent;
  @Input('context') private context: any;
  @Output('simplifiedItemSettings') private simplifiedItemSettings: EventEmitter<any> = new EventEmitter<any>();

  private simplifiedItem: any = {};

  constructor() {
      this.simplifiedItem = {
          "VersionId": "VersionId",
          "Title": "Item Title",
          "SeriesId": "Series Id",
          "VersionId1": "Version Id",
          "Synopsis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce erat sem, dapibus quis dui quis, pulvinar laoreet mauris. Pellentesque fermentum, lectus sed tincidunt fringilla, erat diam tempor ipsum, laoreet faucibus mi enim vitae elit. Morbi porttitor nulla nec nulla fringilla aliquet. Fusce ultrices finibus lectus vel egestas. Integer facilisis enim dui, nec aliquam lorem euismod et. Aliquam orci sem, ultrices ac eros at, euismod facilisis ex. Maecenas eget libero eget ex egestas tincidunt. Praesent vitae ipsum a felis egestas tempus. Nullam tempor, sapien sed interdum posuere, tortor dui mattis sem, a ullamcorper enim tortor quis ex.",
          "Duration": "00:30",
          "TxDate": null,
          "ItemType": "Item Type",
          "IsHD": false,
          "ThumbUrl": null, //"http://192.168.90.39/getfile.aspx?id=3006717",
          "ProxyUrl": null,
          "IsSeries": true,
          "SeriesTitle": "Series Title",
          "SeasonTitle": "Season Title",
          "EpisodeNo": "Episode #",
          "SeasonNo": "Season #",
          "PlayerType": null
      };
  }

  ngOnInit() {
    let self = this;
    this.context.simplifiedItemSettings.subscribe((res) => {
        self.simplifiedItemSettingsComponent.preheatSettings(res.id, res.data);
    });
    this.simplifiedItemSettings.emit(this);
  }
}
