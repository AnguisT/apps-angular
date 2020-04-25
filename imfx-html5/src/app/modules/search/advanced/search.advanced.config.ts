/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import { SearchAdvancedServiceInterface } from './services/search.advanced.service';
import {
    AdvancedModeTypes,
    AdvancedRESTIdsForListOfFieldsTypes,
    AdvancedSearchSettingsCommonData,
    AdvancedStructureGroupsTypes
} from './types';
import { SearchAdvancedProviderInterface } from './providers/search.advanced.provider.interface';

export class SearchAdvancedSettings {
    /**
     * Service for working module
     */
    service?: SearchAdvancedServiceInterface;

    /**
     * Provider for working with module
     */
    provider?: SearchAdvancedProviderInterface;

    /**
     * Enabled query by example
     */
    enabledQueryByExample?: boolean;

    /**
     * Enable query builder
     */
    enabledQueryBuilder?: boolean;

    /**
     * Advanced search active mode
     */
    advancedSearchMode?: AdvancedModeTypes;

    /**
     * Data for query builder
     */
    builderData?: AdvancedStructureGroupsTypes;

    /**
     * Data for query by example
     */
    exampleData?: AdvancedStructureGroupsTypes;

    /**
     * Common data for adv
     */
    commonData?: AdvancedSearchSettingsCommonData;
    // commonData?: any = {
    //
    //     // criteriaModelStandard: { // standard model of criteria
    //     //     id: 0,
    //     //     data: {
    //     //         name: null,
    //     //         lookupType: '',
    //     //         lookupSearchType: '',
    //     //         operators: [],
    //     //         operator: {
    //     //             id: 0,
    //     //             text: ''
    //     //         },
    //     //         value: null
    //     //     }
    //     // }
    // };

    /**
     * Rest id for search info
     */
    restIdForParametersInAdv: AdvancedRESTIdsForListOfFieldsTypes;

    /**
     * State of adv panel (opened/closed)
     */
    isOpen?: boolean;

    buildExampleUIByModel?: boolean;
    buildBuilderUIByModel?: boolean
}

export class SearchAdvancedConfig {
    /**
     * Context of top component
     */
    public componentContext: any;

    public moduleContext?: any;

    /**
     * Model of settings
     * @type {{}}
     */
    public options: SearchAdvancedSettings = {
        restIdForParametersInAdv: '',
        isOpen: false,
    };
}
