import { Component, EventEmitter, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
// Views
import { ViewsConfig } from '../../modules/search/views/views.config';
import { MisrViewsProvider } from './providers/views.provider';
// Grid
import { GridConfig } from '../../modules/search/grid/grid.config';

import { GridService } from '../../modules/search/grid/services/grid.service';
// Form
import { SearchFormConfig } from '../../modules/search/form/search.form.config';
import { SearchFormProvider } from '../../modules/search/form/providers/search.form.provider';
// Search Modal
import { SearchColumnsConfig } from '../../modules/search/columns/search.columns.config';
// Info Modal
import { InfoModalConfig } from '../../modules/search/info.modal/info.modal.config';
import { InfoModalProvider } from '../../modules/search/info.modal/providers/info.modal.provider';
// Search Settings
import { SearchRecentConfig } from '../../modules/search/recent/search.recent.config';
import { SearchRecentProvider } from '../../modules/search/recent/providers/search.recent.provider';

import { SearchAdvancedConfig } from '../../modules/search/advanced/search.advanced.config';
import {
    SearchAdvancedProvider
} from '../../modules/search/advanced/providers/search.advanced.provider';
import { SearchSettingsConfig } from '../../modules/search/settings/search.settings.config';
// Modal
import { ModalConfig } from '../../modules/modal/modal.config';
// Search Columns
import { SearchColumnsComponent } from '../../modules/search/columns/search.columns';
import { SearchColumnsService } from '../../modules/search/columns/services/search.columns.service';
import {
    SearchColumnsProvider
} from '../../modules/search/columns/providers/search.columns.provider';
// Charts
import { ChartConfig } from '../../modules/search/chart/chart.config';
import { ChartProvider } from '../../modules/search/chart/providers/chart.provider';
// constants
import { MisrAppSettings } from './constants/constants';
import { AppSettingsInterface } from '../../modules/common/app.settings/app.settings.interface';
// grid
import { ExportProvider } from '../../modules/export/providers/export.provider';
import { ActivatedRoute, Router } from '@angular/router';
import {
    SearchSettingsProvider
} from '../../modules/search/settings/providers/search.settings.provider';
import { MisrSlickGridProvider } from './providers/misr.slickgrid.provider';
import { ChartService } from '../../modules/search/chart/services/chart.service';
import { SlickGridProvider } from '../../modules/search/slick-grid/providers/slick.grid.provider';
import { SlickGridService } from '../../modules/search/slick-grid/services/slick.grid.service';
import { CoreSearchComponent } from '../../core/core.search.comp';
import { SlickGridComponent } from '../../modules/search/slick-grid/slick-grid';
import {
    SlickGridConfig, SlickGridConfigModuleSetups,
    SlickGridConfigOptions
} from '../../modules/search/slick-grid/slick-grid.config';
import { ViewsProvider } from '../../modules/search/views/providers/views.provider';
import { IMFXModalProvider } from '../../modules/imfx-modal/proivders/provider';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import {SearchViewsComponent} from "../../modules/search/views/views";

@Component({
    selector: 'misr',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [,
        SlickGridProvider,
        {provide: SlickGridProvider, useClass: MisrSlickGridProvider},
        ViewsProvider,
        {provide: ViewsProvider, useClass: MisrViewsProvider},
        SlickGridService,
        // MisrGridProvider,
        // GridService,
        MisrAppSettings,
        SearchColumnsProvider,
        SearchFormProvider,
        SearchRecentProvider,
        SearchAdvancedProvider,
        ChartProvider,
        SearchColumnsProvider,
        SearchColumnsService,
        SearchSettingsProvider,
        ChartService,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
    ]
})

export class MisrComponent extends CoreSearchComponent {
    /**
     * Grid
     * @type {GridConfig}
     */
        // protected searchGridConfig = <GridConfig>{
        //     componentContext: this,
        //     gridOptions: {
        //         layoutInterval: -1,
        //         isFullWidthCell: (rowNode: RowNode) => {
        //             return rowNode.level === 1;
        //         },
        //         fullWidthCellRendererFramework: MisrDetailRowComponent,
        //         doesDataFlower: () => true,
        //         overlayLoadingTemplate: this.searchGridProvider.getLoadingOverlay(),
        //     },
        //     options: {
        //         type: 'misr',
        //         searchType: 'ScheduleSearch',
        //         viewModeSwitcher: false,
        //         service: <GridService>null,
        //         provider: <MisrGridProvider>null,
        //         onSelectedView: new EventEmitter<any>(),
        //         popupsSelectors: {
        //             'settings': {
        //                 'popupEl': '.misrSettingsPopup'
        //             }
        //         }
        //     },
        // };
    isChartOpened : boolean = false;
    public chartOpened (isOpened){
      this.isChartOpened = isOpened;
    }

    @ViewChild('slickGridComp') slickGridComp: SlickGridComponent;
    protected searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        // providerType: TitlesSlickGridProvider,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                // searchType: 'ScheduleSearch',
                searchType: 'misr',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                isThumbnails: true,
                pager: {},
                isTree: {
                    enabled: false,
                    startState: 'collapsed',
                    expandMode: 'firstLevel'
                },
                popupsSelectors: {
                    'settings': {
                        'popupEl': '.misrSettingsPopup'
                    }
                },
                isExpandable: {
                    enabled: true,
                    startState: 'collapsed'
                },
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
            type: '-4008',
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
                provider: <SearchFormProvider>null,
            }
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
            restIdForParametersInAdv: '-4008',
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
        options: {
            provider: <SearchSettingsProvider>null
        }
    };


    /**
     * Modal
     * @type {SearchSettingsConfig}
     */
    private searchColumnsConfig = <SearchColumnsConfig>{
        componentContext: this,
        options: {
            provider: <SearchColumnsProvider>null
        },
    };

    /**
     * Recent searches
     * @type {SearchRecentConfig}
     */
    private searchRecentConfig = <SearchRecentConfig>{
        componentContext: this,
        options: {
            provider: <SearchRecentProvider>null,
            viewType: 'adv.recent.searches.misr',
            itemsLimit: 10
        }
    };

    /**
     * Chart
     * @type {SearchFormConfig}
     */
    private chartConfig = <ChartConfig>{
        componentContext: this,
        options: {
            provider: <ChartProvider>null,
            //  service: <ChartService>null,
            lineChartColors: [],
            lineChartData: [],
            lineChartLabels: [],
            chartData: {},
            chartAxis: ['Hours', 'Events Count'],
            chartTitle: 'Events distribution'
        }
    };

    constructor(protected viewsProvider: ViewsProvider,
                // protected searchGridProvider: MisrGridProvider,
                // protected searchGridService: GridService,
                public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                protected searchAdvancedProvider: SearchAdvancedProvider,
                protected searchColumnsModalProvider: SearchColumnsProvider,
                protected searchColumnsModalService: SearchColumnsService,
                protected chartProvider: ChartProvider,
                protected appSettings: MisrAppSettings,
                public exportProvider: ExportProvider,
                protected router: Router,
                protected route: ActivatedRoute,
                protected searchSettingsProvider: SearchSettingsProvider,
                protected injector: Injector) {
        super(injector);
        // super(router, route);


        // grid provider
        // this.searchGridConfig.options.provider = searchGridProvider;
        // this.searchGridConfig.options.service = searchGridService;

        // views provider
        this.searchViewsConfig.options.provider = viewsProvider;


        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;

        // recent searches
        this.searchRecentConfig.options.provider = this.searchRecentProvider;

        // advanced search
        this.searchAdvancedConfig.options.provider = this.searchAdvancedProvider;

        // charts
        this.chartConfig.options.provider = this.chartProvider;

        // export
        this.exportProvider.componentContext = this;

        // search settings
        this.searchSettingsConfig.options.provider = this.searchSettingsProvider;
    }

    public refreshOn = false;
    public refreshStarted = false;
    public doRefresh() {
        let self = this;
        setTimeout(() => {
            self.refreshOn = !self.refreshOn;
            self.slickGridComp.provider.doRefresh();
        }, 0);
    }
}
