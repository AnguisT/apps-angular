import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabelStatusColumnComponent} from "./label.status";
@NgModule({
    declarations: [
        LabelStatusColumnComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
      LabelStatusColumnComponent,
    ],
})
export class LabelStatusColumnModule {
}
