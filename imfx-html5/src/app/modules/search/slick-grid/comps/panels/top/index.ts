/**
 * Created by Sergey Trizna on 05.04.2018.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {SearchSavedComponent} from './search.saved';
import {IMFXControlsSelect2Module} from "../../controls/select2/index";
import {SlickGridPanelTopComp} from "./top.panel.comp";

@NgModule({
    declarations: [
        SlickGridPanelTopComp,
    ],
    imports: [
        TranslateModule,
        CommonModule,
    ],
    exports: [
        SlickGridPanelTopComp
    ],
})
export class SlickGridPanelTopModule {
}
