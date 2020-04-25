// NG Modules
import {ApplicationRef, ChangeDetectorRef, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Http, HttpModule} from "@angular/http";
import {RouteReuseStrategy, RouterModule} from "@angular/router";
import {Ng2Webstorage} from "ng2-webstorage";
import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";
import {AngularSplitModule} from "angular-split";
import {BsDropdownModule, BsModalRef, BsModalService, ModalModule as ng2Modal, TabsModule} from "ngx-bootstrap";
// IMFX Modules
import {IMFXLanguageSwitcherModule} from "./modules/language.switcher";
import {ErrorManagerModule} from "./modules/error";
import {ModalModule} from "./modules/modal";
import {IMFXDropDownDirectiveModule} from "./directives/dropdown/dropdown.directive.module";
/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from "./environment";
import {ROUTES} from "./app.routes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
// App is our top level component
import {BaseComponent} from "./views/base/base.component";
import {MediaBasketPanelComponent} from "./views/base/components/media.basket.panel/media.basket.panel.component";
import {MediaBasketPanelItemComponent} from "./views/base/components/media.basket.panel/components/media.basket.panel.item/media.basket.panel.item.component";
import {BaseLanguageSwitcherComponent} from "./views/base/components/base.language.switcher/base.language.switcher.component";
import {BaseProfileComponent} from "./views/base/components/base.profile/base.profile.component";
import {BaseTopMenuComponent} from "./views/base/components/base.top.menu/base.top.menu.component";
import {NoContentComponent} from "./views/no-content";
import {NoAccessComponent} from "./views/no-access";
import {LogoutByTimeoutComponent} from "./views/base/components/logout.by.timeout/logout.by.timeout";
// Providers
import {SecurityProvider} from "./providers/security/security.provider";
import {MediaBasketProvider} from "./providers/media.basket/media.basket.provider";
import {NativeWindowProvider} from "./providers/common/native.window.provider";
import {ArrayProvider} from "./providers/common/array.provider";
import {SplashProvider} from "./providers/design/splash.provider";
import {ModalProvider} from "./modules/modal/providers/modal.provider";
import {DebounceProvider} from "./providers/common/debounce.provider";
import {StringProivder} from "./providers/common/string.provider";
import {UploadProvider} from "./modules/upload/providers/upload.provider";
import {DefaultSearchProvider} from "./modules/search/providers/defaultSearchProvider";
// deps for grid
import {I18NTable} from "./services/i18n/table/i18n.table";
// Services
import {LoginService} from "./services/login/login.service";
import {BasketService} from "./services/basket/basket.service";
import {MisrSearchService} from "./services/viewsearch/misr.service";
import {XMLService} from "./services/xml/xml.service";
import {HttpService} from "./services/http/http.service";
import {ConfigService} from "./services/config/config.service";
import {ProfileService} from "./services/profile/profile.service";
import {SecurityService} from "./services/security/security.service";
import {SplashService} from "./services/splash/splash.service";

import {IMFXRouteReuseStrategy} from "./strategies/route.reuse.strategy";
import {OverlayModule} from "./modules/overlay/index";
import {ProfileColorSchemasComponent} from "./views/base/components/base.profile/components/colorschemas/colorschemas.component";
import {DetailData} from "app/services/viewsearch/detail.service";
import {UploadService} from "./modules/upload/services/upload.service";
import {ServerStorageService} from "./services/storage/server.storage.service";
import {NotificationModule} from "./modules/notification/index";
import {NotificationService} from "./modules/notification/services/notification.service";
import {ErrorManagerProvider} from "./modules/error/providers/error.manager.provider";
import {LoginProvider} from "./views/login/providers/login.provider";
import {UploadModule} from "./modules/upload/index";
import {BaseUploadMenuComponent} from "./views/base/components/base.upload/base.upload.component";
import {SimplifiedSettingsTransferProvider} from "./modules/settings/simplified/simplified.settings.transfer.provider";
import {ControlToAdvTransfer} from "./services/viewsearch/controlToAdvTransfer.service";
import {RouteReuseProvider} from "./strategies/route.reuse.provider";
import {LoginComponent} from "./views/login/login.component";
import {LookupService} from "./services/lookup/lookup.service";
import {RaiseWorkflowWizzardModule} from "./modules/rw.wizard/index";
import {RaiseWorkflowWizzardProvider} from "./modules/rw.wizard/providers/rw.wizard.provider";
import {ExportModule} from "./modules/export/index";
import {ExportService} from "./modules/export/services/export.service";
import {DownloadService} from "./services/common/download.service";
import {ClipEditorService} from "./services/clip.editor/clip.editor.service";
import {TagsModule} from "./modules/controls/tags/index";
import {ThumbModule} from "./modules/controls/thumb/index";
import {ModalPreviewPlayerProvider} from "./modules/modal.preview.player/providers/modal.preview.player.provider";
import {ModalPreviewPlayerModule} from "./modules/modal.preview.player/index";
import {BaseProvider} from "./views/base/providers/base.provider";
import {ViewsProvider} from "./modules/search/views/providers/views.provider";
import {SplitProvider} from "./providers/split/split.provider";
import {AudioSynchProvider} from "./modules/controls/html.player/providers/audio.synch.provider";
import AcquisitionsWorkspaceModule from "./views/acquisitions/comps/acquisition-workplace/index";
import AcquisitionsModule from "./views/acquisitions/index";
import {ThemesProvider} from "./providers/design/themes.providers";
import {ExportProvider} from './modules/export/providers/export.provider';
import {IMFXModalProvider} from "./modules/imfx-modal/proivders/provider";
import {VersionWizardComponent} from "./modules/version-wizard/wizard";
import {VersionWizardModule} from "./modules/version-wizard";
import {VersionWizardProvider} from "./modules/version-wizard/providers/wizard.provider";
import {ViewsService} from "./modules/search/views/services/views.service";
import { ReportParamsModalComponent } from './views/reports/report.params';
import ReportsModule from './views/reports';

import { WorkflowWizardPriorityComponent } from './views/workflow/comps/wizards/priority/wizard';
import { WorkflowWizardPriorityModule } from './views/workflow/comps/wizards/priority';
import WorkflowModule from './views/workflow';
import { WorkflowWizardAbortComponentProvider } from './views/workflow/comps/wizards/abort/providers/wizard.provider';
import { WorkflowWizardAbortComponentService } from './views/workflow/comps/wizards/abort/services/wizard.service';
import { WorkflowWizardPriorityComponentProvider } from './views/workflow/comps/wizards/priority/providers/wizard.provider';
import { WorkflowWizardAbortComponent } from './views/workflow/comps/wizards/abort/wizard';
import { JobService } from './views/workflow/services/jobs.service';
import {IMFXModalPromptComponent} from "./modules/imfx-modal/comps/prompt/prompt";
import {IMFXModalPromptModule} from "./modules/imfx-modal/comps/prompt";
import {SlickGridProvider} from "./modules/search/slick-grid/providers/slick.grid.provider";
import {IMFXModalAlertModule} from "./modules/imfx-modal/comps/alert";
import {IMFXModalAlertComponent} from "./modules/imfx-modal/comps/alert/alert";
import {
    MyTasksWizardPriorityComponentProvider
} from './views/tasks-my/comps/wizards/priority/providers/wizard.provider';
import {
    MyTasksWizardAbortComponentProvider
} from './views/tasks-my/comps/wizards/abort/providers/wizard.provider';
import {
    MyTasksWizardAbortComponentService
} from './views/tasks-my/comps/wizards/abort/services/wizard.service';
import {
    TasksWizardPriorityComponentProvider
} from './views/tasks/comps/wizards/priority/providers/wizard.provider';
import {
    TasksWizardAbortComponentProvider
} from './views/tasks/comps/wizards/abort/providers/wizard.provider';
import {
    TasksWizardAbortComponentService
} from './views/tasks/comps/wizards/abort/services/wizard.service';
import MyTasksModule from './views/tasks-my';
import TasksModule from './views/tasks';
import {MediaWizardComponent} from "./views/clip-editor/comps/wizard/wizard";
import {MediaWizardModule} from "./views/clip-editor/comps/wizard";
import {NamesModalComponent} from "./views/names/modals/names.modal/names.modal.component";
import NamesModalModule from "./views/names/modals/names.modal/index";
import SettingsSimplifiedFieldsModule from "./modules/settings/simplified/fields/index";
import {SettingsSimplifiedFieldsComponent} from "./modules/settings/simplified/fields/modal.fields";
import { SaveLayoutModalComponent } from './modules/controls/layout.manager/modals/save.layout.modal/save.layout.modal.component';
import { LoadLayoutModalComponent } from './modules/controls/layout.manager/modals/load.layout.modal/load.layout.modal.component';
import AssessmentModule from './views/workflow/comps/assessment';

// Application wide providers
const APP_PROVIDERS = [
    SecurityProvider,
    MediaBasketProvider,
    NativeWindowProvider,
    BasketService,
    MisrSearchService,
    XMLService,
    LoginService,
    HttpService,
    ConfigService,
    ProfileService,
    SplashService,
    SecurityService,
    ArrayProvider,
    I18NTable,
    SplashProvider,
    ModalProvider,
    DebounceProvider,
    LoginProvider,
    ChangeDetectorRef,
    DefaultSearchProvider,
    StringProivder,
    UploadProvider,
    DetailData,
    UploadService,
    ServerStorageService,
    NotificationService,
    ErrorManagerProvider,
    BrowserAnimationsModule,
    SimplifiedSettingsTransferProvider,
    ControlToAdvTransfer,
    RouteReuseProvider,
    ClipEditorService,
    LookupService,
    RaiseWorkflowWizzardProvider,
    ModalPreviewPlayerProvider,
    // SearchAdvancedProvider,
    ExportService,
    DownloadService,
    BaseProvider,
    ViewsProvider,
    // SlickGridPagerProvider,
    // SlickGridPanelProvider,
    // SlickGridInfoProvider,
    SplitProvider,
    AudioSynchProvider,
    ThemesProvider,
    BsModalRef,
    BsModalService,
    {provide: ExportProvider, useClass: ExportProvider},
    IMFXModalProvider,
    VersionWizardProvider,
    ViewsService,
    {provide: WorkflowWizardAbortComponentProvider, useClass: WorkflowWizardAbortComponentProvider},
    WorkflowWizardAbortComponentService,
    {provide: WorkflowWizardPriorityComponentProvider, useClass: WorkflowWizardPriorityComponentProvider},
    JobService,
    // my-task
    {provide: MyTasksWizardPriorityComponentProvider, useClass: MyTasksWizardPriorityComponentProvider},
    {provide: MyTasksWizardAbortComponentProvider, useClass: MyTasksWizardPriorityComponentProvider},
    MyTasksWizardAbortComponentService,
    // task
    {provide: TasksWizardPriorityComponentProvider, useClass: TasksWizardPriorityComponentProvider},
    {provide: TasksWizardAbortComponentProvider, useClass: TasksWizardPriorityComponentProvider},
    TasksWizardAbortComponentService
    // SlickGridProvider
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [BaseComponent],
    declarations: [
        BaseComponent,
        MediaBasketPanelComponent,
        MediaBasketPanelItemComponent,
        BaseLanguageSwitcherComponent,
        BaseProfileComponent,
        BaseTopMenuComponent,
        NoContentComponent,
        NoAccessComponent,
        LogoutByTimeoutComponent,
        ProfileColorSchemasComponent,
        BaseUploadMenuComponent,
        LoginComponent,
        // SettingsColumnComponent
        // directives
        // ModalDirective
    ],
    imports: [ // import Angular's modules
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, {useHash: true}),
        Ng2Webstorage.forRoot({prefix: 'tmd', separator: '.'}),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ng2Modal.forRoot(),
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
            deps: [Http]
        }),
        AngularSplitModule,
        ThumbModule,
        // IMFX MODULES
        // SearchGridModule,
        // SearchViewsModule,
        // SearchFormModule,
        // SearchThumbsModule,
        // SearchFacetsModule,
        // SearchSettingsModule,
        // SearchColumnsModule,
        // SearchAdvancedModule,
        // SearchRecentModule,
        // DetailModule,
        // IMFXControlsDateTimePickerModule,
        // IMFXSearchSuggestionModule,
        // IMFXSilverlightPlayerModule,
        // IMFXHtmlPlayerModule,
        IMFXLanguageSwitcherModule,
        ErrorManagerModule,
        ModalModule,
        // RangeDateTimePickerModule,
        // JointModule,
        OverlayModule,
        // GridStackModule,
        NotificationModule,
        IMFXDropDownDirectiveModule,
        UploadModule,
        RaiseWorkflowWizzardModule,
        ModalPreviewPlayerModule,
        ExportModule,
        TagsModule,
        AcquisitionsWorkspaceModule,
        AcquisitionsModule,
        VersionWizardModule,
        ReportsModule,
        WorkflowModule,
        ReportsModule,
        IMFXModalPromptModule,
        IMFXModalAlertModule,
        MyTasksModule,
        TasksModule,
		MediaWizardModule,
        NamesModalModule,
        SettingsSimplifiedFieldsModule,
        AssessmentModule
        // SimplifiedSettingsModule
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS,
        [
            {provide: RouteReuseStrategy, useClass: IMFXRouteReuseStrategy}
        ]
    ],
    exports: [
        // directives
        // ModalDirective
    ],
    entryComponents: [
        VersionWizardComponent,
        LogoutByTimeoutComponent,
		IMFXModalPromptComponent,
        ReportParamsModalComponent,
        IMFXModalAlertComponent,
        MediaWizardComponent,
        NamesModalComponent,
        SettingsSimplifiedFieldsComponent,
        SaveLayoutModalComponent,
        LoadLayoutModalComponent
    ]
})
export class AppModule {
    constructor(public appRef: ApplicationRef) {
    }
}

