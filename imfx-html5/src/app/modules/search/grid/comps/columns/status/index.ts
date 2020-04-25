/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusColumnComponent} from './status';
@NgModule({
    declarations: [
        StatusColumnComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        StatusColumnComponent,
    ],
})
export class StatusColumnModule {
}