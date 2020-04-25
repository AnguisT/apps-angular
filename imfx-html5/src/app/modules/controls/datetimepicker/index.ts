/**
 * Created by Sergey Trizna on 17.12.2016.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// imfx modules
import {IMFXControlsDateTimePickerComponent} from './imfx.datetimepicker';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXControlsDateTimePickerComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    exports: [
        IMFXControlsDateTimePickerComponent,
    ]
})
export class IMFXControlsDateTimePickerModule {}
