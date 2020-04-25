/**
 * Created by Pavel on 16.03.2017.
 */
import {EventEmitter, Inject, Injectable} from '@angular/core';
import {Observable, Subscription} from "rxjs";

import {SearchAdvancedProvider} from "../../../modules/search/advanced/providers/search.advanced.provider";
import {SearchAdvancedConfig} from "../../../modules/search/advanced/search.advanced.config";
import {AdvancedSearchModel} from "../../../modules/search/grid/models/search/advanced.search";
import {QueueSearchParams} from "../model/queue.search.params";
import {LookupService} from "../../../services/lookup/lookup.service";
import * as $ from "jquery";
import { AdvancedModeTypes } from '../../../modules/search/advanced/types';

@Injectable()
export class QueueSearchAdvancedProvider extends SearchAdvancedProvider {

  private customFields: QueueSearchParams = new QueueSearchParams();

  /**
   * Adv data to models
   * @returns {Array<AdvancedSearchModel> }
   */
  getModels(mode?: AdvancedModeTypes): Array<AdvancedSearchModel> {
    // let mode = this.config.options.advancedSearchMode;
    // let options = this.config.options;
    // let groups = mode=='builder'?options.builderData.groups:options.exampleData.groups;
    // let models = [];
    // groups.forEach(function (group) {
    //   let crits: Array<any> = group.criterias;
    //   crits.forEach(function (crit) {
    //     let data = crit.data;
    //     if (data.value && data.value.length) {
    //       let advancedModel = new AdvancedSearchModel();
    //       advancedModel.setDBField(data.name);
    //       advancedModel.setField(data.options.friendlyName);
    //       advancedModel.setOperation(data.operator.text);
    //       advancedModel.setGroupId(group.id);
    //       advancedModel.setValue(data.value);
    //       models.push(advancedModel);
    //     }
    //   });
    // });

    let _models = this.models[mode || this.getSearchMode()];
    let models = [];
    $.each(_models, (grId, crits) => {
      $.each(crits, (critId, model) => {
        models.push(model);
      });
    });

    return models.concat(this.getCustomCriterias())

  }

  isOpenPanel(): boolean {
    let isOpenFilters = this.config.componentContext.searchFacetsProvider.isOpenFacets();
    let isOpenAdvSearch = this.getStateForPanel();
    return isOpenFilters || isOpenAdvSearch;
  }

  withAdvChecking(): boolean {
    let isOpen = this.isOpenPanel();
    if (!isOpen) {
      return false;
    }

    // Is any of advanced searching criteries active?
    let isExistAdvCrit = !!this.models.builder && !!this.models.builder[0];
    let isExistFacetsCrit = !!this.customFields.services.length || this.customFields.showError || this.customFields.showCompleted;

    return isExistAdvCrit || isExistFacetsCrit;
  }

  setCustomFields(f) {
    this.customFields = f;
  }

  getCustomCriterias() {
    let models = [];

    let actionModel = new AdvancedSearchModel();
    actionModel.setDBField("ACTION");
    actionModel.setField("ACTION");
    actionModel.setOperation("=");
    actionModel.setGroupId(undefined);
    actionModel.setValue(this.customFields.services.map(el=>el.id).join("|"));
    models.push(actionModel);

    let showCompleted = new AdvancedSearchModel();
    showCompleted.setDBField("SHOW_COMPLETED");
    showCompleted.setField("SHOW_COMPLETED");
    showCompleted.setOperation("=");
    showCompleted.setGroupId(undefined);
    showCompleted.setValue(this.customFields.showCompleted + "|" + this.customFields.showError);
    models.push(showCompleted);

    let offset = new AdvancedSearchModel();
    offset.setDBField("CREATED_DT_offset");
    offset.setField("CREATED_DT_offset");
    offset.setOperation("=");
    offset.setGroupId(undefined);
    offset.setValue(7);
    models.push(offset);

    return models;
  }

}
