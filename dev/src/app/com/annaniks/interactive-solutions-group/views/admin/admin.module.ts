import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin.routing.module';
import { SharedModule } from '../../shared';
import { AdminView } from './admin.view';
import { TopbarItemsService } from '../../services';
import { RolesGuard } from '../../services/rolesguard.service';
import { AddVacationDialogComponent, AddDayOffDialogComponent } from '../../dialogs';
import { CalendarModule } from 'primeng/primeng';

@NgModule({
    declarations: [AdminView, AddVacationDialogComponent, AddDayOffDialogComponent],
    imports: [AdminRoutingModule, SharedModule, CalendarModule],
    providers: [TopbarItemsService, RolesGuard],
    entryComponents: [AddVacationDialogComponent, AddDayOffDialogComponent]
})

export class AdminModule { }
