/**
 * Created by Sergey Trizna on 27.06.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// imfx modules
import {TranslateModule} from 'ng2-translate';
import {GridStackModule} from "../../../../modules/controls/gridstack/index";

// components
import {SimplifiedItemComponent} from "./simplified.item.component";
import {IMFXSilverlightPlayerModule} from "../../../../modules/controls/silverlight.player/index";
import {IMFXSubtitlesGridModule} from "../../../../modules/search/detail/components/subtitles.grid.component/index";
import {IMFXHtmlPlayerModule} from "../../../../modules/controls/html.player/index";

import {ThumbColumnModule} from '../../../../modules/search/grid/comps/columns/thumb/index';
import {RouterModule} from "@angular/router";

import { ThumbModule } from '../../../../modules/controls/thumb/index'


@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SimplifiedItemComponent,
    ],
    imports: [
        IMFXSilverlightPlayerModule,
        IMFXSubtitlesGridModule,
        IMFXHtmlPlayerModule,
        TranslateModule,
        CommonModule,
        GridStackModule,
        ThumbColumnModule,
        RouterModule,
        ThumbModule
    ],
    exports: [
        SimplifiedItemComponent
    ]
})
export class SimplifiedItemModule {
}
