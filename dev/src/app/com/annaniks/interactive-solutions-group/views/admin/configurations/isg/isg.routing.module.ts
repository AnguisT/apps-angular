import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsgView } from './isg.view';


const isgRoutes: Routes = [
    { path: '', component: IsgView }
];

@NgModule({
    imports: [RouterModule.forChild(isgRoutes)],
    exports: [RouterModule],

})
export class IsgRoutingModule { }
