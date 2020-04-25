/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
// import {SearchRecentConfig} from './search.recent.config';
// import {RecentModel} from './models/recent';
// import {SearchRecentProvider, SearchRecentProviderInterface} from './providers/search.recent.provider';
// import {SearchRecentService, SearchRecentServiceInterface} from './services/search.recent.service';
// import * as $ from 'jquery';
// import set = Reflect.set;
// import {ArrayProvider} from "../../../providers/common/array.provider";
import {SearchSavedProvider} from "./providers/search.saved.provider";
import {SearchSavedService} from "./services/search.saved.service";
import {SearchSavedConfig} from "./search.saved.config";
import {SavedSearchList} from "./types";
import {IMFXControlsSelect2Component} from "../../controls/select2/imfx.select2";
import {Select2ItemType} from "../../controls/select2/types";
import {NotificationService} from "../../notification/services/notification.service";
import {SearchAdvancedProvider} from "../advanced/providers/search.advanced.provider";

@Component({
    selector: 'search-saved',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        // SearchRecentProvider,
        // SearchRecentService,
        SearchSavedProvider,
        SearchSavedService,
        SearchAdvancedProvider
        // ArrayProvider
    ]
})
export class SearchSavedComponent {
    @ViewChild('searchSavedSelect') public searchSavedSelectRef: IMFXControlsSelect2Component;

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    private config = <SearchSavedConfig>{
        componentContext: <any>null,
        moduleContext: this,
        options: {}
    };
    public listOfSavedSearches: Array<Select2ItemType> = [];

    constructor(private provider: SearchSavedProvider,
                private service: SearchSavedService,
                private notificationRef: NotificationService,
                private cdr: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        !this.config.options.provider ?
            this.config.options.provider = this.provider :
            this.provider = <SearchSavedProvider>this.config.options.provider;
        !this.config.options.service ?
            this.config.options.service = this.service :
            this.service = this.config.options.service;
        this.provider.config = this.config;

        // set reference between component and SavedSearchModule (across SearchAdvancedModule)
        this.config.componentContext = this.config.moduleContext.config.componentContext;
        // dirty hack
        this.config.moduleContext = this;
        this.provider.updateList().subscribe();
    }

    /**
     * On select or un select saved search
     */
    private onSelectSavedSearch() {
        let selectedId: number = this.searchSavedSelectRef.getSelected();
        if (selectedId) {
            this.provider.setSavedSearch(selectedId);
            this.cdr.markForCheck();
        }
    }
}
