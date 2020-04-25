import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { TasksWizardPriorityComponent } from './wizard';
import { OverlayModule } from '../../../../../modules/overlay/index';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        TasksWizardPriorityComponent
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
        TasksWizardPriorityComponent
    ]
})
export class TasksWizardPriorityModule {
}
