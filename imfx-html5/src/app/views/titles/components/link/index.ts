/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusColumnComponent} from './status';
import {LinkColumnComponent} from "./link";
@NgModule({
    declarations: [
        LinkColumnComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        LinkColumnComponent,
    ],
})
export class LinkColumnModule {
}
