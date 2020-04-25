import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {AgTagsComponent} from './tags.component';
import {IMFXControlsSelect2Module} from "../select2/index";

@NgModule({
    declarations: [
      AgTagsComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IMFXControlsSelect2Module
    ],
    exports: [
      AgTagsComponent,
    ],
    entryComponents: [
      AgTagsComponent
    ]
})
export class AgTagsModule {}
