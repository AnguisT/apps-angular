import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { PartnerInformationRoutingModule } from './partner-information.routing.module';
import { PartnerInformationView } from './partner-information.view';



@NgModule({
    declarations:[PartnerInformationView],
    imports:[PartnerInformationRoutingModule,SharedModule],
    providers:[]
})
export class PartnerInformationModule{}