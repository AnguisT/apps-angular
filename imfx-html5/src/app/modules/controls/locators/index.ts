import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TabsModule} from "ngx-bootstrap";
// imfx modules
import { IMFXLocatorsComponent } from './imfx.locators.component';

import { IMFXLocatorsCommentsModule } from '../locators.comments/index';
import { IMFXMediaTaggingTabModule } from '../../../modules/search/detail/components/media.tagging.tab.component/index';
import { AgColorIndicatorModule } from '../locators.comments/ag.color.indicator';
import { TagsModule } from '../../../modules/controls/tags/index';
import {AgTagsModule} from "../ag.tags/index";

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
      IMFXLocatorsComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TabsModule,
        TagsModule,
        AgTagsModule,
        IMFXLocatorsCommentsModule,
        IMFXMediaTaggingTabModule,
        AgColorIndicatorModule
    ],
    exports: [
        IMFXLocatorsComponent,
    ]
})
export class IMFXLocatorsModule {
}
