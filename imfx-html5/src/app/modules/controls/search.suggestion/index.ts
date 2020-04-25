import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from 'ng2-translate';

// imfx modules
import {IMFXSearchSuggestionComponent} from './imfx.search.suggestion';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXSearchSuggestionComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TranslateModule
    ],
    exports: [
        IMFXSearchSuggestionComponent,
    ]
})
export class IMFXSearchSuggestionModule {}
