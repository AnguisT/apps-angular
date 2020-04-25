/**
 * Created by Sergey Trizna on 15.03.2018.
 */
import {SearchAdvancedProvider} from "../../../modules/search/advanced/providers/search.advanced.provider";
import {AdvancedSearchModel} from "../../../modules/search/grid/models/search/advanced.search";
import {AdvancedModeTypes} from "../../../modules/search/advanced/types";


export class TasksMySearchAdvancedProvider extends SearchAdvancedProvider {
    /**
     * Get model for search
     * @returns {Array}
     */
    getModels(mode?: AdvancedModeTypes): Array<AdvancedSearchModel> {
        let _models = this.models[mode || this.getSearchMode()] || [];
        let models = [];
        $.each(_models, (grId, crits) => {
            $.each(crits, (critId, model) => {
                models.push(model);
            });
        });

        let additionalModel = new AdvancedSearchModel();
        // Personal_tasks=true
        additionalModel.setDBField('personal_tasks');
        additionalModel.setField('Personal Tasks');
        additionalModel.setOperation('=');
        additionalModel.setValue(true);
        models.push(additionalModel);

        return models;
    }
}
