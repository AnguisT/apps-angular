/**
 * Created by Sergey Trizna on 17.12.2016.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';

// imfx modules
import {IMFXControlsSelect2Component} from './imfx.select2';
import {IMFXControlsLookupsSelect2Component} from './imfx.select2.lookups';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXControlsSelect2Component,
        IMFXControlsLookupsSelect2Component
    ],
    imports: [
        TranslateModule,
        // FormsModule,
        // ReactiveFormsModule,
        CommonModule,
    ],
    exports: [
        IMFXControlsSelect2Component,
        IMFXControlsLookupsSelect2Component
    ],
})
export class IMFXControlsSelect2Module {}
