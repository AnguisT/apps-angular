
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { ModalModule as ng2Module } from 'ngx-bootstrap';
import { IMFXModalComponent } from './imfx-modal';
import {IMFXModalPromptComponent} from "./prompt";

@NgModule({
    declarations: [
        // Comps
        IMFXModalPromptComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
        ng2Module
    ],
    exports: [
        IMFXModalPromptComponent,
    ],
    entryComponents: [
        IMFXModalPromptComponent
    ]
})

export class IMFXModalPromptModule {
}
