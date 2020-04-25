import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { OverlayModule } from '../../../../../modules/overlay/index';
import { MyTasksWizardAbortComponent } from './wizard';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        MyTasksWizardAbortComponent
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
        MyTasksWizardAbortComponent
    ]
})
export class TasksWizardAbortModule {
}
