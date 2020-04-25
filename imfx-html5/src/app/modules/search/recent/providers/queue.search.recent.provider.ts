import {SearchRecentProvider} from "./search.recent.provider";
import {Injectable} from "@angular/core";
import {RecentModel} from "../models/recent";
import * as $ from "jquery";
import {
    AdvancedCriteriaListTypes,
    AdvancedCriteriaType,
    AdvancedModeTypes,
    AdvancedSearchGroupRef
} from "../../advanced/types";
import {QueueComponent} from "../../../../views/queue/queue.component";
@Injectable()
export class QueueSearchRecentProvider extends SearchRecentProvider{
    selectRecentSearch(recentSearch: RecentModel){
        let searchModel = recentSearch.getSearchModel();
        if (this.config.moduleContext.externalMode) {
            this.config.moduleContext.onSelect.emit(searchModel);
            return;
        }

        // this.overlayRecentSearches.show($(this.recentsList.nativeElement));
        let searchAdvConfig = this.config.componentContext.searchAdvancedConfig;
        let searchFormConfig = this.config.componentContext.searchFormConfig;
        let advModule = searchAdvConfig.options.provider.config.moduleContext;
        if (!searchAdvConfig || !searchFormConfig) {
            throw new Error('Not found config for advanced or searchForm');
        }
        let advProv = advModule.config.options.provider;
        // get mode for current recent search (by first criteria in search)
        let crit = searchModel.getAdvancedItem(0);
        if (crit) {
            let mode: AdvancedModeTypes = searchModel.getMode();
            advProv.setMode(mode);
            if (!mode) {
                console.error('>>>Search mode or adv not found; you call recent search with deprecated structure');
                mode = 'builder';
            }
            let _crits = searchModel.advancedToRequest();
            let crits:AdvancedCriteriaListTypes = [];
            /// find and handle special fields
            _crits.forEach((crit:AdvancedCriteriaType) => {
                if(crit.DBField == 'ACTION'){
                    (<QueueComponent>this.config.componentContext).queueParamsPanel.setCheckboxes((<string>crit.Value).split('|'));
                } else if(crit.DBField == 'SHOW_COMPLETED') {
                    let bools:any[] = (<string>crit.Value).split('|');
                    bools[0] = bools[0] == 'false'||bools[0] == 0?false:true;
                    bools[1] = bools[1] == 'false'||bools[1] == 0?false:true;
                    (<QueueComponent>this.config.componentContext).queueParamsPanel.setCompleted(bools);
                } else if(crit.DBField == 'CREATED_DT_offset') {
                    //(<QueueComponent>this.config.componentContext).queueParamsPanel.setCreatedDateOffset(crit.Value)
                } else {
                    crits.push(crit);
                }
            });
            (<QueueComponent>this.config.componentContext).queueParamsPanel.emitSelection();
            let structs: Array<AdvancedSearchGroupRef> = advProv.turnCriteriasToStructures(crits);

            if (mode == 'builder') {
                advProv.clearParamsForBuilder();
                advProv.buildStructure(structs);
            } else {
                advProv.clearParamsForExample('empty');
                let defStruct: Array<AdvancedSearchGroupRef> = advModule.service.getStructure();
                structs = $.extend(true, {}, defStruct, structs);
                advProv.buildStructure(structs);
            }
        }

        // restore result
        if(this.config.componentContext.slickGridComp){
            this.config.componentContext.slickGridComp.provider.buildPage(searchModel);
        } else {
            this.config.componentContext.searchGridProvider.buildPage(searchModel);
        }


        //clear selected facets
        if (this.config.componentContext.searchFacetsProvider)
            this.config.componentContext.searchFacetsProvider.clearSelectedFacets();

        // restore search form value
        this.config.componentContext.searchFormConfig.options.provider.setSearchString(searchModel.getBase().getValue());

        // change position for selected search model
        // let self = this;
        this.moveToTop(recentSearch).subscribe(() => {
            // self.overlayRecentSearches.hide($(this.recentsList.nativeElement));

            setTimeout(() => {
                advProv.validateModels();
                advModule.updateViewReferences();
            })
        });
    }
}
