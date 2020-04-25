import * as $ from "jquery";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    ViewEncapsulation
} from "@angular/core";
import {SearchFacetsConfig} from "./search.facets.config";
import {SearchFacetsProvider, SearchFacetsProviderInterface} from "./providers/search.facets.provider";
import {SearchFacetsService, SearchFacetsServiceInterface} from "./services/search.facets.service";
@Component({
    selector: 'search-facets',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SearchFacetsProvider,
        SearchFacetsService
    ],
    host: {
        //'(window:resize)': 'onResize($event)',
    }
})

export class SearchFacetsComponent {
    private config = <SearchFacetsConfig>{
        componentContext: <any>null,
        enabled: false,
        options: {
            provider: <SearchFacetsProviderInterface>null,
            service: <SearchFacetsServiceInterface>null
        }
    };
    private selectedFacets = [];

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    constructor(@Inject(SearchFacetsService) protected service: SearchFacetsService,
                @Inject(SearchFacetsProvider) protected provider: SearchFacetsProvider,
                public elementRef?: ElementRef,
                public cdr?: ChangeDetectorRef) {
    }

    ngOnInit() {
        // Set default provider/services if custom is null
        !this.config.options.provider ?
            this.config.options.provider = this.provider :
            this.provider = this.config.options.provider;
        !this.config.options.service ?
            this.config.options.service = this.service :
            this.service = this.config.options.service;
        this.provider.config = this.config;

        this.config.options.provider.moduleContext = this;
        this.config.options.onSearchStringUpdated.subscribe(
            (data) => {
                this.config.options.provider.clearSelectedFacets();
            }
        );
    };

    onResize($event) {
        let _this = this;
        this.config.options.provider.facets.forEach(function (facetGroup) {
            _this.setHeight(facetGroup);
        });
    };

    private fillFacets(facets): void {
        this.config.options.provider.fillFacets(facets).subscribe(
            (resp: any) => {
                console.log(resp);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    private isFacetFromSelected(facet) {
        return this.config.options.provider.isFacetFromSelected(facet);
    };

    private clickFacet(facet, facetGroup): void {
        this.config.options.provider.clickFacet(facet, facetGroup).subscribe(
            (resp: any) => {
                if (this.config.componentContext.slickGridComp) {
                    let gridProvider = this.config.componentContext.slickGridComp.provider;
                    gridProvider.buildPage(resp.model);
                    console.log(resp);
                    // this.selectedFacets.push(facet);
                } else {
                    // Send to search
                    let comp = this.config.componentContext;
                    let gridProvider = comp.searchGridConfig.options.provider;
                    gridProvider.buildPage(resp.model);
                    console.log(resp);
                    // this.selectedFacets.push(facet);
                }

            },
            (error) => {
                console.log(error);
            },
        )
    };

    clearFacets() {
        if (this.provider.selectedFacets.length != 0) {
            this.config.options.provider.facets;
            this.config.options.provider.clearFacet().subscribe(
                (resp: any) => {
                    if (this.config.componentContext.slickGridComp) {
                        let gridProvider = this.config.componentContext.slickGridComp.provider;
                        gridProvider.buildPage(resp.model);
                        console.log(resp);
                    } else {
                        // Send to search
                        let comp = this.config.componentContext;
                        let gridProvider = comp.searchGridConfig.options.provider;
                        gridProvider.buildPage(resp.model);
                        console.log(resp);
                    }

                },
                (error) => {
                    console.log(error);
                },
            )
        }
    }

    private setHeight(facetGroup): void {
        return this.config.options.provider.setHeight({
            facetGroup: facetGroup,
            nativeElement: this.elementRef.nativeElement
        });
    };

    private toggleFacetsAccordion(facetGroup): void {
        this.config.options.provider.toggleFacetsAccordion(facetGroup);
    };
}
