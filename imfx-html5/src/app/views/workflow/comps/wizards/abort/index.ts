import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { OverlayModule } from '../../../../../modules/overlay/index';
import { WorkflowWizardAbortComponent } from './wizard';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        WorkflowWizardAbortComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        OverlayModule,
    ],
    // exports: [
    //     VersionWizardComponent
    // ],
    entryComponents: [
        WorkflowWizardAbortComponent
    ]
})
export class WorkflowWizardAbortModule {
}
