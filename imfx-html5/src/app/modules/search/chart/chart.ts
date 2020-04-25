import * as $ from 'jquery';
import {
    Component,
    Input,
    ViewEncapsulation,
    ChangeDetectorRef
} from '@angular/core';
import {ChartConfig} from './chart.config'
import {ChartServiceInterface, ChartService} from './services/chart.service';
import {ChartProvider, ChartProviderInterface} from './providers/chart.provider';
import {LookupService} from '../../../services/lookup/lookup.service';

@Component({
    selector: 'charts',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ChartProvider,
        ChartService,
        LookupService
    ]
})

export class SearchChartComponent {
    /**
     * Default config
     * @type {ViewsConfig}
     */
    private config = <ChartConfig>{
        componentContext: <any>null,
        moduleContext: this,
        options: {
            service: <ChartServiceInterface>null,
            provider: <ChartProviderInterface>null,
            lineChartColors: [],
            lineChartData: [],
            lineChartLabels: [],
            chartData: {},
            chartAxis: [],
            chartTitle: ''
        },
    };
    private channels = [];
    private itemTypes = [];
    private filterLoaded = false;

    /**
     * Extend default config
     * @param config
     */
    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    constructor(private lookupService: LookupService,
                private cdr: ChangeDetectorRef,
                protected service: ChartService,
                protected provider: ChartProvider) {
    }

    ngOnInit() {
        // Set default provider/services if custom is null
        !this.config.options.provider?
            this.config.options.provider = this.provider:
            this.provider = this.config.options.provider;

        !this.config.options.service?
            this.config.options.service = this.service:
            this.service = this.config.options.service;
        this.provider.config = this.config;

        var self = this;

        this.lookupService.getLookupsAsync(["Channels", "ItemTypes"]).subscribe((res)=>{
            self.channels = res[0];
            self.itemTypes = res[1];
            self.filterLoaded = true;
        });

        this.loadDataForChart(false);
    }
    loadDataForChart(params){
        this.config.options.provider.loadDataForChart(params);
    }
    selectParam(e, type){
        this.config.options.provider.selectParam(e, type);
    }
}
