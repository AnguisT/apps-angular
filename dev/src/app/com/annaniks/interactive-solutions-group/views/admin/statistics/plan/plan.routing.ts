import { Routes } from '@angular/router';
import { PlanView } from './plan.view';
import { CompanyView } from './company/company.view';
import { EmployeesView } from './employees/employees.view';

export const PLAN_ROUTES: Routes = [
    {
        path: '', component: PlanView, children: [
            {path: '', redirectTo: 'company'},
            {path: 'company', component: CompanyView},
            {path: 'employees', component: EmployeesView}
        ]
    }
];
