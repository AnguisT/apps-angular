/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {SearchRecentComponent} from './search.recent';
import {BsDropdownModule} from 'ngx-bootstrap';
import {ReversePipeModule} from "../../pipes/reversePipe/index";
import {OverlayModule} from "../../overlay/index";

@NgModule({
    declarations: [
        SearchRecentComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
        BsDropdownModule,
        ReversePipeModule,
        OverlayModule
    ],
    exports: [
        SearchRecentComponent
    ],
})
export class SearchRecentModule {
}
