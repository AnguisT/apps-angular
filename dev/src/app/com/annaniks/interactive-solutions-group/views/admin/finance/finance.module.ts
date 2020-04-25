import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { FinanceService } from './finance.service';
import { FinanceRoutingModule } from './finance.routing';
import { FinanceViewComponent } from './finance.view';
import { AddFinanceDialogComponent } from '../../../dialogs/add-finance/add-finance.dialog';
import { CalendarModule } from 'primeng/primeng';
import { MatInputModule } from '@angular/material';

@NgModule({
    declarations: [
        FinanceViewComponent,
        AddFinanceDialogComponent
    ],
    imports: [
        FinanceRoutingModule,
        SharedModule,
        CalendarModule,
        MatInputModule
    ],
    providers: [FinanceService],
    entryComponents: [
        AddFinanceDialogComponent
    ]
})

export class FinanceModule {}
