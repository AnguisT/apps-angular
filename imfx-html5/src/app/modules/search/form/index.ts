/**
 * Created by Sergey Trizna on 03.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {SearchFormComponent} from './search.form';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SearchFormComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        SearchFormComponent
    ],
})
export class SearchFormModule {
}
