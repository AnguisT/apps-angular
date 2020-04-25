/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressColumnComponent} from './progress';
import {ProgressModule} from "../../../../../controls/progress/index";
import {ProgressComponent} from "../../../../../controls/progress/progress";
@NgModule({
    declarations: [
        ProgressColumnComponent,
    ],
    imports: [
        CommonModule,
        ProgressModule
    ],
    exports: [
        ProgressColumnComponent,
    ],
    entryComponents: [
      ProgressComponent
    ]
})
export class ProgressColumnModule {
}
