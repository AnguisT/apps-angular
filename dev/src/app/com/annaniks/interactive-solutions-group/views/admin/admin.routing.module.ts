import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminView } from './admin.view';
import { RolesGuard } from '../../services/rolesguard.service';

const adminRoutes: Routes = [
    {
        path: '', component: AdminView, children: [
            { path: '', redirectTo: 'projects', pathMatch: 'full'},
            { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule' },
            { path: 'contacts', loadChildren: './contacts/contacts.module#ContactsModule' },
            {
                path: 'configurations',
                loadChildren: './configurations/configurations.module#ConfigurationsModule',
                canActivate: [RolesGuard]
            },
            { path: 'account', loadChildren: './account/account.module#AccountModule' },
            { path: 'info', loadChildren: './info/info.module#InfoModule' },
            { path: 'task', loadChildren: './task/task.module#TaskModule' },
            { path: 'statistics', loadChildren: './statistics/statistics.module#StatisticsModule' },
            { path: 'programms', loadChildren: './programms/programms.module#ProgrammsModule' },
            { path: 'finance', loadChildren: './finance/finance.module#FinanceModule' }
        ],
    }
]

@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }