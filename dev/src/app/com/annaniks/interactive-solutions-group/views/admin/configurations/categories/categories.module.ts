import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { CategoriesView } from './categories.view';
import { CategoriesRoutingModule } from './categories.routing.module';
import { ErrorDialog, ConfirmDialog } from '../../../../dialogs';
import { ConfigurationService } from '../configuration.service';
import { MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';


@NgModule({
    declarations:[CategoriesView],
    imports:[CategoriesRoutingModule,SharedModule, MatCardModule, MatFormFieldModule, MatInputModule],
    providers:[ConfigurationService,],
    entryComponents:[]
})
export class CategoriesModule{}