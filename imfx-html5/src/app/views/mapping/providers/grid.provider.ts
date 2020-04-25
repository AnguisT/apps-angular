import {GridProvider} from "../../../modules/search/grid/providers/grid.provider";
import {RaiseWorkflowWizzardProvider} from "../../../modules/rw.wizard/providers/rw.wizard.provider";
import {Inject} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {Router} from "@angular/router";
import {MappingVersionWizardProvider} from "../comps/wizard/providers/wizard.provider";
// import {Router} from "@angular/router";
// import {Inject} from "@angular/core";
// import {BasketService} from "../../../services/basket/basket.service";

export class VersionGridProvider extends GridProvider {
    constructor(@Inject(Router) protected router: Router,
                @Inject(RaiseWorkflowWizzardProvider) protected raiseWorflowProvider: RaiseWorkflowWizzardProvider,
                @Inject(TranslateService) translate: TranslateService,
                // @Inject(VersionWizardProvider) protected wizardProvider: VersionWizardProvider
                //@Inject(BasketService) protected basketService: BasketService
    ) {
        super(translate)
    }

    setViewMode(mode: 'table' | 'tile'): void {
        let gridOptions = this.config.gridOptions,
            viewModeParams = this.config.options.viewModeParams;
        this.config.options.viewMode = mode;
        switch (mode) {
            case 'tile': {
                gridOptions.rowBuffer = 50;
                gridOptions.columnApi.setColumnsVisible(viewModeParams.tile.colsForHide, false);
                gridOptions.columnApi.setColumnsVisible(viewModeParams.tile.colsForShow, true);
                gridOptions.columnApi.setColumnsPinned(viewModeParams.tile.colsForUnpinned, null);
                gridOptions.columnApi.setColumnsPinned(viewModeParams.tile.colsForShow, 'left');
                gridOptions.columnApi.moveColumns(viewModeParams.tile.colsForShow, 0);
                let _api = gridOptions.columnApi;
                _api.getColumn('SER_NUM')['cellRenderer'] = function (params) {
                    let res = '';
                    if (!!params.data.SER_NUM) {
                        res = 'Series: ' + params.data.SER_NUM;
                    }
                    if (!!params.data.SER_NUM && !!params.data.SER_EP_NUM) {
                        res += '&nbsp;&nbsp;&nbsp;';
                    }
                    if (!!params.data.SER_EP_NUM) {
                        res += 'Ep: ' + params.data.SER_EP_NUM
                    }
                    return res;//!!params.data.SER_NUM ? 'Series: '+params.data.SER_NUM : '';
                };
                /* _api.getColumn('SER_EP_NUM')['cellRenderer'] = function(params) {
                 return !!params.data.SER_EP_NUM ? 'Ep: '+params.data.SER_EP_NUM : '';
                 };*/
                _api.getColumn('TITLE')['cellRenderer'] = function (params) {
                    return (!params.data.SER_TITLE || params.data.SER_TITLE == '') ? '' : params.data.TITLE;
                };
                _api.getColumn('VERSION')['cellRenderer'] = function (params) {
                    return (!params.data.SER_TITLE || params.data.SER_TITLE == '') ? params.data.VERSION : '';
                };
                break;
            }
            case 'table': {
                gridOptions.rowBuffer = 20;
                gridOptions.columnApi.setColumnsVisible(viewModeParams.table.colsForHide, false);
                gridOptions.columnApi.setColumnsVisible(viewModeParams.table.colsForShow, true);
                gridOptions.columnApi.setColumnsVisible(['THUMBURL'], this.config.options.isThumbnails);
                gridOptions.columnApi.setColumnsPinned(viewModeParams.table.colsForHide, null);
                gridOptions.columnApi.setColumnsPinned(viewModeParams.table.colsForPinned, 'left');
                gridOptions.columnApi.moveColumns(viewModeParams.table.colsForShow, 0);
                gridOptions.columnApi.moveColumns(viewModeParams.table.colsForPinned, 0);
                let _api = gridOptions.columnApi;
                _api.getColumn('SER_NUM')['cellRenderer'] = function (params) {
                    return params.data.SER_NUM;
                };
                /*_api.getColumn('SER_EP_NUM')['cellRenderer'] = function(params) {
                 return params.data.SER_EP_NUM;
                 };*/
                _api.getColumn('TITLE')['cellRenderer'] = function (params) {
                    return params.data.TITLE;
                };
                _api.getColumn('VERSION')['cellRenderer'] = function (params) {
                    return params.data.VERSION;
                };
                break;
            }
            default: {
                break;
            }
        }
        gridOptions.api.refreshView();
        this.moduleContext.cdr.detectChanges();
        this.onToggleView.emit(mode);
    }

    upload($event, rowData) {
        let up = this.config.componentContext.uploadProvider;
        let data = rowData.data;
        up.moduleContext.setVersion(data.ID, data.FULLTITLE);
        up.open()
    }

    showRaiseWorkflowWizzard($events, rowData) {
        this.raiseWorflowProvider.open(rowData.data, "Version");
    }

    clipEditor($events, rowData) {
        this.config.componentContext.searchWizardModalConfig.options.content.options.provider.showModal(rowData.data.ID)
        // this.wizardProvider.showModal();

        // let data = rowData.data;
        // // console.log(data.ID);
        // this.router.navigate(["clip-editor",data.ID]);
        // debugger
    }
}
