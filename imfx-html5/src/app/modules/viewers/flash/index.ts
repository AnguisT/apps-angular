import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlashViewerComponent} from './flash';
import {TranslateModule} from "ng2-translate";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        FlashViewerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
      FlashViewerComponent
    ],
    entryComponents: [
    ]
})
export class FlashViewerModule {
}
