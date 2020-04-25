import {Injectable} from "@angular/core";
import {SearchModel} from "../grid/models/search/search";

@Injectable()
export class DefaultSearchProvider {

  private defaultSearchParams: {
    searchString: string;
    searchCriteria: any;
  };

  private defaultSearchModel: SearchModel;

  constructor() {
  }

  public setDefaultSearchParams(ds) {
    this.defaultSearchParams = ds;
  }

  public getDefaultSearchParams() {
    return this.defaultSearchParams;
  }

  public clearDefaultSearchParams() {
    this.defaultSearchParams = null;
  }

  public setDefaultSearchModel(dsm: SearchModel) {
    this.defaultSearchModel = dsm;
  }

  public getDefaultSearchModel(): SearchModel {
    return this.defaultSearchModel;
  }

  public clearDefaultSearchModel() {
    this.defaultSearchModel = null;
  }

}
