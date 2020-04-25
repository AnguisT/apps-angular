import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { InfoRoutingModule } from './info.routing.module';
import { InfoView } from './info.view';




@NgModule({
    declarations: [InfoView],
    imports: [InfoRoutingModule,SharedModule],
    providers: []
})

export class InfoModule { }
