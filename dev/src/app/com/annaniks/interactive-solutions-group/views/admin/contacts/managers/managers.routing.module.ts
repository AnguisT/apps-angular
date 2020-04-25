import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagersView } from './managers.vew';


let managerRoutes: Routes = [
    { path: '', component: ManagersView }
]

@NgModule({
    imports: [RouterModule.forChild(managerRoutes)],
    exports: [RouterModule]
})
export class ManagerRoutingModule { }