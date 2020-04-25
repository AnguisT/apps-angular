import { Routes } from '@angular/router';
import { EditCompanyView } from './edit-company.view';
import { GeneralInfoView } from './general-info/general-info.view';
import { ManagerProjectView } from './manager-project/manager-project.view';
import { EntityProjectComponent } from './entity-project/entity-project.component';


export const editCompanyRoutes: Routes = [
    {
        path: '', component: EditCompanyView, children: [
            {path: '', redirectTo: 'general-info'},
            {path: 'general-info', component: GeneralInfoView},
            {path: 'manager-project', component: ManagerProjectView},
            {path: 'projects', component: EntityProjectComponent}
        ]
    },
];