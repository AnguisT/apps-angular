/**
 * Created by Sergey Trizna on 03.03.2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { AngularSplitModule } from 'angular-split';
import { FilterPipeModule } from '../../pipes/filterPipe/index';
import { UsersComponent } from './users';
import { SlickGridModule } from '../slick-grid';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        UsersComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        AngularSplitModule,
        FilterPipeModule,
        SlickGridModule
    ],
    exports: [
        UsersComponent
    ],
    entryComponents: []
})
export class UsersModule {
}
