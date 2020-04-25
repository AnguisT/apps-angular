import { NgModule } from '@angular/core';
import { AllProjectsView } from './all-projects.view';
import { AllProjectsRoutingModule } from './all-projects.routing.module';
import { SharedModule } from '../../../../shared';
import { ConfigurationService } from '../../configurations/configuration.service';

@NgModule({
    declarations: [AllProjectsView],
    imports: [
        AllProjectsRoutingModule,
        SharedModule
    ],
    providers: [ConfigurationService],
    exports: []
})
export class AllProjectsModule {
}
