/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {EventEmitter, ElementRef} from '@angular/core';
import {SearchFormServiceInterface} from './services/search.form.service';
import {SearchFormProviderInterface} from './providers/search.form.provider';
import {AppSettingsInterface} from '../../common/app.settings/app.settings.interface';
import {SearchAdvancedProvider} from "../advanced/providers/search.advanced.provider";
import {SearchAdvancedConfig} from "../advanced/search.advanced.config";
import {SearchFormComponent} from "./search.form";

export class SearchFormSettings {
    /**
     * Service for working with views
     */
    service?: SearchFormServiceInterface;

    /**
     * Provider for working with views
     */
    provider?: SearchFormProviderInterface;

    /**
     * Mode for suggestion search
     * @type {any}
     */
    currentMode?: string = null;

    /**
     * ???
     */
    arraysOfResults?: Array<string>;

    /**
     * Min length of search string for search
     */
    minLength?: number;

    /**
     * Search line
     */
    searchString?: string;

    /**
     * App constants
     */
    appSettings: AppSettingsInterface;

    /**
     * Search button always  enabled
     */
    searchButtonAlwaysEnabled?: boolean;

    /**
     * Do search on startup
     */
    doSearchOnStartup?: boolean;

    /**
     * Enabled search button
     */
    enabledSearchButton?: boolean;
    /**
    * outside search string in the simplified search
    */
    outsideSearchString?: string;
    /**
    * outside criteria in the simplified search
    */
    outsideCriteria?: any;
    /**
    * EventEmitter for the simplified search
    */
    selectedFilters?: EventEmitter<any>;
    /**
    * EventEmitter for the simplified search
    */
    onSearch?: EventEmitter<any>;
    /**
     * EventEmitter for the title search
     */
    onSubmitEmitter?: EventEmitter<any>;

    /**
     * Is busy now for request
     */
    isBusy?: boolean;
}

export class SearchFormConfig {
    /**
     * Context of top component
     */
    public componentContext: any;

    /**
     * Context of module
     */
    public moduleContext?: SearchFormComponent;

    /**
     * Model of Views settings
     * @type {{}}
     */
    public options: SearchFormSettings = {
        appSettings: <AppSettingsInterface> null,
        currentMode: null,
        arraysOfResults: [],
        minLength: 3,
        searchString: '',
        searchButtonAlwaysEnabled: false,
        enabledSearchButton: false,
        doSearchOnStartup: false
    };
}
