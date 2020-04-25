/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {SearchSavedComponent} from './search.saved';
import {IMFXControlsSelect2Module} from "../../controls/select2/index";

@NgModule({
    declarations: [
        SearchSavedComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
        IMFXControlsSelect2Module
    ],
    exports: [
        SearchSavedComponent
    ],
})
export class SearchSavedModule {
}
