import {ChangeDetectionStrategy, Component, EventEmitter, Injector, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
// Views
import {TasksMyViewsProvider} from "./providers/views.provider";
// Form
import {SearchFormConfig} from "../../modules/search/form/search.form.config";
import {SearchFormProvider} from "../../modules/search/form/providers/search.form.provider";
// Search Settings
import {SearchSettingsConfig} from "../../modules/search/settings/search.settings.config";
// Search Modal
// Modal
import {ModalConfig} from "../../modules/modal/modal.config";
// Search Columns
// Info Modal
// Search Settings
import {SearchRecentConfig} from "../../modules/search/recent/search.recent.config";
import {SearchRecentProvider} from "../../modules/search/recent/providers/search.recent.provider";

import {SearchAdvancedConfig} from "../../modules/search/advanced/search.advanced.config";
import {SearchAdvancedProvider} from "../../modules/search/advanced/providers/search.advanced.provider";
// constants
import {WorkflowAppSettings} from "./constants/constants";
import {AppSettingsInterface} from "../../modules/common/app.settings/app.settings.interface";
// grid
import {ExportProvider} from "../../modules/export/providers/export.provider";
import {SearchSettingsProvider} from "../../modules/search/settings/providers/search.settings.provider";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions,
    SlickGridConfigPluginSetups
} from "../../modules/search/slick-grid/slick-grid.config";
import {SlickGridService} from "../../modules/search/slick-grid/services/slick.grid.service";
import {SlickGridProvider} from "../../modules/search/slick-grid/providers/slick.grid.provider";
import {SlickGridComponent} from "../../modules/search/slick-grid/slick-grid";
import {CoreSearchComponent} from "../../core/core.search.comp";
import {ViewsProvider} from "../../modules/search/views/providers/views.provider";
import {MyTasksWizardPriorityComponentProvider} from "./comps/wizards/priority/providers/wizard.provider";
import {ModalComponent} from "../../modules/modal/modal";
import {MyTasksWizardAbortComponentProvider} from "./comps/wizards/abort/providers/wizard.provider";
import {MyTasksWizardAbortComponentService} from "./comps/wizards/abort/services/wizard.service";
import {SilverlightProvider} from "../../providers/common/silverlight.provider";
import {LookupSearchLocationService} from "../../services/lookupsearch/location.service";
import {ViewsConfig} from "../../modules/search/views/views.config";
import {JobService} from "./services/jobs.service";
import {MyTasksWizardAbortComponent} from "./comps/wizards/abort/wizard";
import {MyTasksWizardPriorityComponent} from "./comps/wizards/priority/wizard";
import {TasksMySlickGridProvider} from "./providers/slick.grid.provider";
import {TasksMySearchAdvancedProvider} from "./providers/search.advanced.provider";
import {TasksMySearchFormProvider} from "./providers/search.form.provider";
import {IMFXModalProvider} from '../../modules/imfx-modal/proivders/provider';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {SearchViewsComponent} from "../../modules/search/views/views";

// Grid

@Component({
    selector: 'tasks-my',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SearchFormProvider,
        {provide: SlickGridProvider, useClass: TasksMySlickGridProvider},
        {provide: ViewsProvider, useClass: TasksMyViewsProvider},
        {provide: SearchFormProvider, useClass: TasksMySearchFormProvider},
        {provide: SearchAdvancedProvider, useClass: TasksMySearchAdvancedProvider},
        SlickGridService,
        WorkflowAppSettings,
        SearchRecentProvider,
        SearchSettingsProvider,
        SilverlightProvider,
        LookupSearchLocationService,
        MyTasksWizardPriorityComponentProvider,
        MyTasksWizardAbortComponentProvider,
        MyTasksWizardAbortComponentService,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
    ]
})

export class TasksMyComponent extends CoreSearchComponent {
    public isGridExpanded: boolean = false;
    public refreshStarted: boolean = false;
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    /**
     * Form
     * @type {SearchFormConfig}
     */
    public searchFormConfig = <SearchFormConfig>{
        componentContext: this,
        options: {
            currentMode: 'Titles',
            appSettings: <AppSettingsInterface>null,
            options: {
                provider: <SearchFormProvider>null,
            },
            searchButtonAlwaysEnabled: true,
            doSearchOnStartup: true
        }
    };
    /**
     * Advanced search
     * @type {SearchAdvancedConfig}
     */
    public searchAdvancedConfig = <SearchAdvancedConfig>{
        componentContext: this,
        options: {
            provider: <SearchAdvancedProvider>null,
            restIdForParametersInAdv: "task",
            enabledQueryByExample: false,
            enabledQueryBuilder: true,
            advancedSearchMode: 'builder'
        }
    };
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                viewMode: 'table',
                searchType: 'task',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: false,
                pager: {
                    enabled: true
                },
                isDraggable: {
                    enabled: true,
                },
                popupsSelectors: {
                    'settings': {
                        'popupEl': '.tasksSettingsPopup'
                    }
                },
            },
            plugin: <SlickGridConfigPluginSetups>{
                multiSelect: true
            }
        })
    });
    /**
     * Settings
     * @type {SearchSettingsConfig}
     */
    protected searchSettingsConfig = <SearchSettingsConfig>{
        componentContext: this,
    };

    /**
     * Recent searches
     * @type {SearchRecentConfig}
     */
    protected searchRecentConfig = <SearchRecentConfig>{
        componentContext: this,
        options: {
            provider: <SearchRecentProvider>null,
            viewType: "adv.recent.searches.my.tasks",
            itemsLimit: 10
        }
    };
    /**
     * Views
     * @type {ViewsConfig}
     */
    @ViewChild('viewsComp') public viewsComp: SearchViewsComponent;
    protected searchViewsConfig = <ViewsConfig>{
        componentContext: this,
        options: {
            type: 'TaskGrid',
        }
    };
    private disabledGroupOperationButtons: boolean = true;
    private modal;

    constructor(public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                protected searchAdvancedProvider: SearchAdvancedProvider,
                protected appSettings: WorkflowAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                public exportProvider: ExportProvider,
                protected searchSettingsProvider: SearchSettingsProvider,
                protected wizardGroupPriorityModalProvider: MyTasksWizardPriorityComponentProvider,
                protected wizardGroupAbortModalProvider: MyTasksWizardAbortComponentProvider,
                protected wizardGroupAbortModalService: MyTasksWizardAbortComponentService,
                protected injector: Injector,
                private modalProvider: IMFXModalProvider) {
        super(injector);

        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;

        // recent searches
        this.searchRecentConfig.options.provider = this.searchRecentProvider;

        // advanced search
        this.searchAdvancedConfig.options.provider = this.searchAdvancedProvider;

        // this.infoModalConfig.options.provider = infoModalProvider;

        // export
        this.exportProvider.componentContext = this;
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngAfterViewInit() {
        let sgp: SlickGridProvider = this.slickGridComp.provider;
        sgp.onSelectRow.subscribe((ids: number[]) => {
            if (ids.length > 0) {
                this.disabledGroupOperationButtons = false;
            } else {
                this.disabledGroupOperationButtons = true;
            }
        });
    }

    openPriorityWizard() {
        let self = this;

        this.modal = this.modalProvider.show(MyTasksWizardPriorityComponent, {
            size: 'md',
            title: 'workflow.topPanel.wizard.priority.title',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });
        this.modal.contentView.instance.onShow();
    }

    openAbortWizard() {
        let self = this;

        this.modal = this.modalProvider.show(MyTasksWizardAbortComponent, {
            size: 'sm',
            title: 'workflow.topPanel.wizard.abort.title',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });
    }
}
