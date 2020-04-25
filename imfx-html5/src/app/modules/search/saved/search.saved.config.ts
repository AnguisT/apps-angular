/**
 * Created by Sergey Trizna on 22.09.2017.
 */

import {SearchSavedServiceInterface} from './services/search.saved.service';
import {SearchSavedProviderInterface} from './providers/search.saved.provider';
import {SearchTypesType} from "../../../services/system.config/search.types";

export class SearchSavedSettings {
    /**
     * Service for working module
     */
    service?: SearchSavedServiceInterface;

    /**
     * Provider for working with module
     */
    provider?: SearchSavedProviderInterface;

    /**
     * String of type for rest requests
     * @type {any}
     */
    type?: SearchTypesType;
}

export class SearchSavedConfig {
    /**
     * Context of top component
     */
    public componentContext: any;

    /**
     * Context of module
     */
    public moduleContext?: any;

    /**
     * Model of settings
     * @type {{}}
     */
    public options: SearchSavedSettings = {};
}