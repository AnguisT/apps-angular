import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { CompanyView } from './company.view';

let companyRoutes: Routes = [
    {
        path: '', component: CompanyView
    },
]

@NgModule({
    imports: [RouterModule.forChild(companyRoutes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }