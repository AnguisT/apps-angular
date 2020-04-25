/**
 * Created by Sergey Trizna on 22.02.2018.
 */

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { AgGridModule } from 'ag-grid-ng2';

// comps
import { SystemConfigComponent } from './system.config.component';
import { SettingsGroupsComponent } from './comps/settings.groups/settings.groups.component';
import {
    SettingsGroupsDetailsComponent
} from './comps/settings.groups/comps/details/settings.groups.details.component';
import {
    SettingsGroupsGridComponent
} from './comps/settings.groups/comps/grid/settings.groups.grid.component';
import {
    SettingsGroupsDetailsDefaultsComponent
} from './comps/settings.groups/comps/details/comps/defaults/defaults.component';
import {
    SettingsGroupsDetailsSearchByFieldsComponent
} from './comps/settings.groups/comps/details/comps/search.by.fields/search.by.fields.component';
import {
    SettingsGroupsDetailsFacetsComponent
} from './comps/settings.groups/comps/details/comps/facets/facets.component';
import {
    SettingsGroupsDetailsSearchScreenComponent
} from './comps/settings.groups/comps/details/comps/search.screen/search.screen.component';
import {
    SettingsGroupsDetailsItemLayoutComponent
} from './comps/settings.groups/comps/details/comps/item.layout/item.layout.component';
import {
    SettingsGroupsDetailsDetailsLayoutComponent
} from './comps/settings.groups/comps/details/comps/details.layout/details.layout.component';

// IMFX modules
import SystemConfigXmlModule from './comps/xml/index';
import { TabsModule } from 'ngx-bootstrap';
import SimplifiedSettingsModule from '../../../modules/settings/simplified/item/index';
import SimplifiedDetailSettingsModule from '../../../modules/settings/simplified/detail/index';
import { GlobalSettingsComponent } from './comps/global.settings/global.settings.component';
import {
    GlobalSettingsGrafanaComponent, SafePipe
} from './comps/global.settings/comps/grafana/global.settings.grafana.component';
import StartSearchModule from '../../start/index';
import StartSearchFormModule from '../../start/components/search/index';
import {
    GlobalSettingsLoggerComponent
} from './comps/global.settings/comps/logger/global.settings.logger.component';
import { OverlayModule } from '../../../modules/overlay/index';
import { IMFXGridModule } from '../../../modules/controls/grid/index';
import { appRouter } from '../../../constants/appRouter';
import { SlickGridModule } from '../../../modules/search/slick-grid';

console.log('`SystemConfigComponent` bundle loaded asynchronously');
// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {path: appRouter.empty, component: SystemConfigComponent, pathMatch: 'full'}
];

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SystemConfigComponent,
        SettingsGroupsComponent,
        SettingsGroupsGridComponent,
        SettingsGroupsDetailsComponent,
        SettingsGroupsDetailsDefaultsComponent,
        SettingsGroupsDetailsSearchByFieldsComponent,
        SettingsGroupsDetailsFacetsComponent,
        SettingsGroupsDetailsSearchScreenComponent,
        SettingsGroupsDetailsItemLayoutComponent,
        SettingsGroupsDetailsDetailsLayoutComponent,
        GlobalSettingsComponent,
        GlobalSettingsGrafanaComponent,
        GlobalSettingsLoggerComponent,
        SafePipe
        // TODO: move xml schemas manager here from separate module
    ],
    entryComponents: [

    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        SystemConfigXmlModule,
        IMFXGridModule,
        TabsModule,
        SlickGridModule,
        RouterModule.forChild(routes),

        // Simplified settings
        SimplifiedSettingsModule,
        SimplifiedDetailSettingsModule,
        OverlayModule,
        StartSearchFormModule
    ],
    exports: [
    ]
})
export default class SystemConfigModule {
    static routes = routes;
}
