import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { WorkflowWizardPriorityComponent } from './wizard';
import { OverlayModule } from '../../../../../modules/overlay/index';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        WorkflowWizardPriorityComponent
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
        WorkflowWizardPriorityComponent
    ]
})
export class WorkflowWizardPriorityModule {
}
