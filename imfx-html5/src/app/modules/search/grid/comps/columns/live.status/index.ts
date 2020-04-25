import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LiveStatusColumnComponent} from "./live.status";
@NgModule({
    declarations: [
        LiveStatusColumnComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
      LiveStatusColumnComponent,
    ],
})
export class LiveStatusColumnModule {
}
