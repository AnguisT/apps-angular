import { Routes } from '@angular/router';
import { StaffView } from './staff.view';
import { ProcessingView } from './processing/processing.view';
import { TripView } from './trip/trip.view';
import { DayOffView } from './day_off/day_off.view';
import { VacationView } from './vacation/vacation.view';

export const STAFF_ROUTES: Routes = [
    {
        path: '', component: StaffView, children: [
            {path: '', redirectTo: 'processing'},
            {path: 'processing', component: ProcessingView},
            {path: 'trip', component: TripView},
            {path: 'day-off', component: DayOffView},
            {path: 'vacation', component: VacationView}
        ]
    }
];
