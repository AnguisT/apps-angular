import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManagerInformationView } from './manager-information.view';


let managerInformationRoutes: Routes = [
    {
        path: '', component: ManagerInformationView
    },
]

@NgModule({
    imports: [RouterModule.forChild(managerInformationRoutes)],
    exports: [RouterModule]
})
export class ManagerInformationRoutingModule { }