/**
 * Created by Sergey Trizna on 17.08.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {TranslateModule} from 'ng2-translate';

// components
import {SimplifiedDetailSettingsComponent} from "./simplified.detail.settings.component";
import {GridStackModule} from "../../../controls/gridstack/index";
import {ModalModule} from "../../../modal/index";
import {ThumbColumnModule} from "../../../search/grid/comps/columns/thumb/index";
import {OverlayModule} from "../../../overlay/index";
import {SettingsSimplifiedFieldsComponent} from "../fields/modal.fields";
import SettingsSimplifiedFieldsModule from "../fields/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SimplifiedDetailSettingsComponent,
    ],
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        GridStackModule,
        ModalModule,
        ThumbColumnModule,
        OverlayModule,
        SettingsSimplifiedFieldsModule
    ],
    exports: [
        SimplifiedDetailSettingsComponent
    ],
    entryComponents: [
        SettingsSimplifiedFieldsComponent
    ]
})
export default class SimplifiedDetailSettingsModule {
}
