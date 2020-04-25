import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskBoardView } from './task-board.view';


let taskBoardRoutes: Routes = [
    { path: ':id', component: TaskBoardView }
]

@NgModule({
    imports: [RouterModule.forChild(taskBoardRoutes)],
    exports: [RouterModule]
})
export class TaskBoardRoutingModule { }