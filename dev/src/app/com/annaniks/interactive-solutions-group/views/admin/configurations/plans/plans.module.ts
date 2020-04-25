import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { PlansView } from './plans.view';
import { PlansRoutingModule } from './plans.routing.module';
import { CalendarModule } from 'primeng/calendar';
import { AddPlanDialog } from '../../../../dialogs/add-plan/add-plan.dialog';
import { MatCardModule } from '@angular/material';

@NgModule({
    declarations: [PlansView, AddPlanDialog],
    imports: [PlansRoutingModule, SharedModule, CalendarModule, MatCardModule],
    providers: [],
    entryComponents: [AddPlanDialog]
})
export class PlansModule { }
