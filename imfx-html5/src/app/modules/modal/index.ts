/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { ModalModule as ng2Module } from 'ngx-bootstrap';
import { ModalComponent } from './modal';

// default contents
// blank modal
import { ModalBlankContentComponent } from './comps/blank/content';
// error
import { ModalErrorContentComponent } from './comps/error/content';
// success
import { ModalSuccessContentComponent } from './comps/success/content';
// confirm
import { ModalConfirmContentComponent } from './comps/confirm/content';
// prompt
import { ModalPromptContentComponent } from './comps/prompt/content';
// warning
import { ModalWarningContentComponent } from './comps/warning/content';

@NgModule({
    declarations: [
        // Comps
        ModalComponent,
        // blank
        ModalBlankContentComponent,
        // error
        ModalErrorContentComponent,
        // success
        ModalSuccessContentComponent,
        // confirm
        ModalConfirmContentComponent,
        // prompt
        ModalPromptContentComponent,
        // warning
        ModalWarningContentComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        ng2Module
    ],
    exports: [
        ModalComponent,
    ],
    entryComponents: [
        // Comps
        ModalComponent,
        // blank
        ModalBlankContentComponent,
        // error
        ModalErrorContentComponent,
        // success
        ModalSuccessContentComponent,
        // confirm
        ModalConfirmContentComponent,
        // prompt
        ModalPromptContentComponent,
        // warning
        ModalWarningContentComponent
    ]
})
export class ModalModule {
}
