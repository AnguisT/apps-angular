/**
 * Created by Sergey Trizna on 27.06.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// imfx modules
import {TranslateModule} from 'ng2-translate';
import {OverlayModule} from '../../../../modules/overlay/index';


// components
import {SimplifiedDetailComponent} from "./simplified.detail.component";
import {IMFXSilverlightPlayerModule} from "../../../../modules/controls/silverlight.player/index";
import {IMFXSubtitlesGridModule} from "../../../../modules/search/detail/components/subtitles.grid.component/index";
import {IMFXHtmlPlayerModule} from "../../../../modules/controls/html.player/index";
import {ThumbColumnModule} from "../../../../modules/search/grid/comps/columns/thumb/index";
import {GridStackModule} from "../../../../modules/controls/gridstack/index";


@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SimplifiedDetailComponent,
    ],
    imports: [
        IMFXSilverlightPlayerModule,
        IMFXSubtitlesGridModule,
        IMFXHtmlPlayerModule,
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        GridStackModule,
        ThumbColumnModule,
        OverlayModule
    ],
    exports: [
        SimplifiedDetailComponent
    ]
})
export class SimplifiedDetailModule {
}
