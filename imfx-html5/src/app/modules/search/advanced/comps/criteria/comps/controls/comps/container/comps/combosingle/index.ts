/**
 * Created by Sergey Trizna on 27.04.2017.
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IMFXControlsSelect2Module} from '../../../../../../../../../../controls/select2';
import {TranslateModule} from 'ng2-translate';
// comps
import {IMFXAdvancedCriteriaControlComboSingleComponent} from './combosingle.component';


// async components must be named routes for WebpackAsyncRoute
// export const routes = [
//     {path: '', component: IMFXAdvancedCriteriaControlComboSingleComponent, pathMatch: 'full'}
// ];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        IMFXAdvancedCriteriaControlComboSingleComponent,
        // UploadComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        IMFXControlsSelect2Module,
        TranslateModule
    ],
    exports: [
        IMFXAdvancedCriteriaControlComboSingleComponent
    ],
    entryComponents: [

    ]
})
export class ComboSingleModule {
    // static routes = routes;
}
