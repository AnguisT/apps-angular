/**
 * Created by Sergey Trizna on 16.02.2017.
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IMFXLanguageSwitcherModule} from '../../../../modules/language.switcher';
import {IMFXControlsDateTimePickerModule} from '../../../../modules/controls/datetimepicker';
import {TranslateModule} from 'ng2-translate';
// comps
import {DateFormatsComponent} from './dateformats.component';
import { appRouter } from '../../../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: DateFormatsComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DateFormatsComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IMFXControlsDateTimePickerModule,
        IMFXLanguageSwitcherModule,
        RouterModule.forChild(routes),
    ],
    exports: [
        DateFormatsComponent
    ]
})
export default class DateFormatsModule {
    static routes = routes;
}
