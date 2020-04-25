import {NgModule} from "@angular/core";

import {IMFXControlsDateTimePickerModule} from "../../../../modules/controls/datetimepicker/index";
import {IMFXSearchSuggestionModule} from "../../../../modules/controls/search.suggestion/index";
import {IMFXSilverlightPlayerModule} from "../../../../modules/controls/silverlight.player/index";
import {IMFXSubtitlesGridModule} from "../../../../modules/search/detail/components/subtitles.grid.component/index";
import {IMFXHtmlPlayerModule} from "../../../../modules/controls/html.player/index";
import {TranslateModule} from "ng2-translate";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SearchFormModule} from "../../../../modules/search/form/index";
import {ThumbColumnModule} from "../../../../modules/search/grid/comps/columns/thumb/index";
import {GridStackModule} from "../../../../modules/controls/gridstack/index";
import {OverlayModule} from "../../../../modules/overlay/index";
import {StartSearchFormComponent} from "./start.search.form.component";
import {SearchRecentModule} from "../../../../modules/search/recent/index";
import {ThumbModule} from "../../../../modules/controls/thumb/index";

@NgModule({
  declarations: [
    StartSearchFormComponent
  ],
  imports: [
    IMFXControlsDateTimePickerModule,
    IMFXSearchSuggestionModule,
    IMFXSilverlightPlayerModule,
    IMFXSubtitlesGridModule,
    IMFXHtmlPlayerModule,
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    SearchFormModule,
    ThumbColumnModule,
    GridStackModule,
    OverlayModule,
    SearchRecentModule,
    ThumbModule
  ],
  exports: [
    StartSearchFormComponent
  ]
})
export default class StartSearchFormModule {
}
