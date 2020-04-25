import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from '../modal/index';
import { ModalPreviewPlayerComponent } from './modal.preview.player';
//import { IMFXHtmlPlayerModule } from '../controls/html.player/index';
import { IMFXHtmlPlayerComponent } from '../controls/html.player/imfx.html.player';
import {SimplePreviewPlayerModule} from "../controls/simple.preview.player/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      ModalPreviewPlayerComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        ModalModule,
        SimplePreviewPlayerModule
        //IMFXHtmlPlayerModule
    ],
    exports: [

    ],
    entryComponents: [
      ModalPreviewPlayerComponent,
      IMFXHtmlPlayerComponent
    ]
})

export class ModalPreviewPlayerModule {
}
