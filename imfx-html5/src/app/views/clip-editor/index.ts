import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularSplitModule} from "angular-split";
import {AgGridModule} from 'ag-grid-ng2/main';

import {TranslateModule} from 'ng2-translate';
import {OverlayModule} from "../../modules/overlay/index";
import {IMFXGridModule} from "../../modules/controls/grid/index";
import {RCEComponent} from "./rce.component";
import {IMFXHtmlPlayerComponent} from "../../modules/controls/html.player/imfx.html.player";
import {IMFXHtmlPlayerModule} from "../../modules/controls/html.player/index";
import {IMFXTimelineModule} from "../../modules/controls/timeline/index";
import {DetailModule} from "../../modules/search/detail/index";
import {AccordionModule} from "ngx-bootstrap";
import {IMFXAccordionModule} from "../../modules/search/detail/components/accordion.component/index";
import {ModalModule} from "../../modules/modal";
import { GLClipEditorComponent }   from './gl.component';
import {SimpleListModule} from "../../modules/controls/simple.items.list/index";
import {MediaWizardModule} from "./comps/wizard/index";
import { CELocatorsModule } from './comps/locators/index';
import { appRouter } from '../../constants/appRouter';
import {ModalPreviewPlayerModule} from "../../modules/modal.preview.player/index";
import {ModalPreviewPlayerComponent} from "../../modules/modal.preview.player/modal.preview.player";

// component modules

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: RCEComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      RCEComponent,
      GLClipEditorComponent
    ],
    imports: [
        OverlayModule,
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        DetailModule,
        RouterModule.forChild(routes),
        AngularSplitModule,
        AccordionModule.forRoot(),
        IMFXAccordionModule,
        IMFXGridModule,
        IMFXHtmlPlayerModule,
        SimpleListModule,
        IMFXTimelineModule,
        ModalModule,
        MediaWizardModule,
        ModalPreviewPlayerModule,
        CELocatorsModule
    ],
    exports: [
    ],
    entryComponents: [
      ModalPreviewPlayerComponent,
    ]
})
export default class RCEModule {
    static routes = routes;
}
