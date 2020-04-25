import { Routes } from '@angular/router';
import { CustomersView } from './customers/customers.view';
import { ClientView } from './client/client.view';
import { ManagersView } from './managers/managers.view';
import { IsgManagersView } from './isg-managers/isg-managers.view';
import { IsgScreenwritersView } from './isg-screenwriters/isg-screenwriters.view';
import { RatingsView } from './ratings.view';

export const RATINGS_ROUTES: Routes = [
    {
        path: '', component: RatingsView, children: [
            {path: '', redirectTo: 'customers'},
            {path: 'customers', component: CustomersView},
            {path: 'clients', component: ClientView},
            {path: 'managers', component: ManagersView},
            {path: 'isg-managers', component: IsgManagersView},
            {path: 'isg-screenwriters', component: IsgScreenwritersView},
        ]
    },
];
