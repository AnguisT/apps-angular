/**
 * Created by Sergey Trizna on 09.03.2017.
 */
import {Injectable} from "@angular/core";
import {SearchInterfaceModel} from "./search.interface";
import {BaseSearchModel} from "./base.search";
import {AdvancedSearchModel} from "./advanced.search";
import {AdvancedCriteriaListTypes, AdvancedCriteriaType, AdvancedModeTypes} from "../../../advanced/types";

@Injectable()
export class SearchModel implements SearchInterfaceModel {
    private _base?: BaseSearchModel;
    private _advanced?: Array<AdvancedSearchModel> = [];
    private _mode?: AdvancedModeTypes;

    getBase(): BaseSearchModel {
        return this._base;
    }

    setBase(value: BaseSearchModel) {
        this._base = value;
    }

    getAdvanced(): Array<AdvancedSearchModel> {
        return this._advanced;
    }

    setAdvanced(value: Array<AdvancedSearchModel>) {
        this._advanced = value;
    }

    setAdvancedItem(value: AdvancedSearchModel) {
        this._advanced.push(value);
    }

    getAdvancedItem(key): AdvancedSearchModel {
        return this._advanced[key];
    }

    removeAdvancedItemByDBField(dbfield: string): Array<AdvancedSearchModel> {
        $.each(this._advanced, (k, item: AdvancedSearchModel) => {
            if(item.getDBField() == dbfield){
                this._advanced.splice(k,1)
            }
        });
        return this._advanced;
    }

    setMode(mode: AdvancedModeTypes) {
        this._mode = mode;
    }

    getMode(): AdvancedModeTypes {
        return this._mode;
    }

    /**
     * @inheritDoc
     */
    toRequest(): any {
        // return {
        //     'Text': this.baseToRequest(),
        //     'SearchCriteria': this.advancedToRequest(),
        //
        // }
        return 'todo';
    }

    /**
     * Prepare parameters base of search to request (like url decode may be)
     * @returns {string}
     */
    baseToRequest(): string {
        return this.getBase() ? this.getBase().toRequest() : "";
    }

    /**
     * Prepare parametes of advacned search to request
     * @returns {Array}
     */
    advancedToRequest(): AdvancedCriteriaListTypes {
        let res = [];
        this.getAdvanced().forEach((adv) => {
            res.push(adv.toRequest());
        });

        return res;
    }

    getModelForRestore() {
        let res = [];
        this.getAdvanced().forEach(function (adv) {
            res.push(adv.toRestore());
        });

        return res;
    }

    /**
     * Convert search criterias to string
     * @param searchString
     * @param criterias
     * @returns {string}
     */
    toBeautyString(): string {
        let res = '';
        let base = this.getBase();
        if (base && base.getValue()) {
            res += this.baseToBeautyString(base.getValue());
        }

        let criterias = this.getAdvanced();
        res += this.advancedToBeautyString(criterias);

        return res;
    }

    /**
     * Base to beauty string
     * @param str
     * @returns {string}
     */
    baseToBeautyString(str: string): string {
        let res = '';
        if (str && str.length) {
            res += str;
        }

        return res;
    }

    /**
     * advanced to beauty string
     * @param criterias
     * @returns {string}
     */
    advancedToBeautyString(criterias): string {
        let res = '';
        if (criterias.length > 0) {
            res += ' (';
            criterias.forEach((crit) => {
                let humanVal = crit.getHumanValue()?crit.getHumanValue():crit.getValue();
                res += (crit.getField() + ' ' + crit.getOperation() + ' ' + humanVal + '; ');
            });
            res += ')';
        }
        return res;
    }


    /**
     * @inheritDoc
     */
    isValid(): boolean {
        return true;
    }

    createByJSON(json): SearchModel {
        let searchModel = new SearchModel();
        // filing base model
        if (json.Text) {
            let baseSearchModel = new BaseSearchModel()
            baseSearchModel.setValue(json.Text);
            searchModel.setBase(baseSearchModel)
        }
        // filling adv model
        let advModels: Array<AdvancedSearchModel> = [];
        if (json.SearchCriteria && json.SearchCriteria.length > 0) {
            for (let j = 0; j < json.SearchCriteria.length; j++) {
                let crit: AdvancedCriteriaType = json.SearchCriteria[j];
                let advModel = new AdvancedSearchModel();
                advModel = advModel.fillByJSON(crit);
                advModels.push(advModel);
            }
            searchModel.setAdvanced(advModels);
        }

        return searchModel;
    }
}
