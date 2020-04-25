/**
 * Created by Sergey Klimenko on 08.03.2017.
 */
import * as $ from "jquery";
import {Injectable, Injector, EventEmitter} from "@angular/core";
import {SearchAdvancedConfig} from "../search.advanced.config";
import {AdvancedSearchModel} from "../../grid/models/search/advanced.search";
import {SearchTypesType} from "../../../../services/system.config/search.types";
import {
    AdvancedCriteriaListTypes,
    AdvancedCriteriaObjectsWithModeTypes,
    AdvancedCriteriaType,
    AdvancedFieldsPreparedObjectType,
    AdvancedFieldType,
    AdvancedModeTypes,
    AdvancedOperatorsObjectForSelect2Types,
    AdvancedPointerCriteriaType,
    AdvancedPointerGroupType,
    AdvancedRESTIdsForListOfFieldsTypes,
    AdvancedSearchDataCriteriaReturnType,
    AdvancedSearchDataForCreatingCriteria,
    AdvancedSearchDataFromControlType,
    AdvancedSearchGroupRef,
    AdvancedStructureCriteriaDataType,
    AdvancedStructureCriteriaType,
    AdvancedStructureGroupsTypes
} from "../types";
import {Observable} from "rxjs/Observable";
import {Select2ItemType, Select2ListTypes} from "../../../controls/select2/types";
import {isUndefined} from "util";
import {SearchAdvancedProviderInterface} from "./search.advanced.provider.interface";
import {SlickGridProvider} from "../../slick-grid/providers/slick.grid.provider";
import {CoreSearchComponent} from "../../../../core/core.search.comp";
import {SearchViewsComponent} from "../../views/views";
import {SlickGridComponent} from "../../slick-grid/slick-grid";

@Injectable()
export class SearchAdvancedProvider implements SearchAdvancedProviderInterface {

    public onToggle: EventEmitter<boolean> = new EventEmitter();
    constructor(public injector?: Injector) {
    }

    // new implementation
    config: SearchAdvancedConfig;
    models: AdvancedCriteriaObjectsWithModeTypes = {};
    isValidStructureFlag = {
        'builder': null,
        'example': false
    };

    onInit(structs: AdvancedSearchGroupRef[]) {
        // overwrite
    }

    getStructure(): Observable<AdvancedSearchGroupRef[]> {
        return Observable.create((observer) => {
            let data:AdvancedSearchGroupRef[] = this.config.options.service.getStructure();
            observer.next(data);
        });
    }

    /**
     * Add group
     * @param id
     * @param mode
     */
    addGroup(id: number = null,
             mode: AdvancedModeTypes = 'builder',
             struct?: AdvancedSearchDataForCreatingCriteria): void {
        let data = this.getDataByMode(mode);
        let groupId = data.groups.length;
        if (id === null) {
            id = groupId;
        }
        let crits = [];
        // if (!struct) {
        //     struct = this.defaultStructForCriteria;
        // }
        let crit: AdvancedStructureCriteriaType = this.getCriteriaStructure(struct);
        crits.push(crit);
        data.groups.push({
            id: id,
            criterias: crits
        });
    }

    /**
     * Add criteria (and group)
     * @param $event
     */
    addCriteria($event: AdvancedPointerGroupType,
                struct?: AdvancedSearchDataForCreatingCriteria): void {
        let data = this.getDataByMode($event.mode);
        let groups = data.groups;
        if (!groups[$event.groupId]) {
            this.addGroup($event.groupId, $event.mode, struct);
        } else {
            // if (!struct) {
            //     struct = this.defaultStructForCriteria;
            // }
            let crit: AdvancedStructureCriteriaType = this.getCriteriaStructure(struct);
            let group = groups[$event.groupId];
            crit.id = group.criterias.length;
            group.criterias.push(crit);
            let critPointer: AdvancedPointerCriteriaType = {
                groupId: $event.groupId,
                mode: $event.mode,
                criteriaId: crit.id
            };
            critPointer.criteriaId = crit.id;
            this.validateModels();
            // this.config.moduleContext.updateViewReferences();
        }
    }

    /**
     * Remove group by id
     * @param $event
     * @param fromCrit
     */
    removeGroup($event: AdvancedPointerGroupType, fromCrit: boolean = false): void {
        // clear struct
        let data = this.getDataByMode($event.mode);
        let groups = data.groups;
        groups.splice($event.groupId, 1);
        delete this.models[$event.mode][$event.groupId];
        groups.forEach((el, idx) => {
            if (el.id !== idx) {
                this.models[$event.mode][idx] = $.extend(true, {}, this.models[$event.mode][el.id]);
                $.each(this.models[$event.mode][idx], (k, crit) => {
                    crit.GroupId = idx;
                });
                delete this.models[$event.mode][el.id];
                el.id = idx;
            }
        });
        this.updateStateForSearchButton();
        this.validateModels();
    }

    /**
     * Remove criteria
     * @param $event
     */
    removeCriteria($event: AdvancedPointerCriteriaType): void {
        let data = this.getDataByMode($event.mode);
        let groups = data.groups;
        let group = groups[$event.groupId];
        if (group) {
            group.criterias.splice($event.criteriaId, 1);
            delete this.models[$event.mode][$event.groupId][$event.criteriaId];
            group.criterias.forEach((el, idx) => {
                if (el.id !== idx) {
                    this.models[$event.mode][$event.groupId][idx] = $.extend(
                        true,
                        {},
                        this.models[$event.mode][$event.groupId][el.id]
                    );
                    delete this.models[$event.mode][$event.groupId][el.id];
                    el.id = idx;
                }

            });
            if (group.criterias.length === 0) {
                this.removeGroup({
                    groupId: $event.groupId,
                    mode: $event.mode,
                });

            }
            // this.config.moduleContext.updateViewReferences();
        }

        this.validateModels();
    }

    /**
     * Update criteria
     * Fired every time on change criteria
     * @param $event
     */
    updateCriteria($event: AdvancedSearchDataCriteriaReturnType): void {
        // update advanced search model
        if (!this.models[$event.pointer.mode]) {
            this.models[$event.pointer.mode] = {};
        }
        // let pointer = (<any>Object).values($event.pointer).join('_');
        if (!this.models[$event.pointer.mode]) {
            this.models[$event.pointer.mode] = {};
        }
        if (!this.models[$event.pointer.mode][$event.pointer.groupId]) {
            this.models[$event.pointer.mode][$event.pointer.groupId] = {};
        }
        if (!this.models[$event.pointer.mode][$event.pointer.groupId][$event.pointer.criteriaId]) {
            this.models[$event.pointer.mode][
                $event.pointer.groupId
                ][$event.pointer.criteriaId] = new AdvancedSearchModel();
        }
        let advModel = this.models[$event.pointer.mode][
            $event.pointer.groupId
            ][$event.pointer.criteriaId];
        let updatedCriteriaModel = $event.model;
        let updatedCriteriaData = $event.data;
        advModel.setDBField(updatedCriteriaModel.DBField);
        advModel.setField(updatedCriteriaModel.Field);
        advModel.setOperation(updatedCriteriaModel.Operation);
        advModel.setGroupId(updatedCriteriaModel.GroupId);
        if (updatedCriteriaData) {
            advModel.setValue(updatedCriteriaModel.Value);
            advModel.setHumanValue(updatedCriteriaData.humanValue);
        }

        this.models[$event.pointer.mode][
            $event.pointer.groupId
            ][$event.pointer.criteriaId] = advModel;
        this.validateModels();
    }

    /**
     * Return searchType for current view
     */
    getSearchType(): SearchTypesType {
        let svc: SearchViewsComponent = (<CoreSearchComponent>this.config.componentContext).viewsComp;

        return svc?(<SearchTypesType>svc.provider.config.options.type):null;
    }

    /**
     * Return current search mode
     * @returns {AdvancedModeTypes}
     */
    getSearchMode(): AdvancedModeTypes {
        return this.config.options.advancedSearchMode;
    }

    /**
     * Prepare all deps
     * @returns {any}
     */
    init(): Observable<{
        fields: AdvancedFieldsPreparedObjectType,
        operators: AdvancedOperatorsObjectForSelect2Types
    }> {
        return Observable.create((observer) => {
            this.getFieldsAndOperators(
                this.config.options.restIdForParametersInAdv
            ).subscribe((preparedFieldsAndOperatos: {
                fields: AdvancedFieldsPreparedObjectType,
                operators: AdvancedOperatorsObjectForSelect2Types
            }) => {
                observer.next(preparedFieldsAndOperatos);
            });
        });
    }

    /**
     * Return prepared fields and operators
     * @param restId
     */
    getFieldsAndOperators(restId: AdvancedRESTIdsForListOfFieldsTypes): Observable<{
        fields: AdvancedFieldsPreparedObjectType,
        operators: AdvancedOperatorsObjectForSelect2Types
    }> {
        return Observable.create((observer) => {
            this.config.options.service.getFields(
                restId
            ).subscribe((fields: AdvancedFieldsPreparedObjectType) => {
                this.config.options.service.getOperators(
                    'SearchSupportedOperators'
                ).subscribe((operators: AdvancedOperatorsObjectForSelect2Types) => {
                    observer.next({
                        fields: fields,
                        operators: operators
                    });
                });
            });
        });
    }

    /**
     * Return criteria structure with value of field by number
     * @param struct
     */
    getCriteriaStructure(struct?: AdvancedSearchDataForCreatingCriteria): AdvancedStructureCriteriaType {
        let mc = this.config.moduleContext;
        let commonData = mc.config.options.commonData;
        // field
        let field: AdvancedFieldType;
        if (struct) {
            field = $.extend(true, {}, commonData.props[struct.selectedField]);
        } else {
            field = commonData.props[Object.keys(commonData.props)[0]];

        }
        // operators
        let operators: Select2ListTypes = commonData.operators[field.SearchEditorType]||[];

        if(!operators){
            return;
        }
        // selected operator
        let operator: Select2ItemType = operators[0];
        if (struct && struct.selectedOperator) {
            $.each(operators, (k, o) => {
                if (struct.selectedOperator === o.text) {
                    operator = o;
                    return false;
                }
            });
        }

        let data: AdvancedStructureCriteriaDataType = {
            field: field,
            operators: operators,
            operator: operator
        };


        // value
        if (struct && struct.value) {
            data.value = struct.value;
        }

        return <AdvancedStructureCriteriaType>{
            id: 0,
            data: data
        };
    }

    /**
     * Get data by mode
     * @param mode
     * @returns {any}
     */
    getDataByMode(mode: AdvancedModeTypes = 'builder'): AdvancedStructureGroupsTypes {
        let mc = this.config.moduleContext;
        let data = mode === 'builder' ?
            mc.config.options.builderData :
            mc.config.options.exampleData;

        return data;
    }

    /**
     * Is valid structure adv
     * @returns {boolean}
     */
    isValidStructure(): boolean | null {
        return this.isOpenPanel() ? this.isValidStructureFlag[this.getSearchMode()] : null;
    }

    /**
     * Validate model by pointer
     * @param pointer
     */
    validateModel(pointer: AdvancedPointerCriteriaType): void {
        if (pointer.mode === 'builder') {
            console.log('pointer', pointer);
            let m: AdvancedSearchModel;
            if (
                this.models[pointer.mode]
                &&
                this.models[pointer.mode][pointer.groupId]
                &&
                this.models[pointer.mode][pointer.groupId][pointer.criteriaId]
            ) {
                m = this.models[pointer.mode][pointer.groupId][pointer.criteriaId];
                let v = m.getValue();
                this.isValidStructureFlag['builder'] = !(isUndefined(v) || v === '');
            } else {
                this.isValidStructureFlag['builder'] = false;
            }
        } else {
            this.validateExampleModels();
        }
    }

    /**
     * Validate models by current mode
     */
    validateModels(): void {
        let mode = this.getSearchMode();
        if (mode === 'builder') {
            this.validateBuilderModels();
        } else {
            this.validateExampleModels();
        }

        this.updateStateForSearchButton();
    }

    /**
     * Validate builder models
     */
    validateBuilderModels(): void {
        if ($.isEmptyObject(this.models['builder'])) {
            this.isValidStructureFlag['builder'] = null;
        } else {
            this.isValidStructureFlag['builder'] = true;
            $.each(this.models['builder'], (grId, groups) => {
                $.each(groups, (critId, crit) => {
                    if (crit.getValue() === undefined || crit.getValue() === '') {
                        console.log('crit', crit);
                        this.isValidStructureFlag['builder'] = false;
                        return false;
                    }
                });
            });
        }
    }

    /**
     * Validate example models
     */
    validateExampleModels(): void {
        this.isValidStructureFlag['example'] = false;
        $.each(this.models['example'], (grId, groups) => {
            $.each(groups, (critId, crit) => {
                if (crit.getValue() !== undefined && crit.getValue() !== '') {
                    this.isValidStructureFlag['example'] = true;
                    return false;
                }
            });
        });
    }

    /**
     * Set data by mode
     * @param data
     * @param mode
     */
    setDataByMode(data: AdvancedStructureGroupsTypes = {groups: []},
                  mode: AdvancedModeTypes = 'builder'): void {
        let mc = this.config.moduleContext;
        let _data = mode === 'builder' ?
            mc.config.options.builderData :
            mc.config.options.exampleData;
        _data = data;
    }

    /**
     * Get model for search
     * @returns {Array}
     */
    getModels(mode?: AdvancedModeTypes): Array<AdvancedSearchModel> {
        let _models = this.models[mode || this.getSearchMode()]||[];
        let models = [];
        $.each(_models, (grId, crits) => {
            $.each(crits, (critId, model) => {
                models.push(model);
            });
        });

        return models;
    }

    /**
     * Get models prepared to request
     * @param mode
     */
    getModelsPreparedToRequest(mode?: AdvancedModeTypes): AdvancedCriteriaListTypes {
        let models = this.getModels(mode || this.getSearchMode());
        let preparedModels = [];
        $.each(models, (k, m: AdvancedSearchModel) => {
            preparedModels.push(m.toRequest());
        });

        return preparedModels;
    }

    /**
     * Clear params of search for query builder
     */
    clearParamsForBuilder() {
        let m = this.config.moduleContext;
        m.config.options.builderData.groups = [];
        this.models['builder'] = {};
    }

    /**
     * Clear params of search for query by example
     */
    clearParamsForExample(toState: 'empty' | 'default' = 'default') {
        let m = this.config.moduleContext;
        m.config.options.exampleData.groups = [];
        this.models['example'] = {};
        if (toState === 'default') {
            let structs = this.config.options.service.getStructure();
            this.buildStructure(structs);
        }

    }

    /**
     * Clear params of search for qbe and qba
     */
    clearParamsForAll() {
        this.clearParamsForBuilder();
        this.clearParamsForExample();
    }

    /**
     * Build structure use AdvancedSearchGroupRef
     * @param structs
     */
    buildStructure(structs: Array<AdvancedSearchGroupRef>): void {
        $.each(structs, (gKey, group) => {
            $.each(group.criterias, (cKey, criteriaStruct) => {
                this.addCriteria(<AdvancedPointerGroupType>{
                    groupId: group.id,
                    mode: group.mode
                }, criteriaStruct);
            });
        });
        setTimeout(() => {
            this.config.moduleContext.updateViewReferences();
            this.validateModels();
            this.updateStateForSearchButton();
        });
    }

    /**
     * Convert list of criterias to list of structure
     * @param crits
     * @param _mode
     * @returns {Array<AdvancedSearchGroupRef>}
     */
    turnCriteriasToStructures(crits: AdvancedCriteriaListTypes,
                              _mode?: AdvancedModeTypes): Array<AdvancedSearchGroupRef> {
        let mode = _mode ? _mode : this.getSearchMode();
        let structs = <Array<AdvancedSearchGroupRef>>[];
        let _crits: any = {};

        // collect criterias
        $.each(crits, (i, crit: AdvancedCriteriaType) => {
            if (!_crits[crit.GroupId]) {
                _crits[crit.GroupId] = [];
            }
            _crits[crit.GroupId].push(this.turnCriteriaToStructure(crit));
        });

        // create struct
        $.each(_crits, (groupId: number, crits: Array<AdvancedSearchDataForCreatingCriteria>) => {
            let struct = <AdvancedSearchGroupRef>{
                id: groupId,
                mode: mode,
                criterias: crits
            };
            structs.push(struct);
        });

        return structs;
    }

    /**
     * Convert criteria to AdvancedSearchDataFromControlType
     * @param crit
     * @returns {{selectedField: string, selectedOperator: string, value: AdvancedSearchDataFromControlType}}
     */
    turnCriteriaToStructure(crit: AdvancedCriteriaType): AdvancedSearchDataForCreatingCriteria {
        return {
            selectedField: crit.DBField,
            selectedOperator: crit.Operation,
            value: <AdvancedSearchDataFromControlType>{
                value: crit.Value
            }
        };
    }

    /**
     * Is open adv panel
     */
    isOpenPanel(): boolean {
        return this.getStateForPanel();
    }

    /**
     * Is advanced search apply?
     */
    withAdvChecking(): boolean {
      return this.isOpenPanel();
    }

    /**
     * Open adv panel
     */
    openPanel(): void {
        this.setStateForPanel(true);
    }

    /**
     * Close adv panel
     */
    closePanel(): void {
        this.setStateForPanel(false);
    }

    /**
     * Set state for adv panel
     * @param state
     */
    setStateForPanel(state: boolean) {
        this.config.componentContext.searchAdvancedConfig.options.isOpen = state;
        this.config.moduleContext.cdr.detectChanges();
        this.onToggle.emit(state);
    }

    getStateForPanel(): boolean {
        let res: boolean = false;
        if (this.config && this.config.componentContext.searchAdvancedConfig.options.isOpen) {
            res = this.config.componentContext.searchAdvancedConfig.options.isOpen;
        }

        return res;
    }

    /**
     * Set mode for adv
     * @param mode
     */
    setMode(mode: AdvancedModeTypes): void {
        if (!this.config.options.advancedSearchMode ||
            this.config.options.advancedSearchMode !== mode) {
            this.config.options.advancedSearchMode = mode;
        }
    }

    updateStateForSearchButton(): void {
        this.config.componentContext.searchFormConfig.options.provider.config.moduleContext.cdr.detectChanges();
    }
}


