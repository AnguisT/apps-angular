/**
 * Created by Sergey Trizna on 29.05.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

// imfx modules
import {RangeDateTimePickerComponent} from './range.date.time.picker';
import {IMFXControlsDateTimePickerModule} from "../datetimepicker/index";
import {TranslateModule} from "ng2-translate";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        RangeDateTimePickerComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        IMFXControlsDateTimePickerModule,
        TranslateModule
    ],
    exports: [
        RangeDateTimePickerComponent,
    ]
})
export class RangeDateTimePickerModule {
}
