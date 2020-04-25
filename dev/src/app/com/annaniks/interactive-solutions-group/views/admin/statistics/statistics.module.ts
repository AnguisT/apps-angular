import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { StatisticsView } from './statistics.view';
import { StatisticsRoutingModule } from './statistics.routing';

@NgModule({
    declarations: [
        StatisticsView
    ],
    imports: [
        SharedModule,
        StatisticsRoutingModule
    ],
    providers: []
})

export class StatisticsModule {
}
