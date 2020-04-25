import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { AngularSplitModule } from 'angular-split';
import {XMLModalComponent} from "./xml.modal";
import {OverlayModule} from "../../../../../../overlay/index";
import {IMFXXMLTreeModule} from "../../../../../../controls/xml.tree/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      XMLModalComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        AngularSplitModule,
        IMFXXMLTreeModule,
        OverlayModule
    ],
    exports: [
      XMLModalComponent
    ],
    entryComponents: [
    ]
})
export class XMLModalModule {
}
