import { NgModule } from '@angular/core'
import { SharedModule } from '../../../../shared';
import { ManagersView } from './managers.vew';
import { ManagerRoutingModule } from './managers.routing.module';


@NgModule({
    declarations: [ManagersView],
    imports: [ManagerRoutingModule,SharedModule],
    providers: []
})
export class ManagersModule { }