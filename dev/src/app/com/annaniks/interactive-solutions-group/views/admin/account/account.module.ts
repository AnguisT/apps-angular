import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { AccountRoutingModule } from './account.routing.module';
import { AccountView } from './account.view';
import { ConfigurationService } from '../configurations/configuration.service';
import { ProjectsService } from '../projects/projects.service';
import { CalendarModule } from 'primeng/primeng';

@NgModule({
    declarations: [AccountView],
    imports: [AccountRoutingModule, SharedModule],
    providers: [
        ConfigurationService,
        ProjectsService
    ]
})

export class AccountModule { }
