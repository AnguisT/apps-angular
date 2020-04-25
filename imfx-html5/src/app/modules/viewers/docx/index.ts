/**
 * Created by Sergey Trizna on 27.04.2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCXViewerComponent } from './docx';
import { TranslateModule } from 'ng2-translate';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DOCXViewerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        DOCXViewerComponent
    ],
    entryComponents: [
    ]
})
export class DOCXViewerModule {
}
