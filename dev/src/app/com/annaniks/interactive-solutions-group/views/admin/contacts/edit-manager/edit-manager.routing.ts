import { Routes } from '@angular/router';
import { EditManagerView } from './edit-manager.view';
import { ManagerGeneralInfoComponent } from './manager-general-info/manager-general-info.component';
import { ManagerProjectView } from './manager-project/manager-project.view';

export const EDIT_MANAGERS_ROUTES: Routes = [
    {
        path: '', component: EditManagerView, children: [
            {path: '', redirectTo: 'general-info'},
            {path: 'general-info', component: ManagerGeneralInfoComponent},
            {path: 'manager-project', component: ManagerProjectView},
        ]
    },
];
