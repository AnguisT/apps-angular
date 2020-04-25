/**
 * Created by Sergey Trizna on 03.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from 'ng2-translate';
import {AngularSplitModule} from 'angular-split';
import {FilterPipeModule} from '../../pipes/filterPipe/index';
import {IMFXControlsTreeModule} from '../../controls/tree';
import {TaxonomyComponent} from "./taxonomy";
@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        TaxonomyComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        AngularSplitModule,
        FilterPipeModule,
        IMFXControlsTreeModule
    ],
    exports: [
        TaxonomyComponent
    ],
    entryComponents: [
        TaxonomyComponent
    ]
})
export class TaxonomyModule {
}
