import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {TranslateModule} from 'ng2-translate';
import {EventsManagerComponent} from "./events.manager";
import { appRouter } from '../../constants/appRouter';

console.log('`Events Management` bundle loaded asynchronously');
// async views must be named routes for WebpackAsyncRoute
export const routes = [
  {path: appRouter.empty, component: EventsManagerComponent, routerPath: appRouter.profile, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    EventsManagerComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export default class ProfileModule {
  static routes = routes;
}
