/**
 * Created by Sergey Trizna on 30.03.2018.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkflowExpandRowComponent} from "./expand.row.formatter";
import {DragDropFormatterModule} from "../../../../../../modules/search/slick-grid/formatters/dragdrop/index";
import {ProgressModule} from "../../../../../../modules/controls/progress/index";
import {DragDropFormatterComp} from "../../../../../../modules/search/slick-grid/formatters/dragdrop/dragdrop.comp";
@NgModule({
    declarations: [
        WorkflowExpandRowComponent,
        // DragDropFormatterComp
    ],
    imports: [
        CommonModule,
        ProgressModule
    ],
    exports: [
        WorkflowExpandRowComponent,
        // DragDropFormatterComp
        // DragDropFormatterComp
    ],
    entryComponents: [
        DragDropFormatterComp
    ]
})
export class WorkflowExpandRowModule {
}
