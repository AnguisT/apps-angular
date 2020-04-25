import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { ManagersView } from './managers.view';
import { ManagersRoutingModule } from './managers.routing.module';


@NgModule({
    declarations:[ManagersView],
    imports:[ManagersRoutingModule,SharedModule],
    providers:[],
    entryComponents:[]
})
export class ManagersModule{}