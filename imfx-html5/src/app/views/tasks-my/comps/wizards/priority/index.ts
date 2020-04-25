import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { MyTasksWizardPriorityComponent } from './wizard';
import { OverlayModule } from '../../../../../modules/overlay/index';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        MyTasksWizardPriorityComponent
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
        MyTasksWizardPriorityComponent
    ]
})
export class TasksWizardPriorityModule {
}
