/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {GridOptions} from 'ag-grid/main';
import {EventEmitter, ElementRef} from '@angular/core';
import {GridServiceInterface} from './services/grid.service';
import {GridProviderInterface} from "./providers/grid.provider.interface";
export class TableOptions {
    /**
     * Scroll top position
     * @type {number}
     */
    scrollTop?: number = 0;

    /**
     * Scroll left position
     * @type {number}
     */
    scrollLeft?: number = 0;

    /**
     * Service for grid
     */
    service?: GridServiceInterface;

    /**
     * Service for provider
     */
    provider?: GridProviderInterface;

    /**
     * String of type for rest url
     * @type {any}
     */
    type?: string;

    /**
     * Search type for rest url;
     */
    searchType?: string;

    /**
     * Enable or disable thumbnails
     * @type {boolean}
     */
    isThumbnails?: boolean;

    /**
     * Ref to ag-grid api
     */
    gridRef?: any;

    /**
     * Tree mode for table
     */
    isTree?:boolean;

    /**
     * If current view is empty
     */
    viewIsEmpty?:boolean;

    /**
     * View mode
     */
    viewMode?:'table'|'tile';

    /**
     * Enabled or disabled view mode switcher
     */
    viewModeSwitcher?: boolean;

    /**
     * Params for display table/tiles
     */
    viewModeParams?: any;

    onSelectedView?: EventEmitter<any>;

    onSelectedCloumnInModal?: EventEmitter<any>;

    popupsSelectors?: any;
    pages?: Array<number>;
    expandedGroup?: boolean;
    selectedRowDataId?: number;

}
export class GridConfig {
    /**
     * Context of top component
     */
    public componentContext?: any;

    /**
     * Grid options
     */
    public gridOptions: GridOptions = <GridOptions> {
      layoutInterval: -1
    };

    /**
     * Model of Table
     * @type {{}}
     */
    public options: TableOptions = {
        service: <GridServiceInterface>null,
        provider: <GridProviderInterface>null,
        isThumbnails: false,
        isTree: false,
        viewMode: 'table',
        viewModeSwitcher: true,
        viewModeParams: {
            'table': {
                'colsForHide': [],
                'colsForShow': [],
                'colsForPinned': []
            },
            'tile': {
                'colsForHide': [],
                'colsForShow': [],
                'colsForUnpinned': []
            }
        },
        popupsSelectors: {},
        pages: []
    };
}
