/**
 * Created by Sergey Trizna on 11.11.2017.
 */
import {ApplicationRef, ComponentFactoryResolver, ElementRef, Injector} from "@angular/core";
import {OverlayComponent} from "../../overlay/overlay";
import {SlickGridProvider} from "./providers/slick.grid.provider";
import {WorkflowSlickGridProvider} from "../../../views/workflow/providers/workflow.slick.grid.provider";
import {Select2ItemType} from "../../controls/select2/types";
import Column = Slick.Column;
import SlickData = Slick.SlickData;
import Cell = Slick.Cell;
import {SlickGridPanelInterace} from "./comps/panels/panel.interface";


export type  SlickGridElementsForResize = {
    grid: ElementRef,
    topPanel?: SlickGridPanelInterace,
    bottomPanel?: SlickGridPanelInterace
};
export type  SlickGridElementsForInit =
    SlickGridElementsForResize
    & { overlay: OverlayComponent, gridWrapper: ElementRef };
export type SlickGridInjectedContexts = {
    provider: SlickGridProvider | WorkflowSlickGridProvider;
    // componentFactoryResolver: ComponentFactoryResolver;
};
/**
 * Simple rows
 */
export type SlickGridRowData = {
    __contexts?: SlickGridInjectedContexts;
    id?: number | string;
    $id?: number;
    rank?: number;
    ID?: number
};

/**
 * Rows for tree
 */
export type SlickGridTreeRowData = SlickGridRowData & {
    parent?: number;
    indent?: number;
    collapsed?: boolean;
    collapsedMark?: boolean;
    childs?: number[];
    deepChilds?: number[];
    hidden?: boolean;
    Children?: Array<SlickGridTreeRowData>
};

export type SlickGridExpandableRowData = SlickGridRowData & {
    Tasks?: any[];
    _collapsed?: boolean;
    _sizePadding?: number;
    _isPadding?: boolean;
    _detailContent?: any;
    _height?: number;
    _expandAllMode?: boolean;
    _additionalRows?: any[]
};

/**
 * Column
 */
export type SlickGridColumn = Column<SlickData> & {
    id: number|string;
    isFrozen?: boolean;
    isCustom?:boolean;
    multiColumnSort: boolean;
    __contexts?: SlickGridInjectedContexts;
    __text_id?: 'thumbnails' | string;
    __isCustom?: boolean;
    __bindingFormat?: string;
    __col?: any;
    __deps?: {
        componentFactoryResolver: ComponentFactoryResolver,
        appRef: ApplicationRef,
        injector: Injector
        data?: any
    }
};


/**
 * Data in formatter
 */
export type SlickGridFormatterData = {
    rowNumber: number,
    cellNumber: number,
    value: any,
    columnDef: SlickGridColumn,
    data: SlickGridTreeRowData | SlickGridRowData | SlickGridExpandableRowData
};

export type SlickGridInsideExpandRowFormatterData = {
    item?: SlickGridExpandableRowData;
    provider?: any;
    // value: SlickGridTreeRowData | SlickGridRowData | SlickGridExpandableRowData
};

/**
 * Data on event
 */
export  type SlickGridEventData = {
    row: SlickGridRowData,
    cell: number,
};


export type RESTColumnSettings = {
    BindingName: string,
    TemplateName: string,
    BindingFormat: string,
    CanUserSort: boolean,
    IsExtendedField: boolean
};

export type RESTColumSetup = {
    Tag: string,
    Index: string,
    Width: number
};


export type SlickGridScrollEvent = {
    scrollLeft: number,
    scrollTop: number
};

export type SlickGridPanelData = {
    slickGridProvider: SlickGridProvider
};

export type SlickGridResp = {
    Rows: number,
    Data: any[],
    Facets?: {
        Facets: any[]
    }
};

export type SlickGridSelect2FormatterEventData = {
    data: SlickGridFormatterData,
    value: Select2ItemType
}

export type SlickGridTextFormatterEventData = {
    data: SlickGridFormatterData,
    value: string
}

export type SlickGridButtonFormatterEventData = {
    data: SlickGridFormatterData,
    value: any
}
