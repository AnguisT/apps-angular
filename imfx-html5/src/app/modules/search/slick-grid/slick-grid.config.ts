/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import {
    CoreConfig,
    CoreConfigModuleOptions,
    CoreConfigOptions,
    CoreConfigPluginOptions
} from '../../../core/core.config';
import { EventEmitter } from '@angular/core';
import { SlickGridService } from './services/slick.grid.service';
import { SlickGridProvider } from './providers/slick.grid.provider';
import { CoreSearchComponent } from '../../../core/core.search.comp';
import { SlickGridColumn } from './types';
import { SlickGridPanelInterace } from './comps/panels/panel.interface';
import { SlickGridPanelBottomComp } from './comps/panels/bottom/bottom.panel.comp';
import { SlickGridPanelTopComp } from './comps/panels/top/top.panel.comp';
import {ViewColumnsType} from "../views/types";


/**
 * Module Config
 */
export class SlickGridConfig extends CoreConfig {
    // options: SlickGridConfigOptions;
    componentContext: CoreSearchComponent | any;
    serviceType?: typeof SlickGridService;
    providerType?: typeof SlickGridProvider;
    service?: SlickGridService;
    provider?: SlickGridProvider;
    options?: SlickGridConfigOptions;

    constructor(c: SlickGridConfig) {
        super(c);
    }
}

/**
 * Module Options
 */
export class SlickGridConfigOptions extends CoreConfigOptions {
    module: SlickGridConfigModuleSetups;

    constructor(c: SlickGridConfigOptions) {
        super(c);
    }

    get viewModeSwitcher(): boolean {
        return (<SlickGridConfigModuleSetups>this.module).viewModeSwitcher;
    };

    get viewMode(): string {
        return (this.module).viewMode;
    };

    get savedSearchType(): string {
        return (<SlickGridConfigModuleSetups>this.module).savedSearchType;
    };

    get searchType(): string {
        return (<SlickGridConfigModuleSetups>this.module).searchType;
    };

    get type(): string {
        return (<SlickGridConfigModuleSetups>this.module).searchType;
    };

    get onIsThumbnails(): EventEmitter<boolean> {
        return (<SlickGridConfigModuleSetups>this.module).onIsThumbnails;
    };

    get onSelectedView(): EventEmitter<boolean> {
        return (<SlickGridConfigModuleSetups>this.module).onSelectedView;
    }

    get viewIsEmpty(): boolean {
        return (<SlickGridConfigModuleSetups>this.module).viewIsEmpty;
    }

    set viewIsEmpty(state: boolean) {
        (<SlickGridConfigModuleSetups>this.module).viewIsEmpty = state;
    }

    get tileParams(): any {
        return (<SlickGridConfigModuleSetups>this.module).tileParams;
    }
}

export class SlickGridConfigPluginSetups extends CoreConfigPluginOptions {
    enableCellNavigation?: boolean;
    enableColumnReorder?: boolean;
    rowHeight?: number;
    editable?: boolean;
    enableAddRow?: boolean;
    autoHeight?: boolean;
    headerRowHeight?: number;
    leaveSpaceForNewRows?: boolean;
    asyncEditorLoading?: boolean;
    forceFitColumns?: boolean;
    autoEdit?: boolean;
    topPanelHeight?: number;
    frozenColumn?: number;
    forceSyncScrolling?: boolean;
    suppressCleanup?: boolean;
    suppressSelection?:boolean;
    multiSelect?: boolean;
    fullWidthRows?: boolean;
    multiAutoHeight?: boolean;
}

export class SlickGridConfigModuleSetups extends CoreConfigModuleOptions {
    dragDropCellEvents?: {
        dropCell?: boolean,
        dragEnterCell?: boolean,
        dragLeaveCell?: boolean,
        dragStartCell?: boolean,
    };
    overlay?: {
        zIndex: number;
    };
    externalWrapperEl?:string;
    isThumbnails?: boolean;
    rowHeightWithThumb?: number;
    isTree?: {
        enabled?: boolean;
        startState?: 'collapsed' | 'expanded';
        expandMode?: 'allLevels' | 'firstLevel'
    };
    isExpandable?: {
        enabled?: boolean;
        startState?: 'collapsed' | 'expanded';
    };
    isDraggable?: {
        enabled?: boolean
    };
    defaultColumns: SlickGridColumn[];
    actualColumns: SlickGridColumn[];
    globalColumns: SlickGridColumn[];
    tileSource?: Array<string>;
    viewMode?: GridViewMode;
    viewModeSwitcher?: boolean;
    enableSorting?: boolean;
    clientSorting?: boolean;
    viewModeParams?: GridViewModeSetups;
    pages?: Array<any>;
    searchType?: string;
    savedSearchType?: string;
    onIsThumbnails?: EventEmitter<boolean>;
    onSelectedView?: EventEmitter<any>;
    showMediaLogger?: boolean;
    pager?: {
        enabled?: boolean;
        perPage?: number;
        _count?: number;
        _pages?: number[];
        currentPage?: number
    };
    info?: {
        enabled?: boolean;
    };
    data?: any[];
    viewIsEmpty?: boolean;
    popupsSelectors?: {
        settings: {
            'popupEl': string
        }
    };
    tileParams?: {
        tileWidth: number;
        tileHeight: number;
        isThumbnails?: boolean;
        isIcons?: boolean;
    };
    topPanel?: {
        enabled?: boolean;
        typeComponent?: any // @TODO Fix it
    };
    bottomPanel?: {
        enabled?: boolean;
        typeComponent?: any // @TODO Fix it
    };
    hasOuterFilter?: boolean;
    colNameForSetRowHeight?: string;
    search?: {
        enabled?: boolean
    };
    selectFirstRow?: boolean;
    customColorScheme?: {
        dark: SlickGridColorScheme,
        default: SlickGridColorScheme
    };
}

export class SlickGridColorScheme {
    colorbkgd?: string;
    colorbkgdmid?: string;
}

export type GridViewMode = 'table' | 'tile';
export type GridViewModeSetups = {
    'table': {
        'colsForHide': Array<any>,
        'colsForShow': Array<any>,
        'colsForPinned': Array<any>
    },
    'tile': {
        'colsForHide': Array<any>,
        'colsForShow': Array<any>,
        'colsForUnpinned': Array<any>
    }
};

