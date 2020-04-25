/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {SearchRecentConfig} from "./search.recent.config";
import {RecentModel} from "./models/recent";
import {SearchRecentProvider} from "./providers/search.recent.provider";
import {SearchRecentService, SearchRecentServiceInterface} from "./services/search.recent.service";
import * as $ from "jquery";
import {ArrayProvider} from "../../../providers/common/array.provider";
import {AdvancedModeTypes, AdvancedSearchGroupRef} from "../advanced/types";
import {SearchAdvancedProvider} from "../advanced/providers/search.advanced.provider";
import set = Reflect.set;
import {SearchRecentProviderInterface} from "./providers/search.recent.provider.interface";

@Component({
    selector: 'search-recent',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SearchRecentProvider,
        SearchRecentService,
        SearchAdvancedProvider,
        ArrayProvider
    ]
})
export class SearchRecentComponent {
    @Input('externalMode') externalMode: boolean = false;
    @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('overlayRecentSearches') private overlayRecentSearches: any;
    @ViewChild('recentsList') private recentsList: any;
    private _recentSearches;
    private error: boolean = false;
    private config = <SearchRecentConfig>{
        componentContext: <any>null,
        moduleContext: this,
        options: {
            provider: <SearchRecentProviderInterface>null,
            service: <SearchRecentServiceInterface>null,
            itemsLimit: 5
        }
    };

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    constructor(@Inject(SearchRecentService) protected service: SearchRecentService,
                @Inject(SearchRecentProvider) protected provider: SearchRecentProvider,
                private arrayProvider: ArrayProvider,
                public cdr: ChangeDetectorRef
    ) {
    }

    private clearRecents() {
        this._recentSearches = [];
        // this.overlayRecentSearches.show(this.recentsList.nativeElement);
        this.cdr.detectChanges();
        this.provider.clearRecentSearches().subscribe(() => {
            // this.overlayRecentSearches.hide(this.recentsList.nativeElement);
        })
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
        this.getRecentSearches();
    }

    ngAfterViewInit() {
        let self = this;
        if (this.config.componentContext && this.config.componentContext.searchAdvancedConfig.options.provider.getStateForPanel()) {
            setTimeout(() => {
                self.overlayRecentSearches.show($(this.recentsList.nativeElement));
            })
        }
    }

    isError($event) {
        if ($event) {
            this.error = true;
        }
    }

    clickRepeat() {
        let self = this;
        if (this.config.componentContext && this.config.componentContext.searchAdvancedConfig.options.provider.getStateForPanel()) {
            this.overlayRecentSearches.show(this.recentsList.nativeElement);
        }
        setTimeout(() => {
            self.getRecentSearches();
        }, 2000);
    }

    /**
     * Return array of recent searches
     */
    getRecentSearches() {
        this.provider.getRecentSearches().subscribe((resp: Array<RecentModel>) => {
            setTimeout(() => {
                if (resp) {
                    this.error = false;
                    if (resp.length > this.config.options.itemsLimit) {
                        console.error('Recents search: Items limit: ', this.config.options.itemsLimit, 'but returned: ', resp.length)
                    }
                    if(this.provider && resp && resp.length > 0){
                        this.provider.setRecentSearches(resp.reverse());
                    }

                }
            });
        });
        if (this.config.componentContext && this.config.componentContext.searchAdvancedConfig.options.provider.getStateForPanel()) {
            this.overlayRecentSearches.hide(this.recentsList.nativeElement)
        }
    }

    /**
     * On select recent search
     * @param recentSearch
     */
    selectResentSearch(recentSearch: RecentModel): void {
        this.provider.selectRecentSearch(recentSearch);
    }
}
