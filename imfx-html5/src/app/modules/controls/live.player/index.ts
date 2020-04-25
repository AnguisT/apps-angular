import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from 'ng2-translate';
import {LivePlayerComponent} from "./live.player";
@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      LivePlayerComponent
    ],
    imports: [
        //BrowserModule,
        FormsModule,
        CommonModule,
        TranslateModule
    ],
    exports: [
      LivePlayerComponent
    ]
})
export class LivePlayerModule {
}
