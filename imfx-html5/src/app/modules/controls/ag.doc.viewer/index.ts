import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from 'ng2-translate';
import {TagsComponent} from './tags.component';
import {AgDocViewerComponent} from "./ag.doc.viewer.component";
import {CodePrettifyViewerModule} from "../../viewers/codeprettify/index";
import {PDFViewerModule} from "../../viewers/pdf/index";

@NgModule({
    declarations: [
      AgDocViewerComponent,
    ],
    imports: [
      CommonModule,
      TranslateModule,
      CodePrettifyViewerModule,
      PDFViewerModule,
    ],
    exports: [
      AgDocViewerComponent,
    ],
    entryComponents: [
      AgDocViewerComponent
    ]
})
export class AgDocViewerModule {}
