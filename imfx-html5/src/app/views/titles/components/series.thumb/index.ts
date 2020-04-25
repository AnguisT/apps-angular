/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SeriesThumbColumnComponent} from './thumb';
@NgModule({
    declarations: [
        SeriesThumbColumnComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        SeriesThumbColumnComponent,
    ],
})
export class SeriesThumbColumnModule {
}
