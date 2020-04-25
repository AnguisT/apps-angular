import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubcontractorsInformationView } from './subcontractor-information.view';

let subcontractorInformationRoutes: Routes = [
    {
        path: '', component: SubcontractorsInformationView
    },
]

@NgModule({
    imports: [RouterModule.forChild(subcontractorInformationRoutes)],
    exports: [RouterModule]
})
export class SubcontractorInformationRoutingModule { }