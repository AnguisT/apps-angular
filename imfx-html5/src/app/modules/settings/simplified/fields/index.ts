/**
 * Created by Sergey Trizna on 24.08.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// imfx modules
import {TranslateModule} from 'ng2-translate';
import {SettingsSimplifiedFieldsComponent} from "./modal.fields";
import {FormsModule} from "@angular/forms";
import {KeysPipeModule} from "../../../pipes/keysPipe/index";
import {OrderByModule} from "../../../pipes/orderBy/index";
import {FilterPipeModule} from "../../../pipes/filterPipe/index";
import {SettingsFieldsForSimplifedSearchByName} from "./pipes/byName.pipe";

// components


@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SettingsSimplifiedFieldsComponent,
        SettingsFieldsForSimplifedSearchByName
    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        FilterPipeModule,
        OrderByModule,
        KeysPipeModule,
    ],
    exports: [
        SettingsSimplifiedFieldsComponent
    ],
    entryComponents: [
        SettingsSimplifiedFieldsComponent
    ]
})
export default class SettingsSimplifiedFieldsModule {
}
