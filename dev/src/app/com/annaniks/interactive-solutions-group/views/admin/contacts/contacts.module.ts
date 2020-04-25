import { NgModule } from '@angular/core';
import { ContactsRoutingModule } from './contacts.routing.module';
import { SharedModule } from '../../../shared';
import { ContactsView } from './contacts.view';
import { ContactsItemsService } from '../../../services';
import { Routes, RouterModule } from '@angular/router';
import {  AddFilialDepartamentDialog, AddFilialDepartamentManagerDialog, AddContractsDialog,  AddContactDialog } from '../../../dialogs';
import { LoginView } from '../../login/login.view';
import { DateFormatPipe } from '../../../pipe/date.format.pipe';


const appRoutes: Routes= [
    {path: 'login', component: LoginView}
  ]
@NgModule({
    declarations:[ContactsView,
        AddContactDialog,
        AddFilialDepartamentManagerDialog,
        AddContractsDialog,
        
    ],
    imports:[
        ContactsRoutingModule,
        SharedModule,
       // RouterModule.forRoot(appRoutes),
    ],
    providers:[ContactsItemsService, DateFormatPipe],
    entryComponents:[
        AddContactDialog,
        AddFilialDepartamentManagerDialog,
        AddContractsDialog
    ]
})
export class ContactsModule{}