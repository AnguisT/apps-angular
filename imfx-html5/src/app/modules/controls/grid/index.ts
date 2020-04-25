import {NgModule} from "@angular/core";
import {IMFXGrid} from "./grid";
import {AgGridModule} from "ag-grid-ng2";
import {ThumbColumnComponent} from "../../search/grid/comps/columns/thumb/thumb";
import {IconsColumnComponent} from "../../search/grid/comps/columns/icons/icons";
import {BasketColumnComponent} from "../../search/grid/comps/columns/basket/basket";
import {ProgressColumnComponent} from "../../search/grid/comps/columns/progress/progress";
import {SettingsColumnComponent} from "../../search/grid/comps/columns/settings/settings";
import {GridRowsDetailComponent} from "../../search/grid/comps/rows/detail/detail";
import {StatusColumnComponent} from "../../search/grid/comps/columns/status/status";
import {TranslateModule} from "ng2-translate";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TreeModule} from "angular-tree-component";
import {IMFXControlsSelect2Component} from "../select2/imfx.select2";
@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXGrid
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TreeModule,
    AgGridModule.withComponents([
      // ThumbColumnComponent,
      // StatusColumnComponent,
      // IconsColumnComponent,
      // BasketColumnComponent,
      // ProgressColumnComponent,
      // SettingsColumnComponent,
      // GridRowsDetailComponent
    ]),
  ],
  exports: [
    IMFXGrid
  ]
})
export class IMFXGridModule {}
