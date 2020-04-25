import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FinanceViewComponent } from './finance.view';

const financeRoutes: Routes = [
    { path: '', component: FinanceViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(financeRoutes)],
    exports: [RouterModule],
})

export class FinanceRoutingModule { }
