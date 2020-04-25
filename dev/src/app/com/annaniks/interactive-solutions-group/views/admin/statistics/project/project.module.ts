import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectView } from './project.view';
import { RouterModule } from '@angular/router';
import { PROJECTS_ROUTES } from './project.routing';
import { IncomeView } from './income/income.view';
import { ProjectFormatView } from './project-format/project-format.view';
import { SharedModule } from '../../../../shared';

@NgModule({
    declarations: [
        ProjectView,
        IncomeView,
        ProjectFormatView
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(PROJECTS_ROUTES),
        SharedModule
    ]
})
export class ProjectModule {
}
