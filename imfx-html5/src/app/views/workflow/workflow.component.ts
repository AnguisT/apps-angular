import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
// Views
import {WorkflowViewsProvider} from "./providers/views.provider";
// Form
import {SearchFormConfig} from "../../modules/search/form/search.form.config";
import {SearchFormProvider} from "../../modules/search/form/providers/search.form.provider";
// Search Settings
import {SearchSettingsConfig} from "../../modules/search/settings/search.settings.config";
// Search Modal
// Modal
import {ModalConfig} from "../../modules/modal/modal.config";
// Search Columns
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
import {WorkflowSlickGridProvider} from "./providers/workflow.slick.grid.provider";
import {ViewsProvider} from "../../modules/search/views/providers/views.provider";
import {WorkflowSlickGridPanelTopComp} from "./comps/slickgrid/panels/top";
import {SlickGridPanelProvider} from "../../modules/search/slick-grid/comps/panels/providers/panels.slick.grid.provider";
import {WorkflowSlickGridPanelProvider} from "./providers/workflow.slick.grid.panel.provider";
import {WorkflowWizardPriorityComponent} from "./comps/wizards/priority/wizard";
import {WorkflowWizardPriorityComponentProvider} from "./comps/wizards/priority/providers/wizard.provider";
import {ModalComponent} from "../../modules/modal/modal";
import {WorkflowWizardAbortComponent} from "./comps/wizards/abort/wizard";
import {WorkflowWizardAbortComponentProvider} from "./comps/wizards/abort/providers/wizard.provider";
import {WorkflowWizardAbortComponentService} from "./comps/wizards/abort/services/wizard.service";
import {WorkflowUsersProvider} from "./comps/users/providers/users.provider";
import {SilverlightProvider} from "../../providers/common/silverlight.provider";
import {LookupSearchLocationService} from "../../services/lookupsearch/location.service";
import {ViewsConfig} from "../../modules/search/views/views.config";
import {JobService} from "./services/jobs.service";
import {IMFXModalProvider} from '../../modules/imfx-modal/proivders/provider';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {SearchViewsComponent} from "../../modules/search/views/views";

// Grid

@Component({
    selector: 'workflow',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {provide: SlickGridProvider, useClass: WorkflowSlickGridProvider},
        {provide: ViewsProvider, useClass: WorkflowViewsProvider},
        {provide: SlickGridPanelProvider, useClass: WorkflowSlickGridPanelProvider},
        SlickGridService,
        WorkflowAppSettings,
        SearchFormProvider,
        SearchRecentProvider,
        SearchAdvancedProvider,
        WorkflowUsersProvider,
        SilverlightProvider,
        LookupSearchLocationService,
        SearchSettingsProvider,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
    ]
})

export class WorkflowComponent extends CoreSearchComponent {
    public isGridExpanded: boolean = false;
    public isOpenedSchedule: boolean = false;
    public refreshStarted: boolean = false;
    public modal;
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
            searchButtonAlwaysEnabled: false,
            doSearchOnStartup: false
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
            restIdForParametersInAdv: "Job",
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
                searchType: 'workflow',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: false,
                pager: {
                    enabled: true
                },
                isDraggable: {
                    enabled: true,
                },
                isExpandable: {
                    enabled: true,
                    startState: "collapsed"
                },
                popupsSelectors: {
                    'settings': {
                        'popupEl': '.workflowSettingsPopup'
                    }
                },
                topPanel: {
                    enabled: true,
                    typeComponent: WorkflowSlickGridPanelTopComp
                }
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
            viewType: "adv.recent.searches.workflow",
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
            type: 'Job',
        }
    };
    private disabledGroupOperationButtons: boolean = true;

    constructor(protected viewsProvider: ViewsProvider,
                public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                protected searchAdvancedProvider: SearchAdvancedProvider,
                protected appSettings: WorkflowAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                public exportProvider: ExportProvider,
                protected wizardGroupPriorityModalProvider: WorkflowWizardPriorityComponentProvider,
                protected wizardGroupAbortModalProvider: WorkflowWizardAbortComponentProvider,
                protected wizardGroupAbortModalService: WorkflowWizardAbortComponentService,
                protected injector: Injector,
                private cdr: ChangeDetectorRef,
                private modalProvider: IMFXModalProvider
    ) {
        super(injector);

        // views provider
        this.searchViewsConfig.options.provider = viewsProvider;

        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;


        // recent searches
        this.searchRecentConfig.options.provider = this.searchRecentProvider;

        // advanced search
        this.searchAdvancedConfig.options.provider = this.searchAdvancedProvider;

        // export
        this.exportProvider.componentContext = this;
    }

    public setOpenedSchedule(isOpen: boolean) {
        this.isOpenedSchedule = isOpen;
    }

    ngOnInit() {
        super.ngOnInit();
    }

    expandAll() {
        (<WorkflowSlickGridProvider>this.slickGridComp.provider).setAllExpanded(true);
        (<WorkflowSlickGridProvider>this.slickGridComp.provider).isGridExpanded = true;
        (<WorkflowSlickGridProvider>this.slickGridComp.provider).expandedRows = [];
    }

    collapseAll() {
        (<WorkflowSlickGridProvider>this.slickGridComp.provider).setAllExpanded(false);
        (<WorkflowSlickGridProvider>this.slickGridComp.provider).isGridExpanded = false;
        (<WorkflowSlickGridProvider>this.slickGridComp.provider).expandedRows = [];
    }

    resetExpandCollapseButton() {
        (<WorkflowSlickGridProvider>this.slickGridComp.provider).isGridExpanded = false;
    }


    issetData(): boolean {
        let res = false;
        try {
            res = this.slickGridComp.provider.getData().length > 0
        } catch (e) {
        }

        // setImmediate(() => {
        //     this.cdr.markForCheck()
        // });

        return res;
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

    switchSchedule() {
        this.isOpenedSchedule = !this.isOpenedSchedule;
    }

    openPriorityWizard() {
        let self = this;

        this.modal = this.modalProvider.show(WorkflowWizardPriorityComponent, {
            size: 'md',
            title: 'workflow.topPanel.wizard.priority.title',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });
        this.modal.contentView.instance.onShow();
    }

    openAbortWizard() {
        let self = this;

        this.modal = this.modalProvider.show(WorkflowWizardAbortComponent, {
            size: 'sm',
            title: 'workflow.topPanel.wizard.abort.title',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });
    }
}
