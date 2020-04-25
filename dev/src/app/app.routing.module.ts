import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard } from './com/annaniks/interactive-solutions-group/services';

let appRoutes:Routes = [
    { path:'',loadChildren:'./com/annaniks/interactive-solutions-group/views/admin/admin.module#AdminModule',canActivate:[AuthGuard]},
    { path:'login',loadChildren:'./com/annaniks/interactive-solutions-group/views/login/login.module#LoginModule'},
    { path: '**', redirectTo: 'projects'}
]


@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
})
export class AppRoutingModule{}