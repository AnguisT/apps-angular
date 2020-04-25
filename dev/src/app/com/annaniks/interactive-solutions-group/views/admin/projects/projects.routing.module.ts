import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsView } from './projects.view';

let projectRoutes: Routes = [
    {
        path: '', component: ProjectsView, children: [
            { path: '', redirectTo: 'all-projects', pathMatch: 'full' },
            { path: 'all-projects', loadChildren: './all-projects/all-projects.module#AllProjectsModule' },
            { path: 'new', loadChildren: './new-project/new-project.module#NewProjectModule' },
            { path: ':id', loadChildren: './project-info/project-info.module#ProjectInfoModule' },
            { path: ':id/edit', loadChildren: './new-project/new-project.module#NewProjectModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(projectRoutes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule { }