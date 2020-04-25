import * as $ from "jquery";
// require('./libs/mousewheel/jquery.mousewheel.js');
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {GridConfig, TableOptions} from "./grid.config";
import {GridService, GridServiceInterface} from "./services/grid.service";

import {Router} from "@angular/router";
import {GridOptions} from "ag-grid/main";

import {TranslateService} from "ng2-translate";
import {I18NTable} from "../../../services/i18n/table/i18n.table";
import {GridProvider} from "./providers/grid.provider";
import {IMFXGrid} from "../../controls/grid/grid";

//
// var AgGridJs = require('ag-grid/dist/ag-grid.min.js');
@Component({
    selector: 'search-grid',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        '../../styles/index.scss', //common styles
        'styles/index.scss'
    ],
    host: {
        '(document:click)': 'onDocumentClick($event)',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        GridService,
        GridProvider,
        I18NTable,
    ],
    entryComponents: [
        IMFXGrid
    ]
})

export class SearchGridComponent {
    @ViewChild('grid') public gridRef: ElementRef;
    @ViewChild('gridWrapper') public gridWrapper: ElementRef;
    @Output() public onDataUpdated: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onSortChangedEvent: EventEmitter<any> = new EventEmitter<any>();
    public moduleContext; // fix for ide
    public rowData; // data from node for popup
    public config = <GridConfig>{
        gridOptions: {
            layoutInterval: -1,
            headerHeight: 50,
            paginationPageSize: 50,
            suppressPaginationPanel: true,
            onPaginationPageLoaded: this.onPaginationPageLoaded,
            enableColResize: true,
            enableServerSideSorting: true,
            toolPanelSuppressRowGroups: true,
            toolPanelSuppressValues: true,
            animateRows: false,
            localeText: {},
            onRowDoubleClicked: this.onRowDoubleClicked,
            onCellFocused: this.onCellFocused,
            onSortChanged: () => {
                this.onSortChanged(this)
            },
            getRowHeight: this.getRowHeight,
            onColumnResized: this.onColumnResized,
            moduleContext: this, // context of current module
            rowSelection: 'single',
            rowModelType: 'pagination',
            icons: {
                sortAscending: '<i class="icons-up icon"></i>',
                sortDescending: '<i class="icons-down icon"></i>',
                groupExpanded: '<i class="icons-down icon"></i>',
                groupContracted: '<i class="icons-right icon"></i>'
            },
            onColumnMoved: this.onColumnMoved,
            onColumnPinned: this.onColumnPinned
        },
        gridOptionsEmitter: new EventEmitter<GridOptions>(),
        options: <TableOptions>{
            scrollTop: 0,
            scrollLeft: 0,
            type: '',
            service: <GridServiceInterface>null,
            isThumbnails: false,
            viewMode: 'table',
            viewModeSwitcher: true,
            onSelectedCloumnInModal: new EventEmitter<any>(),
            viewIsEmpty: false,
            pages: [],
        },
    };
    private scrollPinnedInterval;

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    constructor(public cdr: ChangeDetectorRef,
                public router: Router,
                @Inject(GridService) public service: GridService,
                @Inject(GridProvider) public provider: GridProvider,
                @Inject(I18NTable) public i18nTable: I18NTable,
                @Inject(TranslateService) public translate: TranslateService,) {
        this.config.gridOptions.localeText = this.i18nTable.getTranslate();

        // console.log(AgGridJs);
        // debugger
        // AgGridJs.GridPanel.prototype.genericMouseWheelListener = function (event) {
        //     debugger;
        // }
        // debugger

        // $('ag-body-viewport').bind('mousewheel', GridPanel.prototype.genericMouseWheelListener())
        // GridPanel.prototype.addMouseWheelEventListeners = function (event, targetPanel) {
        //     debugger
        // }
    }

    ngOnInit() {
        // Set default provider/services if custom is null
        !this.config.options.provider ?
            this.config.options.provider = this.provider :
            this.provider = this.config.options.provider;

        !this.config.options.service ?
            this.config.options.service = this.service :
            this.service = this.config.options.service;

        // Set context of current module to provider
        this.config.options.provider.moduleContext = this.provider.moduleContext =  this;

        // Enable tree mode for table
        if (this.config.options.isTree) {
            this.initTreeMode();
        }

        if (this.provider.onSetColumns) {
            // On set new columns
            this.provider.onSetColumns.subscribe(
                (columns) => {
                    this.config.gridOptions.api.setColumnDefs(columns.columns);
                    this.config.gridOptions.columnApi.moveColumns(columns.order, 0);
                    this.cdr.detectChanges();
                }
            );
        }


        if (this.provider.onIsThumbnails) {
            // On enabled/disabled thumbnails
            this.provider.onIsThumbnails.subscribe(
                (isEnabled) => {
                    this.onToggleThumbnails(isEnabled);
                }
            )
        }


        // On select view
        if (this.config.options.onSelectedView) {
            this.config.options.onSelectedView.subscribe(
                (data) => {
                    if (!data) {
                        this.setEmptyView();
                    }
                    else {
                        this.setTableViewModeParams(data);
                    }
                }
            );
        }

        // On select columns in modal window
        if (this.config.options.onSelectedCloumnInModal && this.config.options.viewModeSwitcher) {
            this.config.options.onSelectedCloumnInModal.subscribe(
                (data) => {
                    this.setTableViewModeShowColumnsParam(data);
                }
            );
        }

    }

    ngAfterViewInit() {
        // ref to ag-grid api after view show
        this.config.options.gridRef = this.gridRef;

        // Set config after view init
        this.provider.config = this.config;
        let self = this;
        // $.each(this.config.options.popupsSelectors, (l, sel) => {
        //   if (sel && sel.popupEl) {
        //     $(sel.popupEl).on('mouseleave',function(){self.hidePopups();});
        //   }
        // });
        //
        setTimeout(() => {
            if (/MSIE 10/i.test(navigator.userAgent)) {
                // This is internet explorer 10
            }

            if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
                // This is internet explorer 9 or 11
                console.log("Scroll for IE");
                this.initScrollPinnedInterval()
            }

            if (/Edge\/\d./i.test(navigator.userAgent)) {
                // This is Microsoft Edge
            }
        })
    }

    initScrollPinnedInterval() {
        let $viewport = $(this.gridWrapper.nativeElement).find(".ag-body-viewport");
        var compRef = this;
        $viewport.scroll(() => {
            clearInterval(compRef.scrollPinnedInterval)
            compRef.scrollPinnedInterval = setInterval(() => {
                $(this.gridRef.nativeElement).find(".ag-pinned-left-cols-container").css("top", -$viewport.scrollTop());
            }, 17)
            setTimeout(() => {
                clearInterval(compRef.scrollPinnedInterval)
            }, 1000)
        });
    }

    // TODO To config
    private viewModeParams = {
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
    }

    /**
     * Init table in tree mode
     */
    private initTreeMode() {
        let self = this;
        this.config.gridOptions.getNodeChildDetails = function (data) {
            if (data.Children && data.Children.length > 0) {
                return {
                    group: true,
                    children: data.Children,
                    field: '_tree',
                    expanded: data.expanded ? data.expanded : self.config.options.expandedGroup ? self.config.options.expandedGroup : false,//,
                    // key: null, // hidding in css
                };
            } else {
                return data;
            }
        };
    }

    /*
     * On Sort Changed
     */
    private onSortChanged(context) {
        context.onSortChangedEvent.emit();
    }

    /**
     * On ready table
     */
    private onReady($event) {
        this.config.gridOptions.api = $event.api;
        this.config.gridOptions.columnApi = $event.columnApi;
        this.config.gridOptions.api.setDatasource({
            getRows: (params) => {
                params.successCallback([], 0);
            }
        });
    };

    /**
     * On update table data
     */
    private onUpdate() {
        this.config.gridOptions.api.ensureIndexVisible(0);
        this.onDataUpdated.emit();
    }

    /**
     * Height of rows
     * @param params
     * @returns {number}
     */
    private getRowHeight(params) {
        // get current module
        let self = this.moduleContext;
        let columns = self.config.gridOptions.api.columnController.allDisplayedColumns;

        var titleColWidth;
        var calcLength;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].colId == "TITLE") {
                titleColWidth = columns[i].actualWidth;
            }
        }
        var resultHeight = self.config.options.rowHeight ? self.config.options.rowHeight : 48;
        if (params.data.TITLE && titleColWidth) {
            calcLength = ((self.config.options.rowHeight ? self.config.options.rowHeight : 48) * (Math.floor(params.data.TITLE.length * 5 / titleColWidth) + 1));
        }
        if (params.node.flower) {
            resultHeight = 25;
        } else if (self.config.options.isThumbnails && self.config.options.viewMode == 'table') {
            resultHeight = 100;
            if (titleColWidth && calcLength) {
                if (params.data.TITLE && calcLength > 100) {
                    resultHeight = calcLength;
                }
            }
        } else if (params.node.level == 0 && self.config.options.firstLevelHeight) {
            resultHeight = self.config.options.firstLevelHeight
        } else {
            // if(titleColWidth) {
            //   if(params.data.TITLE && calcLength > 28) {
            //     resultHeight = calcLength;
            //   } else {
            //     resultHeight = 28;
            //   }
            // }
            resultHeight = self.config.options.rowHeight ? self.config.options.rowHeight : 48;
        }
        // get height of row
        return resultHeight;
    }

    /**
     * On toggle thumbnails
     * @param isEnabled - enabled or disabled thumbs
     */
    private onToggleThumbnails(isEnabled: boolean) {
        let gridOptions = this.config.gridOptions;
        this.config.options.isThumbnails = isEnabled;
        gridOptions.columnApi.setColumnVisible('THUMBURL', isEnabled);
        gridOptions.api.onGroupExpandedOrCollapsed();
        gridOptions.api.resetRowHeights();
    }

    /**
     * Return selected rows of table
     * @returns {any[]}
     */
    getSelectedRows(): any[] {
        return this.config.gridOptions.api.getSelectedRows();
    };

    /**
     * on mouse down by row
     * @param $event
     */
    private onRowMousedown($event) {
        //this.config.options.provider.onRowMousedown($event);
    }

    /**
     * On double click by row redirecting to detail page
     */
    private onRowDoubleClicked($event): void {
        this.moduleContext.provider.onRowDoubleClicked($event)
    }

    private onCellFocused($event): void {
        this.moduleContext.provider.onCellFocused($event);
    }

    private onColumnMoved($event): void {
        this.moduleContext.provider.onColumnMoved($event);
    }

    private onColumnPinned($event): void {
      this.moduleContext.provider.onColumnPinned($event);
    }

    /**
     * Set mode for displaying table as grid or tiles
     * @param mode - string value
     */
    private setViewMode(mode: 'table' | 'tile') {
        this.config.options.provider.setViewMode(mode);
    };

    private getViewMode() {
        return this.config.options.provider.getViewMode();
    }

    private setTableViewModeParams(data): void {
        this.cdr.reattach();
        this.config.options.viewIsEmpty = false;
        this.config.options.provider.setTableViewModeParams(data.tableView, data.tableViewSettings);
    };

    private setTableViewModeShowColumnsParam(data): void {
        this.config.options.provider.setTableViewModeShowColumnsParam(data);
    };

    private setEmptyView(): void {
        // this.cdr.reattach();
        this.config.options.provider.hideOverlay();
        this.config.options.viewIsEmpty = true;
        this.cdr.detectChanges();
    }

    /**
     * On key press
     * @param $event
     */
    onKeyPress($event): void {
        this.provider.onKeyPress($event)
    }

    private myResizing = false;

    onColumnResized($event): void {
        if ($event.column && $event.column.gridOptionsWrapper.gridOptions && !this.myResizing) {
            this.myResizing = true;
            $event.column.gridOptionsWrapper.gridOptions.api.resetRowHeights();
            this.myResizing = false;
        }
    }

    onDocumentClick($event) {
        let dropdown = $('.settingsButton');
        let element = $event.target;
        let target = 0;
        for (var i = 0; i < dropdown.length; i++) {
            target += $(dropdown[i]).has(element).length;
            if (target === 0) {
                this.hidePopups();
            }
        }
        if (target === 1) {
            this.openPopups($event);
        }
    }

    onBodyScroll() {
        this.hidePopups();
    }

    private popupOpened = false;
    private popupOpenedId = null;

    private openPopups($event) {
        let btnEl = $($event.target);
        if (!this.popupOpened || (btnEl.data('rowid') != null && btnEl.data('rowid') != this.popupOpenedId)) {
            if (!this.config.options.popupsSelectors) {
                return;
            }
            let opts = this.config.options.popupsSelectors[btnEl.data('popupid')];
            if (!opts) {
                this.hidePopups();
                return false;
            }

            let rowId = btnEl.data('rowid');
            let model = this.config.gridOptions.api.getModel();
            this.rowData = model.getRow(rowId - 1);
            let offset = <any>btnEl.offset();
            offset.top = offset.top + 4;
            offset.left = offset.left;
            $(opts.popupEl).css(offset);
            $(opts.popupEl).show();

            this.popupOpened = true;
            this.popupOpenedId = btnEl.data('rowid');
        } else {
            this.hidePopups();
        }
    }

    private hidePopups() {
        this.popupOpened = false;
        this.popupOpenedId = null;
        this.rowData = null;
        $.each(this.config.options.popupsSelectors, (l, sel) => {
            if (sel && sel.popupEl) {
                $(sel.popupEl).hide();
            }

        });
        return;
    }

    //------------------PAGINATION------------------------------
    private setLastButtonDisabled() {
        if (!this.config.gridOptions.api) {
            return;
        }
        if (this.config.gridOptions.api.paginationGetCurrentPage() + 1 == this.config.gridOptions.api.paginationGetTotalPages()) {
            return true;
        }
        return false;
    }

    private setFirstButtonDisabled() {
        if (!this.config.gridOptions.api) {
            return;
        }
        if (this.config.gridOptions.api.paginationGetCurrentPage() == 0) {
            return true;
        }
        return false;
    }

    private onPaginationPageLoaded() {
        this.moduleContext.paginationPageLoaded();
    }

    private paginationPageLoaded() {
        if (!this.config.gridOptions.api) {
            return;
        }
        let gridApi = this.config.gridOptions.api;
        if (this.gridWrapper.nativeElement.querySelector('#firstRecord')) {
            this.gridWrapper.nativeElement.querySelector('#firstRecord').innerHTML = gridApi.paginationGetPageSize() * gridApi.paginationGetCurrentPage() + 1 + '';
        }
        let lastRecordOnPage = gridApi.paginationGetPageSize() * gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize();
        if (lastRecordOnPage > gridApi.paginationGetRowCount()) {
            lastRecordOnPage = gridApi.paginationGetRowCount();
        }
        if (this.gridWrapper.nativeElement.querySelector('#lastRecord')) {
            this.gridWrapper.nativeElement.querySelector('#lastRecord').innerHTML = lastRecordOnPage + '';
        }
        if (this.gridWrapper.nativeElement.querySelector('#totalRecords')) {
            this.gridWrapper.nativeElement.querySelector('#totalRecords').innerHTML = gridApi.paginationGetRowCount() + '';
        }

        if (gridApi.paginationGetTotalPages() <= 5) {
            this.config.options.pages = [];
            for (var i = 0; i < gridApi.paginationGetTotalPages(); i++) {
                this.config.options.pages.push(i + 1);
            }
        }
        else {
            this.config.options.pages = [];
            if (gridApi.paginationGetCurrentPage() >= 2 && gridApi.paginationGetCurrentPage() < (gridApi.paginationGetTotalPages() - 2)) {
                let curPage = gridApi.paginationGetCurrentPage() + 1;
                this.config.options.pages = [curPage - 2, curPage - 1, curPage, curPage + 1, curPage + 2];
            }
            else {
                if (gridApi.paginationGetCurrentPage() < 2) {
                    let curPage = gridApi.paginationGetCurrentPage() + 1;
                    for (var i = 0; i < 5; i++) {
                        this.config.options.pages.push(i + 1);
                    }
                }
                if (gridApi.paginationGetCurrentPage() >= (gridApi.paginationGetTotalPages() - 2)) {
                    let totPage = gridApi.paginationGetTotalPages();
                    for (var i = 4; i >= 0; i--) {
                        this.config.options.pages.push(totPage - i);
                    }
                }
            }
        }
    }

    private onBtFirst() {
        this.config.gridOptions.api.paginationGoToFirstPage();
    }

    private onBtLast() {
        this.config.gridOptions.api.paginationGoToLastPage();
    }

    private onBtNext() {
        this.config.gridOptions.api.paginationGoToNextPage();
    }

    private onBtPrevious() {
        this.config.gridOptions.api.paginationGoToPreviousPage();
    }

    private getCurrentPage() {
        return this.config.gridOptions.api && this.config.gridOptions.api.paginationGetCurrentPage() + 1;
    }

    private goToPage(e, n) {
        e.preventDefault();
        this.config.gridOptions.api.paginationGoToPage(n - 1);
    }

    private getTotalPage() {
        return this.config.gridOptions.api && this.config.gridOptions.api.paginationGetTotalPages();
    }

    private paginationVisible() {
        return this.config.gridOptions.paginationPageSize != -1 && this.config.gridOptions.api && this.config.gridOptions.api.getModel()['rowsToDisplay'] && this.config.gridOptions.api.getModel()['rowsToDisplay'].length > 0;
    }

    //------------------PAGINATION-END--------------------------
}
