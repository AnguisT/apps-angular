import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AccountView } from './account.view';

let AccountRoutes:Routes = [
    {path:'',component:AccountView}
]

@NgModule({
    imports: [RouterModule.forChild(AccountRoutes)],
    exports: [RouterModule]
})
export class AccountRoutingModule{}