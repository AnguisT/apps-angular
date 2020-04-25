import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingsView } from './ratings.view';
import { CustomersView } from './customers/customers.view';
import { ClientView } from './client/client.view';
import { ManagersView } from './managers/managers.view';
import { IsgManagersView } from './isg-managers/isg-managers.view';
import { IsgScreenwritersView } from './isg-screenwriters/isg-screenwriters.view';
import { RouterModule } from '@angular/router';
import { RATINGS_ROUTES } from './ratings.routing';
import { SharedModule } from '../../../../shared';
import { ConfigurationService } from '../../configurations/configuration.service';

@NgModule({
    declarations: [
        RatingsView,
        CustomersView,
        ClientView,
        ManagersView,
        IsgManagersView,
        IsgScreenwritersView
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(RATINGS_ROUTES),
        SharedModule
    ],
    providers: [ConfigurationService]
})
export class RatingsModule {
}
