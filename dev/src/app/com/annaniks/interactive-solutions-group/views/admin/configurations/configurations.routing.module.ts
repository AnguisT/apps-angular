import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { ConfigurationsView } from './configurations.view';
import { ConfigurationService } from './configuration.service';

let configurationRoutes:Routes = [
    { path:'',component:ConfigurationsView,children:[
        {path:'',redirectTo:'categories',pathMatch:'full'},
        {path:'partner',loadChildren:'./partners/partner.module#PartnerModule'},
        {path:'partner/:id',loadChildren:'./partner-information/partner-information.module#PartnerInformationModule'},
        {path:'partner/:id/edit',loadChildren:'./edit-partner/edit-partner.module#EditPartnerModule'},
        {path:'partner/create/new',loadChildren:'./edit-partner/edit-partner.module#EditPartnerModule'},
        {path:'categories',loadChildren:'./categories/categories.module#CategoriesModule'}, 
        {path:'isg',loadChildren:'./isg/isg.module#IsgModule'}, 
        {path:'roles',loadChildren:'./roles/roles.module#RolesModule'},                           
        {path:'plans',loadChildren:'./plans/plans.module#PlansModule'},                          
        {path:'confgcompanies',loadChildren:'./confgcompanies/companies.module#CompaniesModule'},                           
        {path:'confgmanagers',loadChildren:'./confgmanagers/managers.module#ManagersModule'},                                                      
    ] }
]

@NgModule({
    imports:[RouterModule.forChild(configurationRoutes)],
    exports:[RouterModule],
    providers:[ConfigurationService]  
})
export class ConfigurationsRoutingModule{}