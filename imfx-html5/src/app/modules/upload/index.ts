/**
 * Created by Sergey Trizna on 27.04.2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import {
    ComboSingleModule
} from '../search/advanced/comps/criteria/comps/controls/comps/container/comps/combosingle';
import { IMFXControlsSelect2Module } from '../controls/select2';
import { VersionsInsideUploadModule } from './modules/versions/index';
import { ModalModule } from '../modal/index';
import { UploadComponent } from './upload';
import { OverlayModule } from '../overlay/index';
import {IMFXModalComponent} from "../imfx-modal/imfx-modal";
import {IMFXModalModule} from "../imfx-modal";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        UploadComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ComboSingleModule,
        IMFXControlsSelect2Module,
        ModalModule,
        OverlayModule,

        // inside
        VersionsInsideUploadModule,
        IMFXModalModule
    ],
    exports: [
        UploadComponent
    ],
    entryComponents: [
        UploadComponent,
        IMFXModalComponent
    ]
})

export class UploadModule {
}

