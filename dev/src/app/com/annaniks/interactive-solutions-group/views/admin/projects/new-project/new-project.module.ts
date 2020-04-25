import { NgModule } from '@angular/core';
import { NewProjectView } from './new-project.view';
import { NewProjectRoutingModule } from './new-project.routing.module';
import { SharedModule } from '../../../../shared';
import {
    AddEmployeeDialog,
    AddSubcontravtorDialog,
    AddmanagerDialog,
    AddClientManagerDialog,
    AddProjectDateDialog,
    ConfirmDialog,
    AddCompanyDialog,
} from '../../../../dialogs';
import { MatProgressSpinnerModule, MatIconModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { AddPartyDateDialog } from '../../../../dialogs/add-party-date/add-party-date.dialog';
import { CalendarModule } from 'primeng/calendar';
import { ExitGuard } from '../../../../services/project.deactivate';
import { AddLegalEntityView } from '../../../../dialogs/add-legal-entity/add-legal-entity.view';
import { EstimateComponent } from './comps/estimate/estimate.component';
import { CETemplateDialogComponent } from '../../../../dialogs/ce_template/ce-template.dialog';

@NgModule({
    declarations: [
        NewProjectView,
        AddEmployeeDialog,
        AddProjectDateDialog,
        AddPartyDateDialog,
        AddSubcontravtorDialog,
        AddmanagerDialog,
        AddClientManagerDialog,
        AddCompanyDialog,
        AddLegalEntityView,
        EstimateComponent,
        CETemplateDialogComponent
    ],
    imports: [
        NewProjectRoutingModule,
        SharedModule,
        MatProgressSpinnerModule,
        CalendarModule,
        MatIconModule,
        MatCheckboxModule,
        MatInputModule
    ],
    providers: [ExitGuard],
    entryComponents: [
        AddEmployeeDialog,
        AddSubcontravtorDialog,
        AddProjectDateDialog,
        AddPartyDateDialog,
        AddmanagerDialog,
        AddClientManagerDialog,
        AddCompanyDialog,
        AddLegalEntityView,
        CETemplateDialogComponent
    ]
})
export class NewProjectModule { }
