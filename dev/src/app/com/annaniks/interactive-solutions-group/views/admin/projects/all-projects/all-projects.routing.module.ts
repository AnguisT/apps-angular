import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AllProjectsView } from './all-projects.view';

let allProjectsRoutes:Routes = [
    {path:'',component:AllProjectsView}
]

@NgModule({
    imports:[
        RouterModule.forChild(allProjectsRoutes)
    ],
    exports:[RouterModule]
})
export class AllProjectsRoutingModule{}