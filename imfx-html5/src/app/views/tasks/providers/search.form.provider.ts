/**
 * Created by Sergey Trizna on 22.03.2018.
 */
import {SearchFormProvider} from "../../../modules/search/form/providers/search.form.provider";
import {ChangeDetectorRef, Injectable, Injector} from "@angular/core";
import {SearchAdvancedProvider} from "../../../modules/search/advanced/providers/search.advanced.provider";
import {TasksUsersProvider} from "../comps/users/providers/users.provider";
import {SearchModel} from "../../../modules/search/grid/models/search/search";
import {BaseSearchModel} from "../../../modules/search/grid/models/search/base.search";
import {AdvancedSearchModel} from "../../../modules/search/grid/models/search/advanced.search";

@Injectable()
export class TasksSearchFormProvider extends SearchFormProvider{
    constructor(private injector: Injector, private cdr: ChangeDetectorRef){
        super()
    }
    /**
     * Is  enabled search button
     * @returns {boolean}
     */
    // isEnabledSearchButton(): boolean {
    //     let res: boolean = true;
    //     let sac = this.injector.get(SearchAdvancedProvider);
    //
    //     if (sac) {
    //         // throw new Error('this.config.moduleContext.config.componentContext.searchAdvancedConfig is not available')
    //         res = sac.isValidStructure();
    //     }
    //
    //     if(!res) {
    //         let tup = this.injector.get(TasksUsersProvider);
    //         if(tup.selectedNodes.length > 0){
    //             res = true;
    //         }
    //     }
    //
    //     // debugger
    //     // setTimeout(() => {
    //     //     this.cdr.markForCheck();
    //     // });
    //
    //     return res;
    // }

    getModel(withTitle: boolean = true, withAdv: boolean = true): SearchModel {
        let searchModel = new SearchModel();
        if (withTitle) {
            let baseSearchModel = new BaseSearchModel();
            baseSearchModel.setValue(this.getSearchString());
            searchModel.setBase(baseSearchModel);
        }

        let advProv = this.injector.get(SearchAdvancedProvider);
        withAdv = advProv.isOpenPanel();
        // get data from adv
        // let advProv = this.config.componentContext.searchAdvancedProvider;
        if (advProv && withAdv) {
            let advModels: Array<AdvancedSearchModel> = advProv.getModels();
            if (advModels && advModels.length > 0) {
                searchModel.setAdvanced(advModels);
            }

            searchModel.setMode(advProv.getSearchMode());
        }

        return searchModel;
    }
}