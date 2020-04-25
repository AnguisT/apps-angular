/**
 * Created by Sergey Trizna on 17.04.2018.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { ModalModule as ng2Module } from 'ngx-bootstrap';
import { IMFXModalComponent } from './imfx-modal';
import {IMFXModalPromptModule} from "./comps/prompt";
import {OverlayModule} from "../overlay";

@NgModule({
    declarations: [
        // Comps
        IMFXModalComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
        ng2Module,
        IMFXModalPromptModule,
        OverlayModule
    ],
    exports: [
        IMFXModalComponent,
    ],
    entryComponents: [
        IMFXModalComponent
    ]
})

export class IMFXModalModule {
}
