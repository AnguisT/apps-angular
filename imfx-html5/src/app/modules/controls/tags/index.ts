import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {TagsComponent} from './tags.component';
import {IMFXControlsSelect2Module} from "../select2/index";

@NgModule({
    declarations: [
        TagsComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IMFXControlsSelect2Module
    ],
    exports: [
        TagsComponent,
    ],
    entryComponents: [
        TagsComponent
    ]
})
export class TagsModule {}
