/**
 * Created by Sergey Trizna on 22.05.2017.
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// comps
import {ReportsComponent} from './reports';
import {ReportParamsModalComponent} from './report.params';
import {TranslateModule} from "ng2-translate";
import {AngularSplitModule} from "angular-split";
import {IMFXControlsTreeModule} from "../../modules/controls/tree/index";
import {FilterPipeModule} from "../../modules/pipes/filterPipe/index";
import {ModalModule} from '../../modules/modal';
import {IMFXControlsDateTimePickerModule} from "../../modules/controls/datetimepicker/index";
import {IMFXControlsNumberboxModule} from "../../modules/controls/numberbox/index";
import {PDFViewerModule} from '../../modules/viewers/pdf/index';
import {RangeDateTimePickerModule} from "../../modules/controls/range.date.time.picker/index";
import {OverlayModule} from "../../modules/overlay/index";
import { appRouter } from '../../constants/appRouter';

export const routes = [
    {path: appRouter.reports, component: ReportsComponent, routerPath: appRouter.reports, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ReportsComponent,
        ReportParamsModalComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        AngularSplitModule,
        FilterPipeModule,
        IMFXControlsTreeModule,
        IMFXControlsDateTimePickerModule,
        IMFXControlsNumberboxModule,
        ModalModule,
        PDFViewerModule,
        RangeDateTimePickerModule,
        OverlayModule
    ],
    exports: [
        ReportParamsModalComponent
    ],
    entryComponents: [
        ReportParamsModalComponent
    ]
})
export default class ReportsModule {
    static routes = routes;
}
