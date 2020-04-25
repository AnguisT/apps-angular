import { NgModule } from '@angular/core';
import { ProjectsView } from './projects.view';
import { ProjectsRoutingModule } from './projects.routing.module';
import { ProjectsService } from './projects.service';
import { SharedModule } from '../../../shared';
import { AddFileDialog } from '../../../dialogs/add-file/add-file.dialog';


@NgModule({
    declarations: [
        ProjectsView,
        AddFileDialog
    ],
    imports: [
        ProjectsRoutingModule,
        SharedModule
    ],
    providers: [ProjectsService],
    entryComponents: [AddFileDialog]
})
export class ProjectsModule {
}
