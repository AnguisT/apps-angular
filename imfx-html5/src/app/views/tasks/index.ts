import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { AngularSplitModule } from 'angular-split';
import { TasksComponent } from './tasks.component';
// Search
import { SearchViewsModule } from '../../modules/search/views';
import { SearchFormModule } from '../../modules/search/form';
import { SearchSettingsModule } from '../../modules/search/settings';
import { SearchColumnsModule } from '../../modules/search/columns';
import { SearchAdvancedModule } from '../../modules/search/advanced';
import { SearchRecentModule } from '../../modules/search/recent';

// Save view
import { InfoModalModule } from '../../modules/search/info.modal';
// For modal
import { ModalModule } from '../../modules/modal';
import { SearchColumnsComponent } from '../../modules/search/columns/search.columns';
import { BsDropdownModule } from 'ngx-bootstrap';
import { appRouter } from '../../constants/appRouter';
import { ProgressModule } from '../../modules/controls/progress/index';
import { SlickGridModule } from '../../modules/search/slick-grid/index';
import { TasksUsersModule } from './comps/users/index';
import {TasksWizardPriorityComponent} from "./comps/wizards/priority/wizard";
import {TasksWizardAbortComponent} from "./comps/wizards/abort/wizard";

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {
        path: appRouter.task.search,
        routerPath: appRouter.task.search,
        component: TasksComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        TasksComponent,
        TasksWizardPriorityComponent,
        TasksWizardAbortComponent,

    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SlickGridModule,
        SearchViewsModule,
        SearchFormModule,
        SearchSettingsModule,
        SearchColumnsModule,
        SearchAdvancedModule,
        SearchRecentModule,
        AngularSplitModule,
        InfoModalModule,
        ModalModule,
        BsDropdownModule,
        ProgressModule,
        TasksUsersModule,
    ],
    exports: [],
    entryComponents: [
        SearchColumnsComponent,
        TasksWizardPriorityComponent,
        TasksWizardAbortComponent,
    ]
})
export default class TasksModule {
    // static routes = routes;
}
