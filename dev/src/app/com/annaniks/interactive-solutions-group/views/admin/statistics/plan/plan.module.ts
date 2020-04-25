import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared';
import { PLAN_ROUTES } from './plan.routing';
import { CompanyView } from './company/company.view';
import { EmployeesView } from './employees/employees.view';
import { PlanView } from './plan.view';
import { ConfigurationService } from '../../configurations/configuration.service';

@NgModule({
    declarations: [
        PlanView,
        CompanyView,
        EmployeesView
    ],
    providers: [
        ConfigurationService,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(PLAN_ROUTES),
        SharedModule
    ]
})
export class PlanModule {
}
