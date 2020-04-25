/**
 * Created by Sergey Trizna on 27.04.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PDFViewerComponent} from './pdf';
import {TranslateModule} from "ng2-translate";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        PDFViewerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        PDFViewerComponent
    ],
    entryComponents: [
    ]
})
export class PDFViewerModule {
}
