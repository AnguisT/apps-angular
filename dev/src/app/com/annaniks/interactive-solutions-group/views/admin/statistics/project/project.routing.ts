import { Routes } from '@angular/router';
import { ProjectView } from './project.view';
import { IncomeView } from './income/income.view';
import { ProjectFormatView } from './project-format/project-format.view';

export const PROJECTS_ROUTES: Routes = [
    {
        path: '', component: ProjectView, children: [
            {path: '', redirectTo: 'income'},
            {path: 'income', component: IncomeView},
            {path: 'project-format', component: ProjectFormatView}
        ]
    }
]