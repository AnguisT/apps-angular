import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { RouterModule } from '@angular/router';
import { editCompanyRoutes } from './edit-company.routing.module';

import { EditCompanyView } from './edit-company.view';
import { GeneralInfoView } from './general-info/general-info.view';
import { ManagerProjectView } from './manager-project/manager-project.view';
import { EntityProjectComponent } from './entity-project/entity-project.component';
import { MatIconModule } from '@angular/material';
import { AddObjectDialog } from '../../../../dialogs';
import { ConfigurationService } from '../../configurations/configuration.service';

@NgModule({
    declarations: [
        EditCompanyView,
        GeneralInfoView,
        ManagerProjectView,
        EntityProjectComponent,
    ],
    providers: [
        ConfigurationService
    ],
    imports: [
        RouterModule.forChild(editCompanyRoutes),
        SharedModule,
        MatIconModule
    ],
})
export class EditCompanyModule {
}
