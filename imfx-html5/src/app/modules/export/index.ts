import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from '../modal/index';
import { ExportComponent } from './export';
import { OverlayModule } from '../overlay/index';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ExportComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        ModalModule,
        OverlayModule
    ],
    exports: [
    ],
    entryComponents: [
        ExportComponent
    ]
})
export class ExportModule {
}
