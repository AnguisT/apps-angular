import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { CompaniesView } from './companies.view';
import { CompaniesRoutingModule } from './companies.routing.module';


@NgModule({
    declarations:[CompaniesView],
    imports:[CompaniesRoutingModule,SharedModule],
    providers:[],
    entryComponents:[]
})
export class CompaniesModule{}