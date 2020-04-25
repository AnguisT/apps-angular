import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { EditManagerView } from './edit-manager.view';
import { RouterModule } from '@angular/router';
import { EDIT_MANAGERS_ROUTES } from './edit-manager.routing';
import { ManagerGeneralInfoComponent } from './manager-general-info/manager-general-info.component';
import { ConfigurationService } from '../../configurations/configuration.service';
import { ManagerProjectView } from './manager-project/manager-project.view';
import { MatIconModule } from '@angular/material';

@NgModule({
    declarations: [
        EditManagerView,
        ManagerGeneralInfoComponent,
        ManagerProjectView,
    ],
    imports: [
        RouterModule.forChild(EDIT_MANAGERS_ROUTES),
        SharedModule,
        MatIconModule
    ],
    providers: [ConfigurationService]
})
export class EditManagerModule {
}
