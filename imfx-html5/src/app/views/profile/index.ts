import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';


// ng2 views
import {TabsModule} from 'ngx-bootstrap'
import {TranslateModule} from 'ng2-translate';

//---------
import {ProfileComponent} from './profile.component';
import {ProfileOverviewComponent} from './components/overview/overview.component';
import {ProfileSecurityComponent} from './components/security/security.component';
import {ProfileSecurityChangePasswordComponent} from './components/security/components/change.password/change.password.component';
import {ProfileDefaultPageComponent} from './components/defaultpage/defaultpage.component';
import {IMFXControlsSelect2Module} from "../../modules/controls/select2/index";

import {IMFXLanguageSwitcherModule} from '../../modules/language.switcher';
import {ProfilePersonalSettingsComponent} from "./components/personal/personal.component";
import { appRouter } from '../../constants/appRouter';

console.log('`ProfileComponent` bundle loaded asynchronously');
// async views must be named routes for WebpackAsyncRoute

export const routes = [
    {path: appRouter.empty, component: ProfileComponent, routerPath: appRouter.profile, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ProfileComponent,
        ProfileOverviewComponent,
        ProfileSecurityComponent,
        ProfileSecurityChangePasswordComponent,
        ProfileDefaultPageComponent,
        ProfilePersonalSettingsComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        TabsModule.forRoot(),
        IMFXLanguageSwitcherModule,
        IMFXControlsSelect2Module
    ]
})
export default class ProfileModule {
    static routes = routes;
}
