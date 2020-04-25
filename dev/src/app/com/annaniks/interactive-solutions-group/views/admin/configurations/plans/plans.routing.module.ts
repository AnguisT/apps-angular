import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { PlansView } from './plans.view';


let plansRoutes:Routes = [
    { path:'',component:PlansView }
]

@NgModule({
    imports:[RouterModule.forChild(plansRoutes)],
    exports:[RouterModule],

})
export class PlansRoutingModule{}