import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { appRouter } from '../../../../constants/appRouter';
import {TranslateModule} from "ng2-translate";
import {AcquisitionsWorkspaceComponent} from "./acquisition.workplace.component";
import {IMFXControlsTreeModule} from "../../../../modules/controls/tree/index";
import {KeysPipeModule} from "../../../../modules/pipes/keysPipe/index";
import {LocalDateModule} from "../../../../modules/pipes/localDate/index";
import {ModalModule} from "../../../../modules/modal/index";
import {EditAcquisitionModalComponent} from "./modals/edit.acquisition.modal/edit.acquisition.modal.component";
import {EditArticleModalComponent} from "./modals/edit.article.modal/edit.article.modal.component";
import {NewContactModalComponent} from "./modals/new.contact.modal/new.contact.modal.component";
import { OverlayModule } from '../../../../modules/overlay';

export const routes = [
  {
    path: appRouter.acquisitions.workspace,
    routerPath: appRouter.acquisitions.workspace,
    component: AcquisitionsWorkspaceComponent,
    pathMatch: 'full'
  }
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      AcquisitionsWorkspaceComponent,
      EditAcquisitionModalComponent,
      EditArticleModalComponent,
      NewContactModalComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        IMFXControlsTreeModule,
        KeysPipeModule,
        LocalDateModule,
        ModalModule,
        OverlayModule
    ],
    entryComponents: [
      NewContactModalComponent,
      EditAcquisitionModalComponent,
      EditArticleModalComponent
    ],
    exports: [
      AcquisitionsWorkspaceComponent,
      EditAcquisitionModalComponent,
      EditArticleModalComponent,
      NewContactModalComponent
    ]
})
export default class AcquisitionsWorkspaceModule {
}
