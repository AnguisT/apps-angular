import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularSplitModule} from "angular-split";
import {AgGridModule} from 'ag-grid-ng2/main';

import {TranslateModule} from 'ng2-translate';

// component modules
import {WorkflowDetailComponent} from './detail.component';
import {MediaItemComponent} from "./comps/media.item/media.item.component";
import {JointModule} from "../../../../modules/joint/index";
import {OverlayModule} from '../../../../modules/overlay/index';
import {IMFXGridModule} from "../../../../modules/controls/grid/index";
import { appRouter } from '../../../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, routerPath: appRouter.workflow.detail, component: WorkflowDetailComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        WorkflowDetailComponent,
        MediaItemComponent
    ],
    imports: [
        OverlayModule,
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        AngularSplitModule,
        IMFXGridModule,
        JointModule
    ],
    exports: [
    ]
})
export default class WorkflowDetails {
    static routes = routes;
}
