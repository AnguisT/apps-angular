/**
 * Created by Sergey Klimenko on 10.03.2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ng2 views
import {AgGridModule} from 'ag-grid-ng2/main';
import {AccordionModule} from 'ngx-bootstrap';
import {TabsModule} from 'ngx-bootstrap'
import {TranslateModule} from 'ng2-translate';

// Pipes
import { LocalDateModule } from '../../pipes/localDate/index';
import { ShowItemsModule } from '../../pipes/showItems/index';

// component modules
import { IMFXHtmlPlayerModule } from '../../controls/html.player/index';
import { IMFXNotAvailableModule } from '../../controls/not.available.comp/index';
import { IMFXSilverlightPlayerModule } from '../../controls/silverlight.player/index';
import { LocalDateGridModule } from '../../controls/local.date/index';

import {IMFXDefaultTabModule} from './components/default.tab.component/index';
import {IMFXAccordionModule} from './components/accordion.component/index';
import {IMFXImageModule} from './components/image.component/index';
import {IMFXMediaTaggingTabModule} from './components/media.tagging.tab.component/index';
import {IMFXMediaTabModule} from './components/media.tab.component/index';
import {IMFXVersionsTabModule} from './components/versions.tab.component/index';
import {DOCXViewerModule} from '../../viewers/docx/index';
import {TIFViewerModule} from "../../viewers/tif/index";
import {PDFViewerModule} from '../../viewers/pdf/index';
import {FlashViewerModule} from '../../viewers/flash/index';
import {CodePrettifyViewerModule} from '../../viewers/codeprettify/index';
import {DownloadViewerModule} from '../../viewers/download/index';
import {DetailComponent} from "./detail";

import { IMFXXMLTreeModule } from "../../controls/xml.tree/index";
import { IMFXSimpleTreeModule } from "../../controls/simple.tree/index";
import { IMFXGridModule } from '../../controls/grid/index';

import { GLComponent }   from './gl.component';
import {IMFXFullImageDirectiveModule} from "../../../directives/img-fullscreen/fullimage.directive.module";
import {IMFXVideoInfoModule} from "./components/video.info.component/index";
import {IMFXHistoryTabComponent} from './components/history.tab.component/imfx.history.tab.component';
import {IMFXSubtitlesGridModule} from "./components/subtitles.grid.component/index";
import {CodePrettiffyViewerComponent} from "../../viewers/codeprettify/codeprettify";
import {DownloadViewerComponent} from "../../viewers/download/download";
import {PDFViewerComponent} from "../../viewers/pdf/pdf";
import {DOCXViewerComponent} from "../../viewers/docx/docx";
import {TIFViewerComponent} from "../../viewers/tif/tif";
import {IMFXNotAvailableComponent} from "../../controls/not.available.comp/imfx.not.available.comp";
import {IMFXMediaTaggingTabComponent} from "./components/media.tagging.tab.component/imfx.media.tagging.tab.component";
import {IMFXMediaTabComponent} from "./components/media.tab.component/imfx.media.tab.component";
import {IMFXImageComponent} from "./components/image.component/imfx.image.component";
import {IMFXSubtitlesGrid} from "./components/subtitles.grid.component/subtitles.grid.component";
import {IMFXVideoInfoComponent} from "./components/video.info.component/video.info.component";
import {IMFXDefaultTabComponent} from "./components/default.tab.component/imfx.default.tab.component";
import {IMFXSilverlightPlayerComponent} from "../../controls/silverlight.player/imfx.silverlight.player";
import {IMFXAccordionComponent} from "./components/accordion.component/imfx.accordion.component";
import {IMFXHtmlPlayerComponent} from "../../controls/html.player/imfx.html.player";
import {IMFXReportTabComponent} from './components/report.tab.component/imfx.report.tab.component';
import { LocalDateGridComponent } from '../../controls/local.date/local.date.component';
import { IMFXGrid } from "../../controls/grid/grid";

import {StatusColumnModule} from '../grid/comps/columns/status/index';

import {OverlayModule} from "../../overlay/index";
import {StatusModule} from "./components/status/index";
import {StatusComponent} from "./components/status/status";
import {SubtitlesPacGridModule} from "./components/subtitles.pac.grid.component/index";
import {SubtitlesPacGrid} from "./components/subtitles.pac.grid.component/subtitles.pac.grid.component";
import {LivePlayerModule} from "../../controls/live.player/index";
import {LivePlayerComponent} from "../../controls/live.player/live.player";
import {IMFXAttachmentsComponent} from "./components/attachments.tab.component/imfx.attachments.tab.component";
import {SlickGridModule} from "../slick-grid/index";
import {DownloadFormatterComp} from "../slick-grid/formatters/download/download.formatter";
import {ModalModule} from "../../modal/index";
import {IMFXSegmentsTabModule} from "./components/segments.tab.component/index";
import {IMFXMetadataTabModule} from "./components/metadata.tab.component/index";
import {IMFXNotesTabModule} from "./components/notes.tab.component/index";
import {IMFXEventsTabModule} from "./components/events.tab.component/index";
import { IMFXDropDownDirectiveModule } from '../../../directives/dropdown/dropdown.directive.module';
import {IMFXAudioTracksTabModule} from "./components/audio.tracks.tab.component/index";
import {DeleteFormatterComp} from "../slick-grid/formatters/delete/delete.formatter";
import {IMFXAiTabModule} from "./components/ai.tab.component/index";
import {PreviewFilesFormatterComp} from "../slick-grid/formatters/preview-files/preview-files.formatter";
import {AgDocViewerModule} from "../../controls/ag.doc.viewer/index";
import {IMFTabModule} from "./components/imf.tab.component/index";

@NgModule({
  declarations: [
    IMFXHistoryTabComponent,
    IMFXReportTabComponent,
    IMFXAttachmentsComponent,
    GLComponent,
    DetailComponent,
    DownloadFormatterComp,
    PreviewFilesFormatterComp,
    DeleteFormatterComp
  ],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IMFXHtmlPlayerModule,
    LivePlayerModule,
    IMFXNotAvailableModule,
    IMFXSilverlightPlayerModule,
    LocalDateGridModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    IMFXXMLTreeModule,
    IMFXSimpleTreeModule,
    AgGridModule.withComponents([]),
    LocalDateModule,
    ShowItemsModule,
    IMFXFullImageDirectiveModule,
    IMFXAccordionModule,
    IMFXImageModule,
    IMFXDefaultTabModule,
    IMFXMediaTaggingTabModule,
    IMFXMediaTabModule,
    IMFXVersionsTabModule,
    IMFXVideoInfoModule,
    IMFXSubtitlesGridModule,
    SubtitlesPacGridModule,
    DOCXViewerModule,
    TIFViewerModule,
    PDFViewerModule,
    FlashViewerModule,
    CodePrettifyViewerModule,
    DownloadViewerModule,
    OverlayModule,
    StatusModule,
    IMFXGridModule,
    //StatusColumnModule
    ModalModule,
    SlickGridModule,
    IMFXSegmentsTabModule,
    IMFXAudioTracksTabModule,
    IMFXMetadataTabModule,
    IMFXNotesTabModule,
    IMFXEventsTabModule,
    IMFXDropDownDirectiveModule,
    IMFXAiTabModule,
    IMFTabModule,
    AgDocViewerModule
  ],
  exports: [
    IMFXHistoryTabComponent,
    IMFXReportTabComponent,
    LocalDateModule,
    ShowItemsModule,
    GLComponent,
    DetailComponent,
    DeleteFormatterComp
  ],
  entryComponents: [
    IMFXAccordionComponent,
    IMFXHtmlPlayerComponent,
    LivePlayerComponent,
    IMFXSilverlightPlayerComponent,
    IMFXDefaultTabComponent,
    IMFXHistoryTabComponent,
    IMFXReportTabComponent,
    IMFXVideoInfoComponent,
    IMFXSubtitlesGrid,
    SubtitlesPacGrid,
    StatusComponent,
    IMFXImageComponent,
    IMFXMediaTaggingTabComponent,
    IMFXMediaTabComponent,
    IMFXNotAvailableComponent,
    DOCXViewerComponent,
    TIFViewerComponent,
    PDFViewerComponent,
    DownloadViewerComponent,
    CodePrettiffyViewerComponent,
    LocalDateGridComponent,
    DownloadFormatterComp,
    PreviewFilesFormatterComp,
    DeleteFormatterComp
  ]
})
export class DetailModule {
}
