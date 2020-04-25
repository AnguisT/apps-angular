import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from 'ng2-translate';
import {MediaLoggerComponent} from './media.logger.component';
import { GLLoggerComponent }   from './gl.component';
import {AgGridModule} from "ag-grid-ng2";

// component modules
import {IMFXHtmlPlayerModule} from '../../modules/controls/html.player/index';
import {IMFXSilverlightPlayerModule} from '../../modules/controls/silverlight.player/index';

import {IMFXDefaultTabModule} from '../../modules/search/detail/components/default.tab.component/index';
import {IMFXAccordionModule} from '../../modules/search/detail/components/accordion.component/index';
import {IMFXImageModule} from '../../modules/search/detail/components/image.component/index';
import {IMFXMediaTaggingTabModule} from '../../modules/search/detail/components/media.tagging.tab.component/index';
import { IMFXLocatorsModule } from '../../modules/controls/locators/index';

import { IMFXXMLTreeModule } from "../../modules/controls/xml.tree/index";
import { IMFXSimpleTreeModule } from "../../modules/controls/simple.tree/index";

import { IMFXVideoInfoModule } from '../../modules/search/detail/components/video.info.component/index';
import { IMFXFullImageDirectiveModule } from '../../directives/img-fullscreen/fullimage.directive.module';
import { IMFXTimelineModule } from '../../modules/controls/timeline/index';
import { IMFXGridModule } from '../../modules/controls/grid/index';
import { IMFXTaxonomyModule } from '../../modules/search/detail/components/taxonomy.tab.component/index';
import { appRouter } from '../../constants/appRouter';
import {LayoutManagerModule} from "../../modules/controls/layout.manager/index";


// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, routerPath: appRouter.media_logger.detail, component: MediaLoggerComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        MediaLoggerComponent,
        GLLoggerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        IMFXGridModule,
        IMFXHtmlPlayerModule,
        IMFXSilverlightPlayerModule,
        IMFXTimelineModule,
        IMFXXMLTreeModule,
        IMFXSimpleTreeModule,
        IMFXFullImageDirectiveModule,
        IMFXAccordionModule,
        IMFXImageModule,
        IMFXDefaultTabModule,
        IMFXMediaTaggingTabModule,
        IMFXVideoInfoModule,
        IMFXLocatorsModule,
        IMFXTaxonomyModule,
        LayoutManagerModule
    ],
    exports: [
        GLLoggerComponent,
    ]
})
export default class MediaLoggerModule {
    // static routes = routes;
}
