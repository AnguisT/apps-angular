import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MisrAccordionComponent} from './accordion';
@NgModule({
    declarations: [
        MisrAccordionComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        MisrAccordionComponent,
    ],
})
export class MisrAccordionModule {
}