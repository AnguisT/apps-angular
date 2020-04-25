/**
 * Created by Sergey Trizna on 03.04.2018.
 */
import {SearchFormProvider} from "../../../../../modules/search/form/providers/search.form.provider";
import {AdvancedSearchModel} from "../../../../../modules/search/grid/models/search/advanced.search";
import {SearchModel} from "../../../../../modules/search/grid/models/search/search";
import {BaseSearchModel} from "../../../../../modules/search/grid/models/search/base.search";
import {SearchAdvancedProvider} from "../../../../../modules/search/advanced/providers/search.advanced.provider";
import {Inject, Injector} from "@angular/core";


export class MediaInsideMappingSearchFormProvider extends SearchFormProvider {
  constructor(@Inject(Injector) private injector: Injector){
    super()
  }

  isEnabledSearchButton(): boolean {
    return true
  }

  getModel(withTitle: boolean = true, withAdv: boolean = true): SearchModel {
    let searchModel = new SearchModel();
    if (withTitle) {
      let baseSearchModel = new BaseSearchModel();
      baseSearchModel.setValue(this.getSearchString());
      searchModel.setBase(baseSearchModel);
    }

    let advModel = new AdvancedSearchModel();
    advModel.setDBField('UNATTACHED');
    advModel.setField('UNATTACHED');
    advModel.setOperation('=');
    advModel.setValue(true);
    searchModel.setAdvanced([advModel]);

    return searchModel;
  }

}

