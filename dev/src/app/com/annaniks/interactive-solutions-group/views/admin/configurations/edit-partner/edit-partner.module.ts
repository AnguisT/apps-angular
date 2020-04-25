import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { EditPartnerRoutingModule } from './edit-partner.routing.module';
import { EditPartnerView } from './edit-partner.view';
import {CalendarModule} from 'primeng/calendar';
import { MatIconModule } from '@angular/material';

@NgModule({
    declarations:[EditPartnerView],
    imports:[EditPartnerRoutingModule,SharedModule,CalendarModule, MatIconModule],
    providers:[],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class EditPartnerModule{}