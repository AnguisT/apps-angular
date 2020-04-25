import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { MediaWizardComponent } from './wizard';
import { OverlayModule } from '../../../../modules/overlay/index';
import { IMFXControlsSelect2Module } from '../../../../modules/controls/select2/index';
import WizardMediaTableModule from './comps/media/index';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      MediaWizardComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        OverlayModule,
        IMFXControlsSelect2Module,
        WizardMediaTableModule
    ],
    // exports: [
    //     VersionWizardComponent
    // ],
    entryComponents: [
        MediaWizardComponent
    ]
})

export class MediaWizardModule {
}
