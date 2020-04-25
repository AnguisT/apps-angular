/**
 * Created by initr on 23.11.2016.
 */
import {
    ChangeDetectorRef, Component, Inject, Input, ViewChild, ViewEncapsulation
} from '@angular/core';
import { SearchAdvancedConfig } from './search.advanced.config';
import { SearchAdvancedProvider } from './providers/search.advanced.provider';
import {
    SearchAdvancedService, SearchAdvancedServiceInterface
} from './services/search.advanced.service';
import { ModalProvider } from '../../modal/providers/modal.provider';
import * as $ from 'jquery';
import {
    AdvancedFieldsAndOperators,
    AdvancedFieldsPreparedObjectType,
    AdvancedModeTypes,
    AdvancedOperatorsObjectForSelect2Types,
    AdvancedPointerCriteriaType,
    AdvancedPointerGroupType,
    AdvancedRESTIdsForListOfFieldsTypes,
    AdvancedSearchDataCriteriaReturnType,
    AdvancedSearchGroupRef
} from './types';
import { SearchSavedConfig } from '../saved/search.saved.config';
import { SearchTypesType } from '../../../services/system.config/search.types';
import { SearchAdvancedProviderInterface } from './providers/search.advanced.provider.interface';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
    selector: 'search-advanced',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SearchAdvancedProvider,
        SearchAdvancedService,
    ]
})
export class SearchAdvancedComponent {
    @ViewChild('searchSavedModule') private searchSavedModuleRef;

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    // searchType for current view
    private searchType: SearchTypesType;

    // setups for SearchSaved module
    private searchSavedConfig = <SearchSavedConfig>{
        componentContext: this, // this too ... see dirty hack in SearchSavedComponent
        moduleContext: this,
        options: {
            type: null
        }
    };

    // setups for SearchAdvancedConfig
    private config = <SearchAdvancedConfig>{
        componentContext: <any>null,
        moduleContext: this,
        options: {
            restIdForParametersInAdv: <AdvancedRESTIdsForListOfFieldsTypes>'',
            provider: <SearchAdvancedProviderInterface>null,
            service: <SearchAdvancedServiceInterface>null,
            enabledQueryByExample: true,
            enabledQueryBuilder: true,
            advancedSearchMode: 'builder',
            // data for builder
            builderData: {
                groups: [],
            },
            // data for example
            exampleData: {
                groups: []
            },
            // common data
            commonData: {
                items: [], // array of fields
                props: {}, // array of properties for fields
                operators: {},
            },
            isOpen: false,
            buildExampleUIByModel: true,
            buildBuilderUIByModel: false
        }
    };

    private isVisibleRemoveSearchButton: boolean = false; // is visible remove button
    private isVisibleCreateSearchButton: boolean = false; // is visible create button

    constructor(public cdr: ChangeDetectorRef,
                protected service: SearchAdvancedService,
                protected provider: SearchAdvancedProvider,
                protected modalProvider: ModalProvider,
                private router: Router) {
        this.router.events.subscribe(() => {
            this.resetConfig();
        });
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

        // set searchType for current view
        this.searchType = this.provider.getSearchType();
        // set searchType for SavedSearch module

        this.searchSavedConfig.options.type = <SearchTypesType>this.config.options.restIdForParametersInAdv;

        this.initModule().subscribe((structs: AdvancedSearchGroupRef[]) => {
            this.provider.onInit(structs)
        });
    }

    initModule(): Observable<AdvancedSearchGroupRef[]> {
        // init module
        return Observable.create((observer) => {
            this.provider.init().subscribe((resp: AdvancedFieldsAndOperators) => {
                let cd = this.config.options.commonData;
                cd.items = resp.fields.items;
                cd.props = resp.fields.props;
                cd.operators = resp.operators;


                this.provider.getStructure().subscribe((structs:AdvancedSearchGroupRef[]) => {
                    // qbe
                    if (this.config.options.enabledQueryByExample && this.config.options.buildExampleUIByModel) {
                        this.provider.buildStructure(structs);
                    }

                    if (this.config.options.enabledQueryBuilder && this.config.options.buildBuilderUIByModel) {
                        this.provider.buildStructure(structs);
                    }

                    observer.next(structs);
                });
            });
        });
    }

    resetConfig() {

    }

    ngAfterViewInit() {
        if(this.searchSavedModuleRef){
            this.searchSavedModuleRef.config.options.provider.onSelect.subscribe((searchId: number) => {
                this.updateViewReferences();
            });

            this.searchSavedModuleRef.config.options.provider.onRemove.subscribe(() => {
                this.clearParams();
            });
        }

        this.updateViewReferences();
    }

    /**
     * Update value for references to view
     */
    updateViewReferences(): void {
        // remove button
        this.isVisibleRemoveSearchButton = parseInt(
            this.searchSavedModuleRef.config.options.provider.selectedSearchId) > -1
            // &&
            // this.config.options.builderData.groups.length > 0
            &&
            this.provider.getSearchMode() === 'builder';

        // create button
        this.isVisibleCreateSearchButton = parseInt(
            this.searchSavedModuleRef.config.options.provider.selectedSearchId) > -1
            &&
            this.provider.getSearchMode() === 'builder';

        this.cdr.markForCheck();
    }

    /**
     * Add group
     * @param id
     * @param mode
     */
    addGroup(id: number = null, mode: AdvancedModeTypes = 'builder'): void {
        this.provider.addGroup(id, mode);
    }

    /**
     * Remove group by id
     * @param $event
     */
    removeGroup($event: AdvancedPointerGroupType): void {
        this.provider.removeGroup($event);
    }

    /**
     * Add criteria
     * @param $event
     */
    addCriteria($event: AdvancedPointerGroupType): void {
        this.provider.addCriteria($event);
    }

    /**
     * Remove criteria
     * @param $event
     */
    removeCriteria($event: AdvancedPointerCriteriaType): void {
        this.provider.removeCriteria($event);
    }

    /**
     * Update criteria
     * @param $event
     */
    updateCriteria($event: AdvancedSearchDataCriteriaReturnType): void {
        this.provider.updateCriteria($event);
    }

    /**
     * Clear params of search for qba
     */
    clearParams(mode?: AdvancedModeTypes): void {
        let _mode = mode ? mode : this.provider.getSearchMode();
        if (_mode === 'builder') {
            this.provider.clearParamsForBuilder();
        } else {
            this.provider.clearParamsForExample();
        }
        this.updateViewReferences();

    }

    /**
     * Send params for search
     */
    sendSubmit() {
        this.config.componentContext.searchFormProvider.submit();
    }

    /**
     * Switch adv mode
     * @param mode
     */
    setAdvSearchMode(mode: AdvancedModeTypes): void {
        this.provider.setMode(mode);
    }

    /**
     * Save cutrent search params
     */
    saveSearch() {
        this.searchSavedModuleRef.config.options.provider.save(
            this.provider.getModelsPreparedToRequest()
        );
    }

    /**
     * Remove current search
     */
    removeSearch() {
        this.searchSavedModuleRef.config.options.provider.remove();
    }

    /**
     * Create current search as new for save
     */
    createSearch() {
        this.searchSavedModuleRef.config.options.provider.clearSelectedSearch();
        this.updateViewReferences();
    }
}
