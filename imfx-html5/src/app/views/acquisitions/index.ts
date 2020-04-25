import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { appRouter } from '../../constants/appRouter';
import {TranslateModule} from "ng2-translate";
import {AcquisitionsComponent} from "./acquisitions.component";
import {IMFXControlsTreeModule} from "../../modules/controls/tree/index";
import { OverlayModule } from '../../modules/overlay';

export const routes = [
  {
    path: appRouter.acquisitions.search,
    routerPath: appRouter.acquisitions.search,
    component: AcquisitionsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        AcquisitionsComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        IMFXControlsTreeModule,
        OverlayModule
    ],
    exports: [
      AcquisitionsComponent
    ]
})
export default class AcquisitionsModule {
}
