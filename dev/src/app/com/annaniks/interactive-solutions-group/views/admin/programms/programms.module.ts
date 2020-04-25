import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { ProgrammsService } from './programms.service';
import { ProgrammsRoutingModule } from './programms.routing';
import { ProgrammsViewComponent } from './programms.view';
import { DetailViewComponent } from './viwes/detail/detail.view';
import { EstimateComponent } from './viwes/detail/comps/estimate/estimate.component';
import { MatIconModule, MatInputModule } from '@angular/material';
import { AddProgrammCeDialogComponent } from '../../../dialogs/add-programm-ce/add-programm-ce.dialog';
import { ProgramCETemplateDialogComponent } from '../../../dialogs/program_ce_template/program-ce-template.dialog';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
    declarations: [
        ProgrammsViewComponent,
        DetailViewComponent,
        EstimateComponent,
        AddProgrammCeDialogComponent,
        ProgramCETemplateDialogComponent
    ],
    imports: [
        ProgrammsRoutingModule,
        SharedModule,
        MatIconModule,
        MatInputModule,
        InputSwitchModule
    ],
    providers: [ProgrammsService],
    entryComponents: [
        AddProgrammCeDialogComponent,
        ProgramCETemplateDialogComponent
    ]
})

export class ProgrammsModule {}
