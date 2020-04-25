/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasketColumnComponent} from './basket';
@NgModule({
    declarations: [
        BasketColumnComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        BasketColumnComponent,
    ],
})
export class BasketColumnModule {
}