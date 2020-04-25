/**
 * Created by Sergey Klimenko on 08.03.2017.
 */
import {Injectable, Injector} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {SearchSettingsConfig} from "../search.settings.config";
import {SearchSettingsComponent} from "../search.settings";
import {ExportProvider} from "../../../export/providers/export.provider";
import {ViewsProvider} from "../../views/providers/views.provider";
import { IMFXModalComponent } from '../../../imfx-modal/imfx-modal';
import { ExportComponent } from '../../../export/export';
import { IMFXModalProvider } from '../../../imfx-modal/proivders/provider';
import {SearchColumnsProvider} from "../../columns/providers/search.columns.provider";
import {SearchColumnsComponent} from "../../columns/search.columns";

@Injectable()
export class SearchSettingsProvider {
    config: SearchSettingsConfig;
    moduleContext: SearchSettingsComponent;
    public _currentViewIsIsSaved: boolean;
    constructor(public injector: Injector,
                private modalProvider: IMFXModalProvider) {
    }

    public saveView() {
        let viewsProvider = this.injector.get(ViewsProvider);
        viewsProvider.saveCurrentView();
    }

    public saveViewAs() {
        let viewsProvider = this.injector.get(ViewsProvider);
        viewsProvider.saveViewAs(false);
    }

    public saveGlobalViewAs() {
        let viewsProvider = this.injector.get(ViewsProvider);
        viewsProvider.saveViewAs(true);
        // this.moduleContext.config.componentContext.viewsProvider.onSaveCurrentViewAsGlobal.emit();
    }

    public saveAsDefaultView() {
        let viewsProvider = this.injector.get(ViewsProvider);
        viewsProvider.saveAsDefaultView();
    }

    public exportResults() {
        let modal: IMFXModalComponent = this.modalProvider.show(ExportComponent, {
            size: 'sm',
            title: 'export.title',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });
    }

    /***
     *
     * @returns {any}
     */
    public deleteView() {
        let viewsProvider = this.injector.get(ViewsProvider);
        viewsProvider.deleteView();
    }

    public resetView() {
        let viewsProvider = this.injector.get(ViewsProvider);
        viewsProvider.resetView();
    }


    public setupColumns(){
        let viewsProvider = this.injector.get(ViewsProvider);
        viewsProvider.setupColumns();
    }


    public autoSizeColumns(): Observable<Subscription> {
        return Observable.create((observer) => {
                let gridOptions = this.config.componentContext.searchGridConfig.options.provider.config.gridOptions;
                gridOptions.suppressColumnVirtualisation = true;
                /*TODO: for exclude fixed columns uncomment and exclude from array, replace autoSizeAllColumns to autoSizeColumns(allColumnIds);
                 var allColumnIds = [];
                 var columns = gridOptions.columnApi.getAllColumns();
                 columns.forEach( function(columnDef) {
                 allColumnIds.push(columnDef.colId);
                 });*/
                gridOptions.columnApi.autoSizeAllColumns();
                gridOptions.suppressColumnVirtualisation = false;
            }
        );
    }

    /***
     *
     * @param $event
     * @param config
     * @param fileType
     * @returns {any}
     */
    public exportTo(fileType) {
        let exportProvider = this.injector.get(ExportProvider);
        exportProvider.showModal();
    }

    /***
     *
     * @param $event
     * @param config
     * @returns {any}
     */
    public tickToExportAll() {
        console.log('tickToExportAll');
    }

    public newView() {
        let viewsProvider:ViewsProvider = this.injector.get(ViewsProvider);
        viewsProvider.newView();
        // this.setupColumns();
    }

    /**
     * Set current view saved state
     * @param state
     */
    public setIsSavedCurrentView(state: boolean): void {
        this._currentViewIsIsSaved = state
    }

    /**
     * Get current view saved state
     * @returns {boolean}
     */
    public getCurrentViewSavedState(): boolean {
        return this._currentViewIsIsSaved
        // return this.config.componentContext._currentViewIsIsSaved;
    }
}
