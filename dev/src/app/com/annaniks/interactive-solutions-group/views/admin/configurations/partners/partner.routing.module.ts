import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { PartnerView } from './partner.view';


let partnerRoutes: Routes = [
    {
        path: '', component: PartnerView
    },
]

@NgModule({
    imports: [RouterModule.forChild(partnerRoutes)],
    exports: [RouterModule]
})
export class PartnerRoutingModule { }