/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {SearchColumnsComponent} from './search.columns';
import {ModalModule} from '../../modal';
import {FormsModule} from '@angular/forms';

// Pipes
import {KeysPipeModule} from '../../pipes/keysPipe/index';
import {OrderByModule} from '../../pipes/orderBy/index';
import {FilterPipeModule} from '../../pipes/filterPipe/index';
import {SearchByName} from './pipes/search.by.name';

@NgModule({
    declarations: [
      SearchColumnsComponent,
      SearchByName
    ],
    imports: [
        TranslateModule,
        CommonModule,
        ModalModule,
        FilterPipeModule,
        OrderByModule,
        KeysPipeModule,
        FormsModule
    ],
    exports: [
      SearchColumnsComponent
    ],
})
export class SearchColumnsModule {
}
