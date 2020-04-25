import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubcontractorView } from './subcontractor.view';

let subcontractorRoutes: Routes = [
    { path: '', component: SubcontractorView }
]

@NgModule({
    imports: [RouterModule.forChild(subcontractorRoutes)],
    exports: [RouterModule]
})
export class SubcontractorRoutingModule { }