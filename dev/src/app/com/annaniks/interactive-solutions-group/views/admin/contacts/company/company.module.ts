import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { CompanyView } from './company.view';
import { CompanyRoutingModule } from './company.routing.module';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
    declarations:[CompanyView],
    imports:[CompanyRoutingModule,SharedModule,MatTableModule,MatPaginatorModule],
    exports: [MatTableModule,MatPaginatorModule],
    providers:[],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
})
export class CompanyModule{}