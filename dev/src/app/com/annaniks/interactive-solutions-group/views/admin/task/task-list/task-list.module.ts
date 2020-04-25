import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { TaskListRoutingModule } from './task-list.routing.module';
import { TaskListView } from './task-list.view';


@NgModule({
    declarations: [TaskListView],
    imports: [
        TaskListRoutingModule,
        SharedModule
    ],
    providers: []
})

export class TaskListModule { }
