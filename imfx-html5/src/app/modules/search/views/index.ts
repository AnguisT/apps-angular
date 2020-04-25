/**
 * Created by Sergey Trizna on 03.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from 'ng2-translate';
import {SearchViewsComponent} from './views';
import {IMFXControlsSelect2Module} from '../../controls/select2';

import {ModalModule} from '../../modal';
@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SearchViewsComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ModalModule,
        IMFXControlsSelect2Module
    ],
    exports: [
        SearchViewsComponent
    ],
    entryComponents: []
})
export class SearchViewsModule {
}
