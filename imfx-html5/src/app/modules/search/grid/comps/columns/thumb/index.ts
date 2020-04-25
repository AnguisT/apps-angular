/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMFXHtmlPlayerModule } from '../../../../../controls/html.player/index';
import { ThumbModule } from '../../../../../controls/thumb/index';
import { ThumbColumnComponent } from './thumb';
@NgModule({
    declarations: [
        ThumbColumnComponent,
    ],
    imports: [
        CommonModule,
        //IMFXHtmlPlayerModule,
        ThumbModule
    ],
    exports: [
        ThumbColumnComponent,
    ],
})
export class ThumbColumnModule {

}
