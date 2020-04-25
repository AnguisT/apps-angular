import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewProjectView } from './new-project.view';
import { ExitGuard } from '../../../../services/project.deactivate';

const newProjectRoutes: Routes = [
    { path: '', component: NewProjectView, canDeactivate: [ExitGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(newProjectRoutes)],
    exports: [RouterModule],

})

export class NewProjectRoutingModule { }
