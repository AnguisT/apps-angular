import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditPartnerView } from './edit-partner.view';

let editPartnerRoutes: Routes = [
    {
        path: '', component:EditPartnerView 
    },
]

@NgModule({
    imports: [RouterModule.forChild(editPartnerRoutes)],
    exports: [RouterModule]
})
export class EditPartnerRoutingModule { }