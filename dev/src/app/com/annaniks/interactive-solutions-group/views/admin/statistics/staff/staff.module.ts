import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared';
import { RouterModule } from '@angular/router';
import { STAFF_ROUTES } from './staff.routing';
import { StaffView } from './staff.view';
import { ProcessingView } from './processing/processing.view';
import { ConfigurationService } from '../../configurations/configuration.service';
import { TripView } from './trip/trip.view';
import { DayOffView } from './day_off/day_off.view';
import { VacationView } from './vacation/vacation.view';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(STAFF_ROUTES),
        SharedModule,
    ],
    providers: [
        ConfigurationService,
    ],
    declarations: [
        StaffView,
        ProcessingView,
        TripView,
        DayOffView,
        VacationView,
    ],
    entryComponents: [
    ]
})
export class StaffModule {
}
