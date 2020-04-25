import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { TaskBoardRoutingModule } from './task-board.routing.module';
import { TaskBoardView } from './task-board.view';
import { ProjectsService } from '../../projects/projects.service';


@NgModule({
    declarations: [TaskBoardView],
    imports: [
        TaskBoardRoutingModule,
        SharedModule
    ],
    providers: [ProjectsService]
})

export class TaskBoardModule {
}
