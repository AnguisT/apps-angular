/**
 * Created by Sergey Trizna on 30.06.2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GridStackItemDirective} from 'ng2-gridstack/ng2-gridstack';
// import "style-loader!jquery-ui-bundle/jquery-ui.min.css";
// import "style-loader!jquery-ui-bundle/jquery-ui.structure.min.css";
// import "style-loader!jquery-ui-bundle/jquery-ui.theme.min.css";
// import "jquery-ui-bundle/jquery-ui.min.js";
// import "./libs/gridstack.js";
// import "./libs/gridstack.ui.js";
// import "style-loader!gridstack/dist/gridstack.min.css";
import {IMFXGridStack} from "./gridstack";


@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        GridStackItemDirective,
        IMFXGridStack
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        GridStackItemDirective,
        IMFXGridStack
    ]
})
export class GridStackModule {
}
