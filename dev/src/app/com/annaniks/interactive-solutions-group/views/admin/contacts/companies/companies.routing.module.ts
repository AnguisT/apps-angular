import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesView } from './companies.view';

let companiesRoutes: Routes = [
    { path: '', component: CompaniesView }
]

@NgModule({
    imports: [RouterModule.forChild(companiesRoutes)],
    exports: [RouterModule]
})
export class CompaniesRoutingModule { }