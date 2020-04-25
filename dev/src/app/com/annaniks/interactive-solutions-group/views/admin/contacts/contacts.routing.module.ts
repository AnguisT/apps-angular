import { NgModule } from '@angular/core';
import { ContactsView } from './contacts.view';
import { RouterModule, Routes } from '@angular/router';
import { ContactsService } from './contacts.service';

let contactsRoutes: Routes = [
    {
        path: '', component: ContactsView, children: [
            { path: '', redirectTo: 'companies', pathMatch: 'full' },
            { path: 'companies', loadChildren: './companies/companies.module#CompaniesModule' },
            { path: 'companies/:id', loadChildren: './company/company.module#CompanyModule' },
            { path: 'companies/:id/edit', loadChildren: './edit-company/edit-company.module#EditCompanyModule' },
            { path: 'companies/create/new', loadChildren: './edit-company/edit-company.module#EditCompanyModule' },
            { path: 'subcontractor', loadChildren: './subcontractor/subcontractor.module#SubcontractorModule' },
            { path: 'subcontractor/:id', loadChildren: './subcontractor-information/subcontractor-information.module#SubcontractorInformationModule' },
            { path: 'subcontractor/:id/edit', loadChildren: './edit-company/edit-company.module#EditCompanyModule' },
            { path: 'subcontractor/create/new', loadChildren: './edit-company/edit-company.module#EditCompanyModule' },
            { path: 'managers', loadChildren: './managers/managers.module#ManagersModule' },
            { path: 'managers/:id', loadChildren: './manager-information/manager-information.module#ManagerInformationModule' },
            { path: 'managers/:id/edit', loadChildren: './edit-manager/edit-manager.module#EditManagerModule' },
            { path: 'managers/create/new', loadChildren: './edit-manager/edit-manager.module#EditManagerModule' },
            { path: 'departments', loadChildren: './departments/departments.module#DepartmentsModule' },

        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(contactsRoutes)],
    exports: [RouterModule],
    providers: [ContactsService]
})
export class ContactsRoutingModule { }