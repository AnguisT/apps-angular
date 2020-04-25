/**
 * Created by Sergey Trizna on 03.03.2017.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {SearchGridComponent} from "./grid";
import {StatusColumnModule} from "./comps/columns/status/index";
import {ThumbColumnModule} from "./comps/columns/thumb/index";
// ng2 modules
import {AgGridModule} from 'ag-grid-ng2/main';
import {ThumbColumnComponent} from './comps/columns/thumb/thumb';
import {StatusColumnComponent} from './comps/columns/status/status';
import {IconsColumnComponent} from './comps/columns/icons/icons';
import {PlayIconColumnComponent} from './comps/columns/play.icon/play.icon';
import {BasketColumnComponent} from './comps/columns/basket/basket';
import {ProgressColumnComponent} from './comps/columns/progress/progress';
import {SettingsColumnComponent} from './comps/columns/settings/settings';
import {GridRowsDetailComponent} from './comps/rows/detail/detail';

import {BsDropdownModule} from "ngx-bootstrap";
import {ProgressModule} from "../../controls/progress/index";
import {ProgressComponent} from "../../controls/progress/progress";
import {IMFXGridModule} from "../../controls/grid/index";
import {LabelStatusColumnComponent} from "./comps/columns/label.status/label.status";
import {LabelStatusColumnModule} from "./comps/columns/label.status/index";
import {LiveStatusColumnComponent} from "./comps/columns/live.status/live.status";
import {LiveStatusColumnModule} from "./comps/columns/live.status/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SearchGridComponent,
        // ThumbColumnComponent,
        // StatusColumnComponent,
        IconsColumnComponent,
        PlayIconColumnComponent,
        BasketColumnComponent,
        ProgressColumnComponent,
        SettingsColumnComponent,
        GridRowsDetailComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IMFXGridModule,
        BsDropdownModule.forRoot(),
        StatusColumnModule,
        LabelStatusColumnModule,
        LiveStatusColumnModule,
        ThumbColumnModule,
        ProgressModule,
    ],
    exports: [
        SearchGridComponent,
    ],
    entryComponents: [
        ThumbColumnComponent,
        StatusColumnComponent,
        LabelStatusColumnComponent,
        LiveStatusColumnComponent,
        IconsColumnComponent,
        PlayIconColumnComponent,
        BasketColumnComponent,
        ProgressColumnComponent,
        ProgressComponent,
        SettingsColumnComponent,
        GridRowsDetailComponent
    ]
})
export class SearchGridModule {
}
