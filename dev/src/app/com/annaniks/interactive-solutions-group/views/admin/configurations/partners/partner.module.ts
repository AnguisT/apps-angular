import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { PartnerRoutingModule } from './partner.routing.module';
import { PartnerView } from './partner.view';


@NgModule({
    declarations:[PartnerView],
    imports:[PartnerRoutingModule,SharedModule],
    providers:[]
})
export class PartnerModule{}