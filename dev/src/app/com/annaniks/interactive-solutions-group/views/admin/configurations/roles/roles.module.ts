import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { RolesView } from './roles.view';
import { RolesRoutingModule } from './roles.routing.module';
import { MatTreeModule, MatIconModule, MatButtonModule } from '@angular/material';
import { DxAccordionModule, DxCheckBoxModule, DxSliderModule, DxTagBoxModule, DxTemplateModule } from 'devextreme-angular';


@NgModule({
    declarations: [RolesView],
    imports: [
        RolesRoutingModule,
        SharedModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        DxAccordionModule,
        DxCheckBoxModule,
        DxSliderModule,
        DxTagBoxModule,
        DxTemplateModule
    ],
    providers: [],
    entryComponents: []
})
export class RolesModule { }
