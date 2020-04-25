import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProgrammsViewComponent } from './programms.view';
import { DetailViewComponent } from './viwes/detail/detail.view';

const programmsRoutes: Routes = [
    { path: '', component: ProgrammsViewComponent },
    { path: 'new', component: DetailViewComponent },
    { path: ':id/edit', component: DetailViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(programmsRoutes)],
    exports: [RouterModule],
})

export class ProgrammsRoutingModule { }
