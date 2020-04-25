/**
 * Created by Sergey Trizna on 03.03.2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { AngularSplitModule } from 'angular-split';
import { FilterPipeModule } from '../../pipes/filterPipe/index';
import { IMFXXMLTreeModule } from '../../controls/xml.tree';
import { XMLComponent } from './xml';
import { OverlayModule } from '../../overlay/index';
import { IMFXGridModule } from '../../controls/grid/index';
import { SlickGridModule } from '../slick-grid';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        XMLComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        AngularSplitModule,
        FilterPipeModule,
        IMFXXMLTreeModule,
        OverlayModule,
        IMFXGridModule,
        SlickGridModule
    ],
    exports: [
        XMLComponent
    ],
    entryComponents: [
    ]
})
export class XmlModule {
}
