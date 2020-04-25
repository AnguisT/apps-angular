import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { ManagersView } from './managers.view';


let managersRoutes:Routes = [
    { path:'',component:ManagersView }
]

@NgModule({
    imports:[RouterModule.forChild(managersRoutes)],
    exports:[RouterModule],

})
export class ManagersRoutingModule{}