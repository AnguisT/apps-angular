import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from 'ng2-translate';
import {AppointmentComponent} from "./appointment";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        AppointmentComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
    ],
    exports: [
        AppointmentComponent
    ],
    entryComponents: [
        AppointmentComponent
    ]
})
export class AppointmentModule {
}
