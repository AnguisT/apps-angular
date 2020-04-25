/**
 * Created by Sergey Trizna on 03.03.2017.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {SlickGridComponent} from "./slick-grid";
// import {StatusColumnModule} from "./comps/columns/status/index";
import {BsDropdownModule} from "ngx-bootstrap";
// import {LabelStatusColumnComponent} from "./comps/columns/label.status/label.status";
// import {LabelStatusColumnModule} from "./comps/columns/label.status/index";
// import {LiveStatusColumnComponent} from "./comps/columns/live.status/live.status";
// import {LiveStatusColumnModule} from "./comps/columns/live.status/index";
import {ProgressModule} from "../../controls/progress/index";
import {ProgressComponent} from "../../controls/progress/progress";
import {OverlayModule} from "../../overlay/index";
import {ThumbnailFormatterComp} from "./formatters/thumbnail/thumbnail.formatter";
import {TagFormatterComp} from "./formatters/tag/tag.formatter";
import {ThumbModule} from "../../controls/thumb/index";
import {TagsModule} from "../../controls/tags/index";
import {StatusFormatterComp} from "./formatters/status/status.formatter";
import {ProgressFormatterComp} from "./formatters/progress/progress.formatter";
import {SettingsFormatterComp} from "./formatters/settings/settings.formatter";
import {TileFormatterComp} from "./formatters/tile/tile.formatter";
import {BasketFormatterComp} from "./formatters/basket/basket.formatter";
import {IconsFormatterComp} from "./formatters/icons/icons.formatter";
import {IsLiveFormatterComp} from "./formatters/islive/islive.formatter";
import {JobStatusFormatterComp} from "./formatters/job-status/job-status";

// import {TreeFormatterComp} from "./formatters/tree/tree.formatter";
import {SafePipeModule} from "../../pipes/safePipe/index";
import {DatetimeFormatterComp} from "./formatters/datetime/datetime.formatter";
import {LocalDateModule} from "../../pipes/localDate/index";
import {TaskStatusFormatterComp} from "./formatters/task-status/task-status";
import {TaskProgressFormatterComp} from "./formatters/task-progress/task-progress";
import {Select2FormatterComp} from "./formatters/select2/select2.formatter";
import {IMFXControlsSelect2Module} from "../../controls/select2/index";
import {TextFormatterComp} from "./formatters/text/text.formatter";
import {PlayButtonFormatterComp} from "./formatters/play-button/play-button.formatter";

import { SubtitleFormatterComp } from './formatters/subtitle/subtitle.formatter';

import {DragDropFormatterComp} from "./formatters/dragdrop/dragdrop.comp";
import {DragDropFormatterModule} from "./formatters/dragdrop/index";
import {ColorIndicatorFormatterComp} from "./formatters/color-indicator/color.indicator.formatter";
import {SlickGridPanelBottomModule} from "./comps/panels/bottom/index";
import {SlickGridPanelTopModule} from "./comps/panels/top/index";
import {VersionIconsFormatterComp} from "./formatters/versions.icons/versions.icons.formatter";
import {PreviewImfDetailsFormatterComp} from "./formatters/preview-imf-details/preview-imf-details.formatter";
import {ModalModule} from "../../modal/index";
import {CacheManagerStatusComp} from "../../../views/cachemanager/modules/status/cm-status";
import {CacheManagerStatusModule} from "../../../views/cachemanager/modules/status";
import { DeleteSettingsGroupsFormatterComp } from './formatters/delete-settings-groups/delete.settings.group.formatter';
// import {TreePaddingFormatter} from "./formatters/tree/tree.padding.formatter";
// ng2 modules
// import {ThumbColumnComponent} from "./comps/columns/thumb/thumb";
// import {StatusColumnComponent} from "./comps/columns/status/status";
// import {IconsColumnComponent} from "./comps/columns/icons/icons";
// import {PlayIconColumnComponent} from "./comps/columns/play.icon/play.icon";
// import {BasketColumnComponent} from "./comps/columns/basket/basket";
// import {ProgressColumnComponent} from "./comps/columns/progress/progress";
// import {SettingsColumnComponent} from "./comps/columns/settings/settings";
// import {GridRowsDetailComponent} from "./comps/rows/detail/detail";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SlickGridComponent,
        // ThumbColumnComponent,
        // StatusColumnComponent,
        // IconsColumnComponent,
        // PlayIconColumnComponent,
        // BasketColumnComponent,
        // ProgressColumnComponent,
        // SettingsColumnComponent,
        // GridRowsDetailComponent,
        ThumbnailFormatterComp,
        StatusFormatterComp,
        SettingsFormatterComp,
        TileFormatterComp,
        BasketFormatterComp,
        IconsFormatterComp,
        IsLiveFormatterComp,
        ProgressFormatterComp,
        JobStatusFormatterComp,
        TaskStatusFormatterComp,
        TagFormatterComp,

        DatetimeFormatterComp,
        TaskProgressFormatterComp,
        Select2FormatterComp,
        TextFormatterComp,
        PlayButtonFormatterComp,
        SubtitleFormatterComp,
        ColorIndicatorFormatterComp,
        VersionIconsFormatterComp,
        PreviewImfDetailsFormatterComp,
        DeleteSettingsGroupsFormatterComp
        // TreeFormatterComp,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        // IMFXGridModule,
        BsDropdownModule.forRoot(),
        // StatusColumnModule,
        // LabelStatusColumnModule,
        // LiveStatusColumnModule,
        ProgressModule,
        OverlayModule,
        ThumbModule,
        TagsModule,
        SafePipeModule,
        LocalDateModule,
        IMFXControlsSelect2Module,
        DragDropFormatterModule,
        SlickGridPanelBottomModule,
        SlickGridPanelTopModule,
        ModalModule,
        CacheManagerStatusModule
    ],
    exports: [
        SlickGridComponent,
        ThumbnailFormatterComp,
        StatusFormatterComp,
        TileFormatterComp,
        BasketFormatterComp,
        IconsFormatterComp,
        IsLiveFormatterComp,
        ProgressFormatterComp,
        JobStatusFormatterComp,
        TaskStatusFormatterComp,
        TagFormatterComp,
        DatetimeFormatterComp,
        TaskProgressFormatterComp,
        Select2FormatterComp,
        TextFormatterComp,
        PlayButtonFormatterComp,
        DragDropFormatterComp,
        ColorIndicatorFormatterComp,
        VersionIconsFormatterComp,
        PreviewImfDetailsFormatterComp,
        DeleteSettingsGroupsFormatterComp
        // TreeFormatterComp
    ],
    entryComponents: [
        // StatusColumnComponent,
        // LabelStatusColumnComponent,
        // LiveStatusColumnComponent,
        // IconsColumnComponent,
        // PlayIconColumnComponent,
        // BasketColumnComponent,
        // ProgressColumnComponent,
        ProgressComponent,
        // SettingsColumnComponent,
        // GridRowsDetailComponent,
        ThumbnailFormatterComp,
        StatusFormatterComp,
        SettingsFormatterComp,
        TileFormatterComp,
        BasketFormatterComp,
        IconsFormatterComp,
        IsLiveFormatterComp,
        ProgressFormatterComp,
        JobStatusFormatterComp,
        TaskStatusFormatterComp,
        TagFormatterComp,
        DatetimeFormatterComp,
        TaskProgressFormatterComp,
        Select2FormatterComp,
        TextFormatterComp,
        PlayButtonFormatterComp,
        SubtitleFormatterComp,
        DragDropFormatterComp,
        ColorIndicatorFormatterComp,
        VersionIconsFormatterComp,
        PreviewImfDetailsFormatterComp,
        CacheManagerStatusComp,
        DeleteSettingsGroupsFormatterComp
        // TreeFormatterComp
    ],
})
export class SlickGridModule {
}
