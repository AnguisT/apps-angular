import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// imfx modules
import {TranslateModule} from 'ng2-translate';
import {IMFXControlsDateTimePickerModule} from '../../modules/controls/datetimepicker';
import {IMFXSearchSuggestionModule} from '../../modules/controls/search.suggestion';
import {IMFXSilverlightPlayerModule} from '../../modules/controls/silverlight.player';
import {IMFXHtmlPlayerModule} from '../../modules/controls/html.player';
import {IMFXSubtitlesGridModule} from "../../modules/search/detail/components/subtitles.grid.component/index";
import {SearchFormModule} from '../../modules/search/form';

// components
import {SimplifiedSearchComponent} from "./simplified.search.component";
import {SimplifiedDetailModule} from "./components/simplified.detail";
import {SimplifiedFacetModule} from "./components/simplified.facet";
import {SimplifiedItemModule} from "./components/simplified.item";

import {ThumbColumnModule} from '../../modules/search/grid/comps/columns/thumb/index';
import {GridStackModule} from "../../modules/controls/gridstack";
import {OverlayModule} from "../../modules/overlay/index";
import StartSearchFormModule from "../start/components/search/index";
import { appRouter } from '../../constants/appRouter';
// async components must be named routes for WebpackAsyncRoute

export const routes = [
    {path: appRouter.empty, component: SimplifiedSearchComponent, routerPath: appRouter.simplified, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SimplifiedSearchComponent,
    ],
    imports: [
        IMFXControlsDateTimePickerModule,
        IMFXSearchSuggestionModule,
        IMFXSilverlightPlayerModule,
        IMFXSubtitlesGridModule,
        IMFXHtmlPlayerModule,
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SearchFormModule,
        StartSearchFormModule,
        SimplifiedDetailModule,
        SimplifiedFacetModule,
        SimplifiedItemModule,
        ThumbColumnModule,
        GridStackModule,
        OverlayModule,
    ],
    exports: [
        // StartSearchComponent,
        // SimplifiedItemSettingsComponent
    ]
})
export default class SimplifiedModule {
    static routes = routes;
}
