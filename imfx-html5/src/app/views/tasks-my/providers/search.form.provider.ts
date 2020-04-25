/**
 * Created by Sergey Trizna on 15.03.2018.
 */
import {SearchFormProvider} from "../../../modules/search/form/providers/search.form.provider";
import {Injectable, Injector} from "@angular/core";
import {SearchModel} from "../../../modules/search/grid/models/search/search";
import {BaseSearchModel} from "../../../modules/search/grid/models/search/base.search";
import {AdvancedSearchModel} from "../../../modules/search/grid/models/search/advanced.search";
import {SearchAdvancedProvider} from "../../../modules/search/advanced/providers/search.advanced.provider";


@Injectable()
export class TasksMySearchFormProvider extends SearchFormProvider {
    constructor(private injector: Injector){
        super()
    }
    getModel(withTitle: boolean = true, withAdv: boolean = true): SearchModel {
        let searchModel = new SearchModel();
        if (withTitle) {
            let baseSearchModel = new BaseSearchModel();
            baseSearchModel.setValue(this.getSearchString());
            searchModel.setBase(baseSearchModel);
        }

        // get data from adv
        let advProv: SearchAdvancedProvider = this.injector.get(SearchAdvancedProvider);
        if (advProv) {
            let advModels: Array<AdvancedSearchModel> = advProv.getModels();
            if (advModels && advModels.length > 0) {
                searchModel.setAdvanced(advModels);
            }

            searchModel.setMode(advProv.getSearchMode());
        }

        return searchModel;
    }
}