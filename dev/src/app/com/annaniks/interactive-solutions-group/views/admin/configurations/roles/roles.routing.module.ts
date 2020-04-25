import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesView } from './roles.view';


const rolesRoutes: Routes = [
    { path: '', component: RolesView }
];

@NgModule({
    imports: [RouterModule.forChild(rolesRoutes)],
    exports: [RouterModule],

})
export class RolesRoutingModule { }
