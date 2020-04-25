import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from '../modal/index';
import { RaiseWorkflowWizzardComponent } from './rw.wizard';
import { IMFXXMLTreeModule } from '../controls/xml.tree/index';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        RaiseWorkflowWizzardComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        TranslateModule,
        ModalModule,
        IMFXXMLTreeModule
    ],
    exports: [
        // SingleUploadComponent,
        // MultiUploadComponent
    ],
    entryComponents: [
        RaiseWorkflowWizzardComponent
    ]
})

export class RaiseWorkflowWizzardModule {
}
