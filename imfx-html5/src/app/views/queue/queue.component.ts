import { Component, EventEmitter, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
// Views
import { ViewsConfig } from '../../modules/search/views/views.config';
import { QueueViewsProvider } from './providers/views.provider';
// Grid
import { GridConfig } from '../../modules/search/grid/grid.config';
// Form
import { SearchFormConfig } from '../../modules/search/form/search.form.config';
import { SearchFormProvider } from '../../modules/search/form/providers/search.form.provider';
// Thumbs
import { SearchThumbsConfig } from '../../modules/search/thumbs/search.thumbs.config';
import { SearchThumbsProvider } from '../../modules/search/thumbs/providers/search.thumbs.provider';
// Facets
import { SearchFacetsConfig } from '../../modules/search/facets/search.facets.config';
import { SearchFacetsProvider } from '../../modules/search/facets/providers/search.facets.provider';
// Search Settings
import { SearchSettingsConfig } from '../../modules/search/settings/search.settings.config';
// Modal
import { ModalConfig } from '../../modules/modal/modal.config';
// Search Columns
import { SearchColumnsComponent } from '../../modules/search/columns/search.columns';
import { SearchColumnsService } from '../../modules/search/columns/services/search.columns.service';
import {
    SearchColumnsProvider
} from '../../modules/search/columns/providers/search.columns.provider';
// Search Modal
import { SearchColumnsConfig } from '../../modules/search/columns/search.columns.config';
import { ModalProvider } from './providers/modal.provider';
// Info Modal
import { InfoModalConfig } from '../../modules/search/info.modal/info.modal.config';
import { InfoModalProvider } from '../../modules/search/info.modal/providers/info.modal.provider';
// Search Detail
import { QueueDetailProvider } from './providers/queue.detail.provider';
// Search Settings
import { SearchRecentConfig } from '../../modules/search/recent/search.recent.config';
import { SearchRecentProvider } from '../../modules/search/recent/providers/search.recent.provider';

import { SearchAdvancedConfig } from '../../modules/search/advanced/search.advanced.config';
import { QueueSearchAdvancedProvider } from './providers/queue.search.advanced.provider';
// constants
import { QueueAppSettings } from './constants/constants';
import { AppSettingsInterface } from '../../modules/common/app.settings/app.settings.interface';
import { IMFXSearchComponent } from '../../modules/search/search.component';
import { ExportProvider } from '../../modules/export/providers/export.provider';
import { ActivatedRoute, Router } from '@angular/router';
import {
    SearchSettingsProvider
} from '../../modules/search/settings/providers/search.settings.provider';
import { SlickGridProvider } from '../../modules/search/slick-grid/providers/slick.grid.provider';
import { SlickGridService } from '../../modules/search/slick-grid/services/slick.grid.service';
import {
  SlickGridConfig, SlickGridConfigModuleSetups,
  SlickGridConfigOptions
} from '../../modules/search/slick-grid/slick-grid.config';
import { SlickGridComponent } from '../../modules/search/slick-grid/slick-grid';
import { CoreSearchComponent } from '../../core/core.search.comp';
import { QueueSlickGridProvider } from './providers/queue.slick.grid.provider';
import { ViewsProvider } from '../../modules/search/views/providers/views.provider';
import { IMFXModalProvider } from '../../modules/imfx-modal/proivders/provider';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {SearchViewsComponent} from "../../modules/search/views/views";
import {QueueSearchRecentProvider} from "../../modules/search/recent/providers/queue.search.recent.provider";
import {QueueParamsComponent} from "./components/queue.params.component/queue.params.component";

@Component({
    selector: 'queue',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ViewsProvider,
        {provide: ViewsProvider, useClass: QueueViewsProvider},
        QueueAppSettings,
        QueueDetailProvider,
        SearchThumbsProvider,
        SearchFacetsProvider,
        SearchFormProvider,
        SearchRecentProvider,
        {provide: SearchRecentProvider, useClass: QueueSearchRecentProvider},
        QueueSearchAdvancedProvider,
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: QueueSlickGridProvider},
        SlickGridService,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
        SearchSettingsProvider
    ]
})

export class QueueComponent extends CoreSearchComponent {
    public refreshOn = false;
    public refreshStarted = false;
    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    @ViewChild('queueParamsPanel') queueParamsPanel: QueueParamsComponent;
    /**
     * Grid
     * @type {GridConfig}
     */
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
      componentContext: this,
      providerType: SlickGridProvider,
      serviceType: SlickGridService,
      options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
        module: <SlickGridConfigModuleSetups>{
          viewModeSwitcher: false,
          savedSearchType: 'AutomatedTask',
          searchType: 'queue',
          onIsThumbnails: new EventEmitter<boolean>(),
          onSelectedView: new EventEmitter<any>(),
          isThumbnails: false,
          pager: {},
          isTree: {
            enabled: false,
            startState: 'collapsed',
            expandMode: 'firstLevel'
          },
          popupsSelectors: {
            'settings': {
              'popupEl': '.mediaSettingsPopup'
            }
          }
        },
      })
    });

    /**
     * Views
     * @type {ViewsConfig}
     */
    @ViewChild('viewsComp') public viewsComp: SearchViewsComponent;
    protected searchViewsConfig = <ViewsConfig>{
        componentContext: this,
        options: {
            type: 'AutomatedTask',
        }
    };

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
                provider: <SearchFormProvider>null
            },
            searchButtonAlwaysEnabled: true
        },
        customQueryParams: []
    };

    /**
     * Facets
     * @type {SearchFacetsConfig}
     */
    public searchFacetsConfig = <SearchFacetsConfig>{
        componentContext: this,
        enabled: false,
        options: {
            provider: <SearchFacetsProvider>null,
            onSearchStringUpdated: new EventEmitter<any>()
        }
    };

    /**
     * Advanced search
     * @type {SearchAdvancedConfig}
     */
    public searchAdvancedConfig = <SearchAdvancedConfig>{
        componentContext: this,
        options: {
            provider: <QueueSearchAdvancedProvider>null,
            restIdForParametersInAdv: 'AutomatedTask',
            enabledQueryByExample: false,
            enabledQueryBuilder: true,
            advancedSearchMode: 'builder'
        }
    };


    /**
     * Settings
     * @type {SearchSettingsConfig}
     */
    private searchSettingsConfig = <SearchSettingsConfig>{
        componentContext: this,
    };

    /**
     * Recent searches
     * @type {SearchRecentConfig}
     */
    private searchRecentConfig = <SearchRecentConfig>{
        componentContext: this,
        options: {
            provider: <SearchRecentProvider>null,
            viewType: 'adv.recent.searches.queue',
            itemsLimit: 10
        }
    };

    private openFacets = true; // default

    constructor(protected searchThumbsProvider: SearchThumbsProvider,
                protected searchFacetsProvider: SearchFacetsProvider,
                public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                protected searchAdvancedProvider: QueueSearchAdvancedProvider,
                protected appSettings: QueueAppSettings,
                protected router: Router,
                protected route: ActivatedRoute,
                public exportProvider: ExportProvider,
                protected injector: Injector) {
        super(injector);

        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;

        // facets
        this.searchFacetsConfig.options.provider = this.searchFacetsProvider;

        // recent searches
        this.searchRecentConfig.options.provider = this.searchRecentProvider;

        // advanced search
        this.searchAdvancedConfig.options.provider = this.searchAdvancedProvider;

        // export
        this.exportProvider.componentContext = (<CoreSearchComponent>this);
    }

    public doRefresh() {
        let self = this;
        setTimeout(() => {
            self.refreshOn = !self.refreshOn;
            self.slickGridComp.provider.doRefresh();
        }, 0);
    }

    /**
     * Handler for QueueParamsComponent emitter
     */
    private selectQueueParam(event) {
        this.searchAdvancedProvider.setCustomFields(event.queueParams);
    }
}
