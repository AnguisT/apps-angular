/**
 * Created by Sergey Trizna on 27.06.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
// imfx modules
import {TranslateModule} from 'ng2-translate';

// components
import {SimplifiedFacetComponent} from "./simplified.facet.component";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SimplifiedFacetComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
    ],
    exports: [
        SimplifiedFacetComponent
    ]
})
export class SimplifiedFacetModule {
}
