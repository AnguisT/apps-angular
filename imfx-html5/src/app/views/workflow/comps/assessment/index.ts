import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from 'ng2-translate';
import {AssessmentComponent} from './assessment.component';
import { GLAssessmentComponent }   from './gl.component';
import {appRouter} from "../../../../constants/appRouter";
import {IMFXHtmlPlayerModule} from "../../../../modules/controls/html.player/index";
import {IMFXSimpleTreeModule} from "../../../../modules/controls/simple.tree/index";
import {IMFXTimelineModule} from "../../../../modules/controls/timeline/index";
import {IMFXXMLTreeModule} from "../../../../modules/controls/xml.tree/index";
import {IMFXFullImageDirectiveModule} from "../../../../directives/img-fullscreen/fullimage.directive.module";
import {IMFXAccordionModule} from "../../../../modules/search/detail/components/accordion.component/index";
import {IMFXSilverlightPlayerModule} from "../../../../modules/controls/silverlight.player/index";
import {IMFXLocatorsModule} from "../../../../modules/controls/locators/index";
import {IMFXVideoInfoModule} from "../../../../modules/search/detail/components/video.info.component/index";
import {IMFXMediaTaggingTabModule} from "../../../../modules/search/detail/components/media.tagging.tab.component/index";
import {IMFXDefaultTabModule} from "../../../../modules/search/detail/components/default.tab.component/index";
import {SimpleListModule} from "../../../../modules/controls/simple.items.list/index";
import {IMFXSegmentsTabModule} from "../../../../modules/search/detail/components/segments.tab.component/index";
import {IMFXMediaInfoModule} from "../../../../modules/search/detail/components/mediainfo.tab.component/index";
import {TasksControlButtonsModule} from "../../../../modules/search/tasks-control-buttons/index";
import {CELocatorsModule} from "../../../clip-editor/comps/locators/index";
import {IMFXSubtitlesGridModule} from "../../../../modules/search/detail/components/subtitles.grid.component/index";
import {IMFXMetadataTabModule} from "../../../../modules/search/detail/components/metadata.tab.component/index";
import {IMFXNotesTabModule} from "../../../../modules/search/detail/components/notes.tab.component/index";
import {IMFXEventsTabModule} from "../../../../modules/search/detail/components/events.tab.component/index";
import {LayoutManagerModule} from "../../../../modules/controls/layout.manager/index";
import {IMFXAudioTracksTabModule} from "../../../../modules/search/detail/components/audio.tracks.tab.component/index";
import {IMFXAiTabModule} from "../../../../modules/search/detail/components/ai.tab.component/index";
import {IMFXImageModule} from "../../../../modules/search/detail/components/image.component/index";
import {IMFXNotAvailableModule} from "../../../../modules/controls/not.available.comp/index";
import { SaveLayoutModalComponent } from '../../../../modules/controls/layout.manager/modals/save.layout.modal/save.layout.modal.component';
import { LoadLayoutModalComponent } from '../../../../modules/controls/layout.manager/modals/load.layout.modal/load.layout.modal.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.workflow.assessment, routerPath: appRouter.media_logger.detail, component: AssessmentComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        AssessmentComponent,
        GLAssessmentComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
      //  IMFXGridModule,
        IMFXHtmlPlayerModule,
        IMFXSilverlightPlayerModule,
        IMFXTimelineModule,
        IMFXXMLTreeModule,
        IMFXSimpleTreeModule,
     //   IMFXFullImageDirectiveModule,
        IMFXAccordionModule,
        IMFXImageModule,
        IMFXDefaultTabModule,
        IMFXMediaTaggingTabModule,
        IMFXVideoInfoModule,
        IMFXLocatorsModule,
        SimpleListModule,
        IMFXSegmentsTabModule,
        IMFXAudioTracksTabModule,
        IMFXMediaInfoModule,
        TasksControlButtonsModule,
        CELocatorsModule,
        IMFXSubtitlesGridModule,
        IMFXMetadataTabModule,
        IMFXNotesTabModule,
        IMFXEventsTabModule,
        LayoutManagerModule,
        IMFXAiTabModule,
        IMFXNotAvailableModule
    ],
    exports: [
      GLAssessmentComponent,
    ],
    entryComponents: [
        SaveLayoutModalComponent,
        LoadLayoutModalComponent
    ]
})
export default class AssessmentModule {
    // static routes = routes;
}
