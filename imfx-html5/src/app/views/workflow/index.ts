/**
 * Created by Sergey Trizna on 09.03.2018.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "ng2-translate";
import {AngularSplitModule} from "angular-split";
import {WorkflowComponent} from "./workflow.component";
// Search
import {SearchViewsModule} from "../../modules/search/views";
import {SearchFormModule} from "../../modules/search/form";
import {SearchSettingsModule} from "../../modules/search/settings";
import {SearchColumnsModule} from "../../modules/search/columns";
import {SearchAdvancedModule} from "../../modules/search/advanced";
import {SearchRecentModule} from "../../modules/search/recent";
// Save view
import {InfoModalModule} from "../../modules/search/info.modal";
// For modal
import {ModalModule} from "../../modules/modal";
import {SearchColumnsComponent} from "../../modules/search/columns/search.columns";
// Accordion
import {BsDropdownModule} from "ngx-bootstrap";
import {appRouter} from "../../constants/appRouter";
import {ProgressModule} from "../../modules/controls/progress/index";
import {SlickGridModule} from "../../modules/search/slick-grid/index";
import {WorkflowWizardPriorityComponent} from "./comps/wizards/priority/wizard";
import {WorkflowWizardAbortComponent} from "./comps/wizards/abort/wizard";
import {WorkflowUsersModule} from "./comps/users/index";
//import {DragDropFormatterModule} from "../../modules/search/slick-grid/formatters/dragdrop/index";
import {WorkflowExpandRowModule} from "./comps/slickgrid/formatters/expand.row/index";
import {DragDropFormatterComp} from "../../modules/search/slick-grid/formatters/dragdrop/dragdrop.comp";
import {WorkflowExpandRowComponent} from "./comps/slickgrid/formatters/expand.row/expand.row.formatter";
import {DragDropFormatterModule} from "../../modules/search/slick-grid/formatters/dragdrop/index";

// async components must be named routes for WebpackAsyncRoute
export const routes = [
    {
        path: appRouter.workflow.search,
        routerPath: appRouter.workflow.search,
        component: WorkflowComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        WorkflowComponent,
        WorkflowWizardPriorityComponent,
        WorkflowWizardAbortComponent,
        // DragDropFormatterComp
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
        WorkflowUsersModule,
        DragDropFormatterModule,
        WorkflowExpandRowModule
    ],
    exports: [
        // DragDropFormatterComp
    ],
    entryComponents: [
        SearchColumnsComponent,
        WorkflowWizardPriorityComponent,
        WorkflowWizardAbortComponent,
        WorkflowExpandRowComponent
        // DragDropFormatterComp
    ]
})

export default class WorkflowModule {
    // static routes = routes;
}
