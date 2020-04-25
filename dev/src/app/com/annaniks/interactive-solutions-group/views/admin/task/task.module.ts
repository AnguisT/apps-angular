import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { TaskRoutingModule } from './task.routing.module';
import { TaskView } from './task.view';
import { ProjectsService } from '../projects/projects.service';
import { TaskService } from './task.service';

@NgModule({
    declarations: [TaskView],
    imports: [
        TaskRoutingModule,
        SharedModule
    ],
    providers: [
        ProjectsService,
        TaskService
    ]
})

export class TaskModule {
}
