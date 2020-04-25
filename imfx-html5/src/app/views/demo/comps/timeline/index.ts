/**
 * Created by Pavel on 05.05.2017.
 */
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DemoTimelineComponent} from "./timeline.component";
import {IMFXTimelineModule} from "../../../../modules/controls/timeline/index";
import { appRouter } from '../../../../constants/appRouter';


console.log('`DemoTimelineComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
export const routes = [
  {path: appRouter.empty, component: DemoTimelineComponent, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    DemoTimelineComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IMFXTimelineModule,
    RouterModule.forChild(routes)
  ],
  exports: [

  ]
})
export default class DemoTreeModule {
  static routes = routes;
}
