import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { ProjectInfoView } from './project-info.view';

let projectInfoRoutes:Routes = [
    { path: '',component:ProjectInfoView }
]

@NgModule({
    imports:[RouterModule.forChild(projectInfoRoutes)],
    exports:[RouterModule]
})
export class ProjectInfoRoutingModule{}