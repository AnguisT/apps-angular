import { Routes, RouterModule } from '@angular/router';
import { StatisticsView } from './statistics.view';
import { NgModule } from '@angular/core';

const statisticsRoutes: Routes = [
    {
        path: '', component: StatisticsView, children: [
            {path: '', redirectTo: 'ratings'},
            {path: 'ratings', loadChildren: './ratings/ratings.module#RatingsModule'},
            {path: 'projects', loadChildren: './project/project.module#ProjectModule'},
            {path: 'plan', loadChildren: './plan/plan.module#PlanModule'},
            {path: 'staff', loadChildren: './staff/staff.module#StaffModule'},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(statisticsRoutes)],
    exports: [RouterModule],
})
export class StatisticsRoutingModule { }
