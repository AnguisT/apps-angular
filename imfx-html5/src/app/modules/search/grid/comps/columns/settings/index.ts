/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {SettingsColumnComponent} from './settings';
import {IMFXDropDownDirectiveModule} from '../../../../../../directives/dropdown/dropdown.directive.module';
@NgModule({
    declarations: [
        SettingsColumnComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
        IMFXDropDownDirectiveModule,
    ],
    exports: [
        SettingsColumnComponent
    ],
})
export class SettingsColumnModule {
}
