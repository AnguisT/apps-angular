import {
    Component, EventEmitter, Injector, ViewChild, ViewEncapsulation
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
// Form
import { SearchFormConfig } from '../../modules/search/form/search.form.config';
import { SearchFormProvider } from '../../modules/search/form/providers/search.form.provider';
// Facets
import { SearchFacetsConfig } from '../../modules/search/facets/search.facets.config';
import { SearchFacetsProvider } from '../../modules/search/facets/providers/search.facets.provider';
// Search Settings
import { SearchSettingsConfig } from '../../modules/search/settings/search.settings.config';
// Search Settings
import { SearchRecentConfig } from '../../modules/search/recent/search.recent.config';
import { SearchRecentProvider } from '../../modules/search/recent/providers/search.recent.provider';

import { SearchAdvancedConfig } from '../../modules/search/advanced/search.advanced.config';
import {
    SearchAdvancedProvider
} from '../../modules/search/advanced/providers/search.advanced.provider';
// constants
import { NamesAppSettings } from './constants/constants';
import { AppSettingsInterface } from '../../modules/common/app.settings/app.settings.interface';
// search component
import { SilverlightProvider } from '../../providers/common/silverlight.provider';
import {
    SimplifiedSettingsTransferProvider
} from '../../modules/settings/simplified/simplified.settings.transfer.provider';
import { TransferdSimplifedType } from '../../modules/settings/simplified/types';
import { ExportProvider } from '../../modules/export/providers/export.provider';
import {
    SearchSettingsProvider
} from '../../modules/search/settings/providers/search.settings.provider';
import { CoreSearchComponent } from '../../core/core.search.comp';
import {MappingGridService} from "../mapping/services/mapping.grid.service";
import {NamesTreeComponent} from "./comps/names.tree/names.tree.component";

@Component({
    selector: 'contacts',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        NamesAppSettings,
        SearchFacetsProvider,
        SearchFormProvider,
        SearchRecentProvider,
        SearchAdvancedProvider,
        SilverlightProvider,
        SearchSettingsProvider,
        MappingGridService
    ]
})

export class NamesComponent extends CoreSearchComponent {
    @ViewChild("namesTree") public namesTree: NamesTreeComponent;
    /**
     * Form
     * @type {SearchFormConfig}
     */
    public searchFormConfig = <SearchFormConfig>{
        componentContext: this,
        options: {
            currentMode: 'Titles',
            arraysOfResults: [],//['titles', 'series', 'contributors'],
            appSettings: <AppSettingsInterface>null,
            provider: <SearchFormProvider>null
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
            restIdForParametersInAdv: 'Names',
            enabledQueryByExample: true,
            enabledQueryBuilder: true,
            advancedSearchMode: 'builder'
        }
    };

    /**
     * Recent searches
     * @type {SearchRecentConfig}
     */
    private searchRecentConfig = <SearchRecentConfig>{
        componentContext: this,
        options: {
            provider: <SearchRecentProvider>null,
            viewType: 'adv.recent.searches.names',
            itemsLimit: 10
        }
    };

    constructor(protected searchFacetsProvider: SearchFacetsProvider,
                public searchFormProvider: SearchFormProvider,
                public searchRecentProvider: SearchRecentProvider,
                protected searchAdvancedProvider: SearchAdvancedProvider,
                protected router: Router,
                protected route: ActivatedRoute,
                protected silver: SilverlightProvider,
                protected simpleTransferProvider: SimplifiedSettingsTransferProvider,
                public exportProvider: ExportProvider,
                protected searchSettingsProvider: SearchSettingsProvider,
                protected injector: Injector) {
        super(injector);
        // super(router, route);
        this.simpleTransferProvider.updated.subscribe((setups: TransferdSimplifedType) => {
            console.log(setups);
        });
        // app settings to search form
        this.searchFormConfig.options.appSettings = this.appSettings;
        this.searchFormConfig.options.provider = this.searchFormProvider;

        // recent searches
        this.searchRecentConfig.options.provider = this.searchRecentProvider;

        // advanced search
        this.searchAdvancedConfig.options.provider = this.searchAdvancedProvider;
    }
}
