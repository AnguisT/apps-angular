import { NgModule } from '@angular/core';
import { ProjectInfoView } from './project-info.view';
import { ProjectInfoRoutingModule } from './project-info.routing.module';
import { SharedModule } from '../../../../shared';

@NgModule({
    declarations:[ProjectInfoView],
    imports:[ProjectInfoRoutingModule,SharedModule],
    exports:[]
})
export class ProjectInfoModule{}