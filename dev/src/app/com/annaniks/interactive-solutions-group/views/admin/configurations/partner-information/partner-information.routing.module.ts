import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PartnerInformationView } from './partner-information.view';

let partnerInfoRoutes: Routes = [
    {
        path: '', component:PartnerInformationView 
    },
]

@NgModule({
    imports: [RouterModule.forChild(partnerInfoRoutes)],
    exports: [RouterModule]
})
export class PartnerInformationRoutingModule { }