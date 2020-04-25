import {SearchFacetsServiceInterface} from './services/search.facets.service';
import {SearchFacetsProviderInterface} from './providers/search.facets.provider';
import {EventEmitter} from '@angular/core';

export class SearchFacetsSettings {
    /**
     * Service for working module
     */
    service?: SearchFacetsServiceInterface;

    /**
     * Provider for working with module
     */
    provider?: SearchFacetsProviderInterface;
    /**
    * Facets from search query
    */
    facets?: any;
    onSearchStringUpdated?: EventEmitter<any>;
}

export class SearchFacetsConfig {
    /**
     * Context of top component
     */
    public componentContext: any;

    /**
     * Is enabled button
     */
    public enabled: boolean;

    /**
     * Model of settings
     * @type {{}}
     */
    public options: SearchFacetsSettings = {
        provider: <SearchFacetsProviderInterface>null
    };
}
