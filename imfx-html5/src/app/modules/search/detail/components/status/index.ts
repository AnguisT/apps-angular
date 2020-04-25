/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusComponent} from './status';
@NgModule({
    declarations: [
        StatusComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        StatusComponent,
    ],
})
export class StatusModule {
}