import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DEPARTMENTS_ROUTES } from './departments-routing';
import { DepartmentsView } from './departments.view';
import { SharedModule } from '../../../../shared';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DEPARTMENTS_ROUTES),
        SharedModule
    ],
    declarations: [
        DepartmentsView
    ]
})
export class DepartmentsModule {
}
