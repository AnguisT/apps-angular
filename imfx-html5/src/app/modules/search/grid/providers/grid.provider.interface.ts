import {GridConfig} from "../grid.config";
import {FinalSearchRequestType} from "../types";
import {EventEmitter} from "@angular/core";
import {SearchModel} from "../models/search/search";
import {Observable} from "rxjs/Observable";
import {TranslateService} from "ng2-translate";
import {Subscription} from "rxjs/Subscription";
/**
 * Created by Sergey Trizna on 11.11.2017.
 */
export interface GridProviderInterface {
    /**
     * Config of module
     */
    config: GridConfig;

    /**
     * Context of GridModule
     */
    moduleContext: any;

    /**
     * Last request for search
     */
    lastRequestForSearch: FinalSearchRequestType;

    /**
     * Last search model
     */
    lastSearchModel: SearchModel;

    /**
     * On select new view
     * @type {EventEmitter<any>}
     */
    onSetColumns: EventEmitter<Array<Object>>;

    /**
     * On enabled or disable thumbnails
     * @type {EventEmitter<any>}
     */
    onIsThumbnails: EventEmitter<boolean>;

    /**
     * On toggle title or table view
     * @type {EventEmitter<string>}
     */
    onToggleView: EventEmitter<string>

    /**
     * Set columns
     * @param columns
     */
    setColumns(view);

    /**
     * Build page use SearchModel
     * @param search
     */
    buildPage(search: SearchModel): void;

    /**
     * Just build empty page
     */
    buildEmptyPage(cb?): void;

    /**
     * On mouse down event
     * @param e
     */
    onRowMousedown(node: any): void;

    /**
     * On double click by row
     * @param e
     */
    onRowDoubleClicked(e: any): void;

    onCellFocused(e: any): void;

    onColumnMoved($event): any;
    onColumnPinned($event): any;
    /**
     * Set any custom overlay to table
     * @param text - string of text
     * @param translate - use or no translate service
     * @param params - parameters for translate
     */
    setTextToOverlay(text: string, translate: boolean, params: Object): void;

    /**
     * Set selected row by id
     * @param id
     */
    setSelectedRow(id: number | 'first'): void

    /*
     * Get current table view mode
     */
    getViewMode(): string;

    /**
     * Set mode for displaying table as grid or tiles
     * @param mode - string value
     */
    setViewMode(mode): void;

    /**
     * Applying new view for table view mode
     * @param tableView - object with information about columns for table
     * @param tableViewSettings - object with all columns for table
     */
    setTableViewModeParams(tableView, tableViewSettings): void;

    /*
     * Add or delete columns checked in the modal window
     * @param o - object containing fields:
     *   column - must be deleted or added
     *   action - what needs to be done
     */
    setTableViewModeShowColumnsParam(o): void;

    /**
     * Refresh ag-grid scroll
     */
    refreshGridScroll(): void;

    /*
     * Hide all overlays
     */
    hideOverlay(): void;
    getRowsById(id: number): Observable<Subscription>;

    getLoadingOverlay(): string;

    onKeyPress($event);

    translate: TranslateService;

    /*
     * Expand or collapse all rows
     */
    setAllExpanded(e: boolean): void;

    /*
     * get text from search string or adv for mark subtitles text
     * @returns string
     */
    getTextForMark(): string;

    getRequestForSearch(searchModel?: SearchModel): any;

    showLoadingOverlay(): void;

    getLastRequestForSearch(): FinalSearchRequestType;

    refreshResults(): any;
}
