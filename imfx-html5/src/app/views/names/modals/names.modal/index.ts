import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import {NamesModalComponent} from "./names.modal.component";
import {IMFXControlsSelect2Module} from "../../../../modules/controls/select2/index";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        NamesModalComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IMFXControlsSelect2Module,
        FormsModule
    ]
})
export default class NamesModalModule {

}
