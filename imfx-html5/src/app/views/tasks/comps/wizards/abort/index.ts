import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { OverlayModule } from '../../../../../modules/overlay/index';
import { TasksWizardAbortComponent } from './wizard';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        TasksWizardAbortComponent
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
        TasksWizardAbortComponent
    ]
})
export class TasksWizardAbortModule {
}
