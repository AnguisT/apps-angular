import { NgModule } from '@angular/core';
import { CompaniesRoutingModule } from './companies.routing.module';
import { CompaniesView } from './companies.view';
import { SharedModule } from '../../../../shared';
import { DateFormatPipe } from '../../../../pipe/date.format.pipe';
import { DateFormatPipeModule } from '../../../../pipe/date.format.module';


@NgModule({
    declarations: [CompaniesView],
    imports: [CompaniesRoutingModule, SharedModule, DateFormatPipeModule],
    providers: []
})
export class CompaniesModule { }
