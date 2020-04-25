// import {NgModule} from '@angular/core';
// import {CommonModule} from '@angular/common';
// import {RouterModule} from '@angular/router';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {TranslateModule} from 'ng2-translate';
//
// // component modules
// import {IMFXLanguageSwitcherModule} from '../../modules/language.switcher';
// import {LoginComponent} from './login.component';
//
// // async components must be named routes for WebpackAsyncRoute
// export const routes = [
//     {path: '', component: LoginComponent, routerPath: 'login', pathMatch: 'full'}
// ];
//
// @NgModule({
//     declarations: [
//         // Components / Directives/ Pipes
//         LoginComponent,
//     ],
//     imports: [
//         IMFXLanguageSwitcherModule,
//         TranslateModule,
//         ReactiveFormsModule,
//         CommonModule,
//         FormsModule,
//         RouterModule.forChild(routes),
//     ],
//     exports: [
//     ]
// })
// export default class LoginModule {
//     static routes = routes;
// }
export * from './login.component';

