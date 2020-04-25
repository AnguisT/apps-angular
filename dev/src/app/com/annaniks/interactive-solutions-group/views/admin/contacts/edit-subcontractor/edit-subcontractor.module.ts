import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { EditSubcontractorView } from './edit-subcontractor.view';
import { EditSubcontractorRoutingModule } from './edit-subcontractor.routing.module';

@NgModule({
    declarations:[EditSubcontractorView],
    imports:[EditSubcontractorRoutingModule,SharedModule],
    providers:[]
})
export class EditSubcontractorModule{}