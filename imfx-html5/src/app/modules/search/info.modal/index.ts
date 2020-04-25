import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {InfoModalComponent} from './info.modal';
import {ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
      InfoModalComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        ModalModule,
        FormsModule
    ],
    exports: [
      InfoModalComponent
    ],
})
export class InfoModalModule {
}
