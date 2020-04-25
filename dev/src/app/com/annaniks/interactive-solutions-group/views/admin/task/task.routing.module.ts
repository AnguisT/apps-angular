import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { TaskView } from './task.view';

let TaskRoutes:Routes = [
    {
        path: '', component: TaskView, children: [
            { path: '', redirectTo: 'task-list', pathMatch: 'full' },
            { path: 'task-list', loadChildren: './task-list/task-list.module#TaskListModule' },
            { path: 'task-board', loadChildren: './task-board/task-board.module#TaskBoardModule' },
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(TaskRoutes)],
    exports: [RouterModule]
})
export class TaskRoutingModule{}