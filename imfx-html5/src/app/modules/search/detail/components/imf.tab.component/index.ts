import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SlickGridModule} from "../../../slick-grid/index";
import {TranslateModule} from "ng2-translate";
import {IMFTabComponent} from "./imf.tab.component";
import {XMLModalModule} from "./comps/xml.modal/index";
import {XMLModalComponent} from "./comps/xml.modal/xml.modal";
import {IMFXMLTreeComponent} from "../../../../controls/xml.tree/imfx.xml.tree";
import {ModalModule} from "../../../../modal/index";

// imfx modules


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    IMFTabComponent,
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SlickGridModule,
    XMLModalModule,
    ModalModule
  ],
  exports: [
    IMFTabComponent
  ],
  entryComponents: [
    XMLModalComponent,
    IMFXMLTreeComponent
  ]
})
export class IMFTabModule {}
