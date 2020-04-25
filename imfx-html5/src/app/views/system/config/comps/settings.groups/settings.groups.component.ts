import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation} from "@angular/core";
import {GridOptions} from "ag-grid";
import {SettingsGroupsService} from "../../../../../services/system.config/settings.groups.service";
import {SettingsGroupsGridComponent} from "./comps/grid/settings.groups.grid.component";
import {SettingsGroupsDetailsComponent} from "./comps/details/settings.groups.details.component";
@Component({
  selector: 'settings-groups-manager',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  entryComponents: [
    SettingsGroupsGridComponent,
    SettingsGroupsDetailsComponent
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
   // SettingsGroupsService
  ]
})

export class SettingsGroupsComponent implements OnInit {

  private mode: "details" | "grid" = "grid"
  @ViewChild('settingsGroupDetails') set content(content: ViewContainerRef) {
    (<any>this).settingsGroupDetails = content;
  } settingsGroupDetails : SettingsGroupsDetailsComponent;


  constructor(private cdr: ChangeDetectorRef,
             /* private settingsGroupsService: SettingsGroupsService*/) {

  };

  ngOnInit() {
  }

  selectSettingsGroup(ug) {
    this.toDetails();
    this.cdr.detectChanges();
    this.settingsGroupDetails.setSettingsGroup(ug);
  }

  toDetails() {
    this.mode = "details";
  }

  toGrid() {
    this.mode = "grid";
  }
}
