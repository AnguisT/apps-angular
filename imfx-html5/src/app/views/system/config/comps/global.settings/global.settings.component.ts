import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  SettingsGroupsService
} from '../../../../../services/system.config/settings.groups.service';
import { GlobalSettingsGrafanaComponent } from './comps/grafana/global.settings.grafana.component';
import { GlobalSettingsLoggerComponent } from './comps/logger/global.settings.logger.component';
import {ProfileService} from "../../../../../services/profile/profile.service";
@Component({
  selector: 'global-settings-manager',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  entryComponents: [
    GlobalSettingsGrafanaComponent,
    GlobalSettingsLoggerComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    SettingsGroupsService
  ]
})

export class GlobalSettingsComponent implements OnInit {

  private mode = 'grafana';

  constructor(private cdr: ChangeDetectorRef,
              private settingsGroupsService: SettingsGroupsService) {

  };

  ngOnInit() {
  }
}
