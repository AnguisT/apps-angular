import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { AngularSplitModule } from 'angular-split';
import { IMFXDropDownDirectiveModule } from '../../directives/dropdown/dropdown.directive.module';
import { SearchFormModule } from '../../modules/search/form';
import { SearchFacetsModule } from '../../modules/search/facets';
import { SearchAdvancedModule } from '../../modules/search/advanced';
import { SearchSettingsModule } from '../../modules/search/settings';
import { SearchRecentModule } from '../../modules/search/recent';
import { ModalModule } from '../../modules/modal';
import { appRouter } from '../../constants/appRouter';
import {NamesComponent} from "./names.component";
import {NamesTreeComponent} from "./comps/names.tree/names.tree.component";
import {IMFXControlsTreeModule} from "../../modules/controls/tree/index";
import {KeysPipeModule} from "../../modules/pipes/keysPipe/index";
import {LocalDateModule} from "../../modules/pipes/localDate/index";
import {NamesModalComponent} from "./modals/names.modal/names.modal.component";
import NamesModalModule from "./modals/names.modal/index";
import {FormsModule} from "@angular/forms";

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {
        path: appRouter.empty,
        routerPath: appRouter.names.search,
        component: NamesComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        NamesComponent,
        NamesTreeComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SearchFormModule,
        SearchFacetsModule,
        SearchSettingsModule,
        SearchAdvancedModule,
        SearchRecentModule,
        AngularSplitModule,
        IMFXControlsTreeModule,
        KeysPipeModule,
        LocalDateModule,
        ModalModule,
        IMFXDropDownDirectiveModule,
        NamesModalModule,
        FormsModule
    ],
    exports: []
})
export default class NamesModule {
    // static routes = routes;
}
