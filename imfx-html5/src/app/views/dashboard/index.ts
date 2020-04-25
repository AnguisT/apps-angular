import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from 'ng2-translate';
import {DashboardComponent} from './dashboard.component';
import { GLDashboardComponent }   from './gl.component';
import {WorkflowsDashComponent} from "./comps/workflows/workwlows.dash.component";
import {ChartDashComponent} from "./comps/charts/chart.dash.component";
import {GrafanaDashComponent, SafePipe} from "./comps/grafana/grafana.dash.component";
import {AgGridModule} from "ag-grid-ng2";
import { ChartsModule } from 'ng2-charts';
import {OverlayModule} from "../../modules/overlay/index";
import {IMFXGridModule} from "../../modules/controls/grid/index";
import {SearchSavedService} from "../../modules/search/saved/services/search.saved.service";
import { appRouter } from '../../constants/appRouter';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, routerPath: appRouter.dashboard, component: DashboardComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
      DashboardComponent,
      GLDashboardComponent,
      WorkflowsDashComponent,
      ChartDashComponent,
      GrafanaDashComponent,
      SafePipe
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        IMFXGridModule,
        ChartsModule,
        OverlayModule
    ],
    exports: [
      GLDashboardComponent,
      WorkflowsDashComponent,
      ChartDashComponent,
      GrafanaDashComponent
    ],
    providers: [
      SearchSavedService
    ]
})
export default class DashboardModule {
    // static routes = routes;
}
