import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { ManagerInformationView } from './manager-information.view';
import { ManagerInformationRoutingModule } from './manager-information.routing.module';


@NgModule({
    declarations:[ManagerInformationView],
    imports:[ManagerInformationRoutingModule,SharedModule],
    providers:[]
})
export class ManagerInformationModule{}