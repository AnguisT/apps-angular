import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditSubcontractorView } from './edit-subcontractor.view';


let editSubcontractorRoutes: Routes = [
    {
        path: '', component:EditSubcontractorView 
    },
]

@NgModule({
    imports: [RouterModule.forChild(editSubcontractorRoutes)],
    exports: [RouterModule]
})
export class EditSubcontractorRoutingModule { }