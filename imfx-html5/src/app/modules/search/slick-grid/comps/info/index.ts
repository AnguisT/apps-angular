/**
 * Created by Sergey Trizna on 05.04.2018.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "ng2-translate";
import {SlickGridInfoComp} from "./info.comp";

@NgModule({
    declarations: [
        SlickGridInfoComp,
    ],
    imports: [
        TranslateModule,
        CommonModule,
    ],
    exports: [
        SlickGridInfoComp
    ],
})
export class SlickGridInfoModule {
}
