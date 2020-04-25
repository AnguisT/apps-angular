import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {ModalModule as ng2Module} from 'ngx-bootstrap';
import {IMFXModalComponent} from './imfx-modal';
import {IMFXModalAlertComponent} from "./alert";

@NgModule({
    declarations: [
        // Comps
        IMFXModalAlertComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
        ng2Module
    ],
    exports: [
        IMFXModalAlertComponent,
    ],
    entryComponents: [
        IMFXModalAlertComponent
    ]
})

export class IMFXModalAlertModule {
}
