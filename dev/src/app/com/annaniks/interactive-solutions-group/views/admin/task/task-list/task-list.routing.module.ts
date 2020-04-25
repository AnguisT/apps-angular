import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListView } from './task-list.view';


let taskListRoutes: Routes = [
    { path: '', component: TaskListView }
]

@NgModule({
    imports: [RouterModule.forChild(taskListRoutes)],
    exports: [RouterModule]
})
export class TaskListRoutingModule { }