/**
 * Created by Sergey Trizna on 27.04.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodePrettiffyViewerComponent} from './codeprettify';
import {TranslateModule} from "ng2-translate";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        CodePrettiffyViewerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        CodePrettiffyViewerComponent
    ],
    entryComponents: [
    ]
})
export class CodePrettifyViewerModule {
}
