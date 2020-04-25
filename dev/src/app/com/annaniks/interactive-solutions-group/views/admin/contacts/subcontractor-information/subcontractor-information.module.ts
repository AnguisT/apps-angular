import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { SubcontractorsInformationView } from './subcontractor-information.view';
import { SubcontractorInformationRoutingModule } from './subcontractor-information.routing.module';



@NgModule({
    declarations:[SubcontractorsInformationView],
    imports:[SubcontractorInformationRoutingModule,SharedModule],
    providers:[]
})
export class SubcontractorInformationModule{}