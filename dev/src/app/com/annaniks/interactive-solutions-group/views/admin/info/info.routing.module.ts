import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { InfoView } from './info.view';

let InfoRoutes:Routes = [
    {path:'',component:InfoView}
]

@NgModule({
    imports: [RouterModule.forChild(InfoRoutes)],
    exports: [RouterModule]
})
export class InfoRoutingModule{}