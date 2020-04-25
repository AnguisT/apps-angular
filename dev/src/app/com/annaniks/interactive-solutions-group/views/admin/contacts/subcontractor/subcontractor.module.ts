import { NgModule } from '@angular/core'
import { SharedModule } from '../../../../shared';
import { SubcontractorView } from './subcontractor.view';
import { SubcontractorRoutingModule } from './subcontractor.routing.module';


@NgModule({
    declarations: [SubcontractorView],
    imports: [SubcontractorRoutingModule,SharedModule],
    providers: []
})
export class SubcontractorModule { }