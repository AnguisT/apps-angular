import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {TranslateModule} from "ng2-translate";
import {IMFXMetadataTabComponent} from "./imfx.metadata.tab.component";
import {IMFXXMLTreeModule} from "../../../../controls/xml.tree/index";
import {IMFXSimpleTreeModule} from "../../../../controls/simple.tree/index";
import {ModalModule} from "../../../../modal/index";

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFXMetadataTabComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IMFXXMLTreeModule,
    IMFXSimpleTreeModule,
    ModalModule
  ],
  exports: [
    IMFXMetadataTabComponent,
  ]
})
export class IMFXMetadataTabModule {}
