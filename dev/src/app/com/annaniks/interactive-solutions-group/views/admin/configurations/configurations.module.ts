import { NgModule } from '@angular/core';
import { ConfigurationsRoutingModule } from './configurations.routing.module';
import { SharedModule } from '../../../shared';
import { ConfigurationsView } from './configurations.view';
import {  AddObjectDialog, AddFilialDepartamentManagerDialog, AddFilialDepartamentDialog, ErrorDialog, AddContractsDialog, AddEmployeeContactDialog } from '../../../dialogs';
import { MenuService } from '../../../services';
import { ConfigurationsItemsService } from '../../../services/configurationsitems.service';

@NgModule({
    declarations: [
        ConfigurationsView,  
        AddEmployeeContactDialog,
        
    ],
    imports: [ConfigurationsRoutingModule, SharedModule],
    providers: [MenuService, ConfigurationsItemsService],
    entryComponents: [
        AddEmployeeContactDialog,
        
    ]
})
export class ConfigurationsModule { }