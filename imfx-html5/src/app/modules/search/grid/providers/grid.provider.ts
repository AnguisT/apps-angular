/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import { GridConfig } from '../grid.config';
import { SearchModel } from '../models/search/search';
import { RecentModel } from '../../recent/models/recent';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as $ from 'jquery';
import { TranslateService } from 'ng2-translate';
import {FinalSearchRequestType} from '../types';
import { GridProviderInterface } from './grid.provider.interface';
import { SearchGridComponent } from '../grid';
import { AllSearchResponse } from '../../../../models/search/search.response';
import {SearchThumbsComponent} from "../../thumbs/search.thumbs";
import { appRouter } from '../../../../constants/appRouter';

@Injectable()
export class GridProvider implements GridProviderInterface {
  config: GridConfig;
  moduleContext: SearchGridComponent;
  translate: TranslateService;
  onSetColumns: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();
  onIsThumbnails: EventEmitter<boolean> = new EventEmitter<boolean>();
  onToggleView: EventEmitter<string> = new EventEmitter<string>();
  lastRequestForSearch: FinalSearchRequestType;
  lastSearchModel: SearchModel;

  constructor(@Inject(TranslateService)translate: TranslateService) {
    this.translate = translate;
  }


  getLoadingOverlay() {
    return require("../tpl/loading-overlay.html").replace("%loading%", this.translate.instant('common.loadingOoo'));
  }

  /**
   * Set columns to table
   * @param columns
   */
  setColumns(columns) {
    return this.onSetColumns.emit(columns);
  }

  /**
   * Build page with results
   * @param searchModel
   */
  buildPage(searchModel: SearchModel): void {
    this.showLoadingOverlay();
    let sfp = this.config.componentContext.searchFormProvider;
    if (!searchModel.isValid()) {
      this.buildEmptyPage();
      if (sfp) {
        sfp.unlockForm();
      }
      return;
    }

    let dataSource = {
      getRows: (params) => {
        let requestForSearch = this.getRequestForSearch(searchModel);
        this.lastRequestForSearch = requestForSearch;
        this.lastSearchModel = searchModel;
        // let page = params.endRow / this.config.gridOptions.paginationPageSize;
        // let colId = params.sortModel.length ? params.sortModel[0].colId : '';
        // let sort = params.sortModel.length ? params.sortModel[0].sort : '';

        this.config.options.service.search(
          this.config.options.type,
          searchModel,
          requestForSearch.Page,
          requestForSearch.SortField,
          requestForSearch.SortDirection
        ).subscribe(
          (resp: AllSearchResponse) => {
            if (this.config.componentContext.searchRecentConfig) {
              // Update recent searches
              let recentSearch = new RecentModel();
              recentSearch.setSearchModel(searchModel);
              recentSearch.setTotal(resp.Rows);
              // recentSearch.setTotal(Math.floor(6666 + Math.random() * (9999 + 1 - 6666)));
              recentSearch.fillBeautyString();
              let recentSearchesProvider = this.config.componentContext.searchRecentProvider;
              if (recentSearchesProvider) {
                recentSearchesProvider.addRecentSearch(recentSearch);
              }
            }

            // fill facets
            let facets = [];
            if (resp.Facets && resp.Facets.Facets) {
              facets = resp.Facets.Facets;
            }

            let facetsConfig = this.config.componentContext.searchFacetsConfig;
            if (facetsConfig) {
              facetsConfig.options.provider.fillFacets(facets);
            }
            //----fill facets end----

            if (!resp.Data || !resp.Rows || resp.Data.length == 0 || resp.Rows <= 0) {
              // If empty resp - build empty page
              this.buildEmptyPage();
              // clear detail block
              let detailConfig = this.config.componentContext.detailConfig;
              if (detailConfig) {
                detailConfig.options.data.detailInfo = null;
                let proivder = detailConfig.options.provider;
                if (proivder.getStateForPanel() === true) {
                  detailConfig.options.onDataUpdated.emit(null);
                }
              }

              // If empty resp - build empty page
              let cb = () => {
                let type = this.config.options.type;
                if (type == 'media' || type == 'versions' || type == 'title') {
                  this.setTextToOverlay('ng2_components.ag_grid.noRowsToShow', true, {})
                }
              };
              this.buildEmptyPage(cb);
              return;
            }

            // Setup data to rows
            this.config.gridOptions.rowData = resp.Data;

            // Adding thumbs to rows
            // let thumbnails = this.config.componentContext.searchThumbsProvider;
            // if (thumbnails) {
            //   thumbnails.buildToRows(this.config.gridOptions.rowData);
            // }
            let searchThumbsComp: SearchThumbsComponent = this.config.componentContext.searchThumbsComp;
            if(searchThumbsComp){
              searchThumbsComp.provider.buildToRows(this.config.gridOptions.rowData);
            }

            // Update data in table
            params.successCallback(resp.Data, resp.Rows);
            // Set selected first row
            this.setSelectedRow('first');
            if (sfp) {
              sfp.unlockForm();
            }
          },
          (err) => {
            let cb = () => {
              if (err.json().Message) {
                this.setTextToOverlay(err.json().Message, false, {});
              } else {
                this.setTextToOverlay('common.errorUnknown', true, {})
              }
            }
            this.buildEmptyPage(cb);          // err.json().Message
            if (sfp) {
              sfp.unlockForm();
            }
          },
          () => {
            if (sfp) {
              sfp.unlockForm();
            }
          });
        // }
      }
    };

    this.config.options.gridRef.api.setDatasource(dataSource);
  };

  getRequestForSearch(searchModel?: SearchModel): FinalSearchRequestType {
    // let self = this;

    let withAdv = false;
    let advConf = this.config.componentContext.searchAdvancedConfig;
    if (advConf) {
      withAdv = advConf.options.provider.isOpenPanel();
    }
    if (!searchModel) {
      if (this.config.componentContext.searchFormConfig) {
        searchModel = this.config.componentContext.searchFormConfig.options.provider.getModel(true, false);
      } else {
        searchModel = new SearchModel();
      }
    }

    let page = (this.config.gridOptions.api.paginationGetCurrentPage() + 1);
    let sortModel = this.config.gridOptions.api.getSortModel();
    let colId = sortModel.length ? sortModel[0].colId : '';
    let sort = sortModel.length ? sortModel[0].sort : '';
    let data = this.config.options.service.getParamsForSearch(searchModel, page, colId, sort);

    return data;
  }

  /**
   * Build empty page
   */
  buildEmptyPage(cb?) {
    let dataSource = {
      getRows: function (params) {
        params.successCallback([], 0);
        if (cb) {
          cb();
        }
      }
    }

    this.config.gridOptions.api.setDatasource(dataSource);
    //
  };

  /**
   * On mouse down event
   * @param node
   */
  onRowMousedown(node): any {
    let detailConfig = this.config.componentContext.detailConfig;
    if (detailConfig) {
      detailConfig.options.data.detailInfo = node.data;
      let searchText = this.getTextForMark();
      detailConfig.options.externalSearchTextForMark = searchText;
      let proivder = detailConfig.options.provider;
      // if (proivder.getStateForPanel() === true) {
      detailConfig.options.provider.config.options.externalSearchTextForMark = searchText;
      detailConfig.options.onDataUpdated.emit(node.data);
      // }
    }
  }

  /**
   * On double click by row
   * @param $event
   */
  onRowDoubleClicked($event): any {
    if ($event.event.target.tagName == 'IMG' && ($event.event.target.className == 'settings-icon' || $event.event.target.className == 'media-basket-icon')) {
      return;
    }
    // store id selected row
    // this.selectedId = $event.data.ID;
    let destination = this.config.options.type.replace('inside-', '');
    this.moduleContext.router.navigate(
      [
        appRouter[destination].detail.substr(
          0,
          appRouter[destination].detail.lastIndexOf('/')),
        $event.data.ID
      ]
    );
  }

  /**
   * Select row on mousedown
   */
  onCellFocused($event): any {
    if ($event.column) {
      let model = this.config.gridOptions.api.getModel();
      let node = model.getRow($event.rowIndex);
      if (node) {
        node.setSelected(true);
        node.data.expanded = node.expanded;
        this.onRowMousedown(node);
      }
    }
  }

  onColumnMoved($event): any {
    //COlumn moved handler
  }

  onColumnPinned($event): any {
    if ($event.pinned) {
      this.config.gridOptions.columnApi.setColumnPinned($event.column, null);
      this.config.gridOptions.columnApi.moveColumns($event.column, 0);
    }
  }

  /**
   * Set selected row by id
   */
  setSelectedRow(id: number | 'first'): void {
    let nodes = this.config.gridOptions.api.getModel()['rowsToDisplay'];//getRenderedNodes();
    let detailConfig = this.config.componentContext.detailConfig;
    if (!nodes || nodes.length == 0) {
      return;
    }
    if (id == 'first') {
      let alreadySelected = nodes[0].isSelected();
      if (!alreadySelected) {
        nodes[0].setSelected(true);
        this.onRowMousedown(nodes[0]);
      }
      if (detailConfig) {
        detailConfig.options.data.detailInfo = nodes[0].data;
        let searchText = this.getTextForMark();
        detailConfig.options.externalSearchTextForMark = searchText;
        let proivder = detailConfig.options.provider;
        if (proivder.getStateForPanel() === true) {
          detailConfig.options.provider.config.options.externalSearchTextForMark = searchText;
          if (!alreadySelected) {
            detailConfig.options.onDataUpdated.emit(nodes[0].data);
          }
        }
      }
    } else {
      nodes.forEach((node) => {
        if (node.data.ID == id) {
          let alreadySelected = node.isSelected();
          if (!alreadySelected) {
            node.setSelected(true);
          }
          if (detailConfig) {
            detailConfig.options.data.detailInfo = node.data;
            let searchText = this.getTextForMark();
            detailConfig.options.externalSearchTextForMark = searchText;
            let proivder = detailConfig.options.provider;
            if (proivder.getStateForPanel() === true) {
              detailConfig.options.provider.config.options.externalSearchTextForMark = searchText;
              if (!alreadySelected) {
                detailConfig.options.onDataUpdated.emit(node.data);
              }
            }
          }
          return;
        }
      });
    }
  }

  /**
   * Set string value or translate to table overlay
   * @param text - string value
   * @param translate - boolean flag (true - to translate)
   * @param params - params for translate
   */
  setTextToOverlay(text: string, translate: boolean = false, params: Object = {}): void {
    let resText = '';
    if (translate) {
      this.moduleContext.translate.get(text, params).subscribe((res: any) => {
        resText = res;
      });
    } else {
      resText = text;
    }

    try {
      let ow = this.config.options.gridRef._nativeElement.getElementsByClassName('ag-overlay-wrapper')[0];
      if (!ow || !ow.getElementsByTagName) {
        return;
      }
      let span = ow.getElementsByTagName('span')[0];
      span.innerHTML = resText;
    } catch (e) {
      throw new Error(e);
    }
    ;
  };

  /*
   * Add or delete columns checked in the modal window
   * @param o - object containing fields:
   *   column - must be deleted or added
   *   action - what needs to be done
   */
  setTableViewModeShowColumnsParam(o): void {
    let viewModeParams = this.config.options.viewModeParams;
    switch (o.action) {
      case 'add': {
        viewModeParams.table.colsForShow.push(o.column);
        break;
      }
      case 'delete': {
        let ind = viewModeParams.table.colsForShow.indexOf(o.column);
        viewModeParams.table.colsForShow.splice(ind, 1);
        break;
      }
      case 'all': {
        viewModeParams.table.colsForShow = viewModeParams.table.colsForShow.concat(o.columns);
        break;
      }
      case 'none': {
        viewModeParams.table.colsForShow = [];
        break;
      }
      default:
        break;
    }
  }

  /**
   * Applying new view for table view mode
   * @param tableView - object with information about columns for table
   * @param tableViewSettings - object with all columns for table
   */
  setTableViewModeParams(tableView, tableViewSettings): void {
    let viewModeParams = this.config.options.viewModeParams;
    if (viewModeParams) {
      viewModeParams.table.colsForHide = Object.keys(tableViewSettings);
      viewModeParams.table.colsForShow = Object.keys(tableView);
      viewModeParams.tile.colsForHide = Object.keys(tableViewSettings);
    }

  };

  /*
   * Get current table view mode
   */
  getViewMode(): string {
    return this.config.options.viewMode;
  }

  /**
   *Set mode for displaying table as grid or tiles
   *@param mode - string value
   */
  setViewMode(mode: 'table' | 'tile'): void {
    let gridOptions = this.config.gridOptions,
      viewModeParams = this.config.options.viewModeParams;
    this.config.options.viewMode = mode;
    gridOptions.api.resetRowHeights();
    switch (mode) {
      case 'tile': {
        gridOptions.rowBuffer = 50;
        gridOptions.columnApi.setColumnsVisible(viewModeParams.tile.colsForHide, false);
        gridOptions.columnApi.setColumnsVisible(viewModeParams.tile.colsForShow, true);
        gridOptions.columnApi.setColumnsPinned(viewModeParams.tile.colsForUnpinned, null);
        gridOptions.columnApi.setColumnsPinned(viewModeParams.tile.colsForShow, 'left');
        gridOptions.columnApi.moveColumns(viewModeParams.tile.colsForShow, 0);
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

  /**
   * Refresh ag-grid scroll
   */
  refreshGridScroll() {
    if (!this.moduleContext.gridWrapper) {
      console.log (this.moduleContext);
      return
    }

    // let offset = $('.ag-row-selected').offset();
    let offset = $(this.moduleContext.gridWrapper.nativeElement).find('.ag-row-selected').offset();
    if (offset) {
      // 158 = header + search row + table header. TODO: calculate accurate
      $(this.moduleContext.gridWrapper.nativeElement).find('.ag-body-viewport').scrollTop(parseInt($('.ag-row-selected').css('top')) - (offset.top - 158));
      $(this.moduleContext.gridWrapper.nativeElement).find('.ag-body-viewport').scrollLeft(-parseInt($('.ag-header-container').css('left')))
    } else {
      $(this.moduleContext.gridWrapper.nativeElement).find('.ag-body-viewport').scrollTop(parseInt($('.ag-row-selected').css('top')))
    }
  }

  /*
   * Hide all overlays
   */
  hideOverlay() {
    this.config.gridOptions.api.hideOverlay();
  }

  /**
   * Show loading overaly
   */
  public showLoadingOverlay() {
    this.config.gridOptions.api.showLoadingOverlay();
    this.setTextToOverlay('common.loadingOoo', true, {})
  }


  /**
   * get rows by id
   * @param id
   * @returns {Observable<Subscription>}
   */
  getRowsById(id: number): Observable<Subscription> {
    return Observable.create((observer) => {
    })
  }

  onKeyPress($event) {
    switch ($event.which) {
      case 40: {  //arrow down
        break;
      }
      case 37: {  //arrow left
        break;
      }
      case 38: {  //arrow up
        break;
      }
      case 39: {  //arrow right
        break;
      }
      case 33: {  //page up
        break;
      }
      case 34: {  //page down
        break;
      }
      case 13: {//enter
        let data = this.moduleContext.getSelectedRows()[0] || {};
        this.moduleContext.router.navigate(
          [
            appRouter[this.config.options.type].detail.substr(
              0,
              appRouter[this.config.options.type].detail.lastIndexOf('/')),
            data.ID
          ]
        );
        break;
      }
      case 36: {  //home
        // let id = this.config.gridOptions.api.getModel()['rowsToDisplay'][0].data.ID;
        // this.provider.setSelectedRow(id);
        break;
      }
      case 35: {  //end
        let len = this.config.gridOptions.api.getModel()['rowsToDisplay'].length;
        let id = this.config.gridOptions.api.getModel()['rowsToDisplay'][len - 1].data.ID;
        this.setSelectedRow(id);
        this.config.gridOptions.api.setFocusedCell(id, 7);
        break;
      }
      default: {
        break;
      }
    }
  }

  setAllExpanded(e) {
    this.config.options.gridRef.api.forEachNode((node) => {
      try {
        node.setExpanded(e);
      } catch (e) {
        // debugger;
      }
    });
  }

  /*
   * get text from search string or adv for mark subtitles text
   * @returns string
   */
  getTextForMark() {
    let searchText = this.config.componentContext.searchFormProvider.getSearchString();
    if (!searchText) {
      let searchAdvancedProvider = this.moduleContext.config.componentContext.searchAdvancedProvider;
      if (searchAdvancedProvider) {
        let models = searchAdvancedProvider.getModels();
        for (var e in models) {
          if (models[e]._dbField == 'CC_TEXT') {
            searchText = models[e]._value;
          }
        }
      }
    }
    return searchText;
  }

  getLastRequestForSearch(): FinalSearchRequestType {
    return this.lastRequestForSearch;
  }

  refreshResults(): any {
    let api = this.config.gridOptions.api;
    let searchModel = this.lastSearchModel;
    let requestForSearch = this.lastRequestForSearch;
    let columns = this.config.gridOptions.columnApi.getAllColumns();
    this.config.options.service.search(
      this.config.options.type,
      searchModel,
      requestForSearch.Page,
      requestForSearch.SortField,
      requestForSearch.SortDirection
    ).subscribe(
      (resp: any) => {
        this.config.gridOptions.rowData = resp.Data;
        // debugger
        //
        let model = api.getModel();
        let rowCount = model.getRowCount();
        let rowNodes = [];
        for (let i = 0; i < rowCount; i++) {
          // rowNode.setData(resp.Data[i])
          // debugger
          rowNodes.push(model.getRow(i))
          // let rowNode = ;
          // rowNode.setSelected(true);
        }

        api.refreshCells(rowNodes, columns, true)
        // debuggerl
        // for (let i = 0; i< columns.length; i++) {
        //
        // }

      });


    // api.refreshCells
    // let api = this.config.options.gridRef.api;
    //
    // debugger
    // let rowCount = api.getDisplayedRowCount();
    // debugger
    // for (let i = 0; i < 20; i++) {
    //     let row = Math.floor(Math.random() * rowCount);
    //     let rowNode = api.getDisplayedRowAtIndex(row);
    //     let col = ['a', 'b', 'c', 'd', 'e', 'f'][i % 6];
    //     rowNode.setDataValue(col, Math.floor(Math.random() * 10000));
    // }

  }
}
