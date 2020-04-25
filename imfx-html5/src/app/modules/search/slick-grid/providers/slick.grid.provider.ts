/**
 * Created by Sergey Trizna on 29.11.2017.
 */
import {
    ApplicationRef,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Injectable,
    Injector
} from "@angular/core";
import {CoreProvider} from "../../../../core/core.provider";
import {SearchModel} from "../../grid/models/search/search";
import {SlickGridConfig, SlickGridConfigModuleSetups, SlickGridConfigPluginSetups} from "../slick-grid.config";
import {
    RESTColumnSettings,
    RESTColumSetup,
    SlickGridButtonFormatterEventData,
    SlickGridColumn,
    SlickGridElementsForInit,
    SlickGridElementsForResize,
    SlickGridEventData,
    SlickGridExpandableRowData,
    SlickGridInjectedContexts,
    SlickGridResp,
    SlickGridRowData,
    SlickGridScrollEvent,
    SlickGridSelect2FormatterEventData,
    SlickGridTextFormatterEventData,
    SlickGridTreeRowData
} from "../types";
import {Event as RouterEvent, NavigationStart, Router} from "@angular/router";
import * as _ from "lodash";
import {Guid} from "../../../../utils/imfx.guid";
import {FinalSearchRequestType} from "../../grid/types";
import {CoreSearchComponent} from "../../../../core/core.search.comp";
import {SlickGridService} from "../services/slick.grid.service";
import {OverlayComponent} from "../../../overlay/overlay";
import {RecentModel} from "../../recent/models/recent";
import {ViewsProvider} from "../../views/providers/views.provider";
import {appRouter} from "../../../../constants/appRouter";
import {SearchFormProvider} from "../../form/providers/search.form.provider";
import {TileFormatter} from "../formatters/tile/tile.formatter";
import {TranslateService} from "ng2-translate";
import {SlickGridPagerProvider} from "../comps/pager/providers/pager.slick.grid.provider";
import {SlickGridInfoProvider} from "../comps/info/providers/info.slick.grid.provider";
import ResizeObserver from 'resize-observer-polyfill';
import {DebounceProvider} from "../../../../providers/common/debounce.provider";
import {ViewColumnsType, ViewType} from "../../views/types";
import * as $ from "jquery";
import SlickData = Slick.SlickData;
import Grid = Slick.Grid;
import {CoreComp} from "../../../../core/core.comp";
import {SlickGridComponent} from "../slick-grid";

@Injectable()
export class SlickGridProvider extends CoreProvider {
    cdr?: ChangeDetectorRef;
    public _selectedRowsIds = [];
    public onRowMouseClick: EventEmitter<SlickGridEventData> = new EventEmitter();
    public onRowMouseDblClick: EventEmitter<SlickGridEventData> = new EventEmitter();
    public onRowMouseDown: EventEmitter<SlickGridEventData> = new EventEmitter();
    public onRowMouseUp: EventEmitter<SlickGridEventData> = new EventEmitter();
    public onRowDelete: EventEmitter<SlickGridEventData> = new EventEmitter();
    // only when was changed (<SlickGridRowData>).id
    public onDataUpdated: EventEmitter<SlickGridEventData> = new EventEmitter();
    public onScrollGrid: EventEmitter<SlickGridScrollEvent> = new EventEmitter();
    public onToggleViewMode: EventEmitter<string> = new EventEmitter<string>();
    public onGridRowsUpdated: EventEmitter<SlickGridResp> = new EventEmitter<SlickGridResp>();
    public onSelectRow: EventEmitter<number[]> = new EventEmitter<number[]>();
    public onSelectViewOrColumn: EventEmitter<boolean> = new EventEmitter();
    public onGridStartSearch: EventEmitter<any> = new EventEmitter();
    public onGridEndSearch: EventEmitter<any> = new EventEmitter();
    public onDropCell: EventEmitter<{ row: SlickGridRowData }> = new EventEmitter();
    public onDragEnterCell: EventEmitter<{ row: SlickGridRowData }> = new EventEmitter(); // commented
    public onDragLeaveCell: EventEmitter<{ row: SlickGridRowData }> = new EventEmitter(); // commented
    public onDragStartCell: EventEmitter<{ row: SlickGridRowData }> = new EventEmitter();
    public onGridInited: EventEmitter<any> = new EventEmitter();
    public onGetValidation: EventEmitter<any> = new EventEmitter<any>();
    // public onGridCompletedSearch: EventEmitter<boolean> = new EventEmitter();
    public _cellsNumbersToFormatter = [];
    public popupOpened?: boolean = false;
    public popupOpenedId?: number = null;
    // events of formattersaddActualColumn
    public formatterSelect2OnSelect: EventEmitter<SlickGridSelect2FormatterEventData> = new EventEmitter();
    public formatterTextOnChange: EventEmitter<SlickGridTextFormatterEventData> = new EventEmitter();
    public formatterPlayButtonOnClick: EventEmitter<SlickGridButtonFormatterEventData> = new EventEmitter();
    public formatterPlayButtonActiveId: number | string = 'none';
    public uid: string;
    public slick: any;
    public searchFormProvider?: SearchFormProvider;
    public compFactoryResolver?: ComponentFactoryResolver;
    public appRef?: ApplicationRef;
    public router?: Router;
    // public PanelProvider?: SlickGridPanelProvider;
    public PagerProvider?: SlickGridPagerProvider; //  assigned in pager.comp
    public InfoProvider?: SlickGridInfoProvider; // assigned in info.comp
    public prevRowId = null;
    public refreshTimer;
    private overlay: OverlayComponent;
    private gridEl: ElementRef;
    private gridWrapperEl: ElementRef;
    private columnsForSetTableViewMode: Array<any>;
    private originalData: any[] = [];
    private translate?: TranslateService;
    private loadingIndicator = null;
    private debounceProvider: DebounceProvider;
    private _originalView: ViewType;
    private _originalColumns: ViewColumnsType;
    private _originalExtendedColumns: string[] = [];

    constructor(public injector: Injector) {
        super(injector);
        this.uid = Guid.newGuid();

        this.router = injector.get(Router);
        this.translate = injector.get(TranslateService);
        this.debounceProvider = injector.get(DebounceProvider)

        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationStart) {
                this.hidePopups();
            }
        });
    }

    public _config: SlickGridConfig;

    get config(): SlickGridConfig {
        return (<SlickGridConfig>this._config);
    }

    set config(_config: SlickGridConfig) {
        this._config = _config;
    }

    private _lastRequestForSearch: FinalSearchRequestType;

    get lastRequestForSearch(): FinalSearchRequestType {
        return this._lastRequestForSearch;
    }

    set lastRequestForSearch(m: FinalSearchRequestType) {
        this._lastRequestForSearch = m;
    }

    private _lastSearchModel: SearchModel;

    get lastSearchModel(): SearchModel {
        return this._lastSearchModel;
    }

    set lastSearchModel(m: SearchModel) {
        this._lastSearchModel = m;
    }

    private _dataView: any;

    get dataView(): any {
        return this._dataView;
    }

    get plugin(): SlickGridConfigPluginSetups {
        return this._config.options.plugin;
    }

    get module(): SlickGridConfigModuleSetups {
        return this._config.options.module;
    }

    get componentContext(): CoreSearchComponent {
        return (<CoreSearchComponent>this._config.componentContext);
    }

    // module context
    get moduleContext(): SlickGridComponent {
        return (<SlickGridComponent>this.config.moduleContext);
    }

    get service(): SlickGridService {
        return (<SlickGridService>this._config.service);
    }

    private _isBusyGrid: boolean = false;

    get isBusyGrid(): boolean {
        return this._isBusyGrid;
    }

    set isBusyGrid(state) {
        this._isBusyGrid = state;
    }

    private _els: SlickGridElementsForInit;

    get els(): SlickGridElementsForInit {
        return this._els;
    }

    init(els: SlickGridElementsForInit, jqOld?: any) {
        let moduleOptions = this.config.options.module;
        let pluginOptions = this.config.options.plugin;
        this._els = els;
        this.overlay = els.overlay;
        this.gridEl = els.grid;
        this.gridWrapperEl = els.gridWrapper;

        let ro = new ResizeObserver(entries => {
            this.resize();
            // let f = this.debounceProvider.debounce(() => {
            //
            // }, 50);
            // f();

        });
        ro.observe(this.gridWrapperEl.nativeElement);
        // let mutationObserver = new MutationObserver(function(mutations) {
        //     mutations.forEach(function(mutation) {
        //         console.log('slick-grid', mutation);
        //     });
        // });
        //
        // mutationObserver.observe(this.gridWrapperEl.nativeElement, {
        //     attributes: true,
        //     characterData: true,
        //     childList: true,
        //     subtree: true,
        //     attributeOldValue: true,
        //     characterDataOldValue: true
        // });
        if (this.module.search.enabled === true) {
            this.searchFormProvider = this.injector.get(SearchFormProvider);
        }

        // prepare plugins
        this.implementDisableFields(jqOld);

        // data view
        this._dataView = new Slick.Data.DataView({inlineFilters: false});

        this.slick = new Slick.Grid(
            jqOld(els.grid.nativeElement),
            this.dataView,
            this.getColumns(),
            pluginOptions
        );

        // plugins
        let selModel = new (<any> Slick).RowSelectionModel();
        this.slick.setSelectionModel(selModel);

        // setTimeout(() => {
        // panels
        // if (this.module.topPanel.enabled == true || this.module.bottomPanel.enabled == true) {
        //     // panels
        //     // this.PanelProvider = this.injector.get(SlickGridPanelProvider);
        //     // this.PanelProvider.slickGridProvider = this;
        //     // this.PanelProvider.init();
        //
        //     // pager
        //     if (this.module.pager.enabled == true && this.els.bottomPanel) {
        //         // this.PagerProvider = this.els.bottomPanel.provider;
        //         // this.PagerProvider.slickGridProvider = this;
        //     }
        //
        //     // info
        //     if (this.module.info.enabled == true) {
        //         this.InfoProvider = this.injector.get(SlickGridInfoProvider);
        //         // this.InfoProvider.slickGridProvider = this;
        //     }
        // }
        // })


        if (this.getFilter) {
            this.dataView.setFilter(this.getFilter());
        }

        // init plugin
        this.slick.init(pluginOptions);

        // bind event  emitters
        this.bindCallbacks();
        // backward compatibility
        this.onRowMouseDblClick.subscribe((data: SlickGridEventData) => {
            this.onRowDoubleClicked(data)
        });
        this.onRowMouseDown.subscribe((data: SlickGridEventData) => {
            this.onRowMousedown(data)
        });
        this.onDataUpdated.subscribe((data: SlickGridEventData) => {
            this.onRowChanged(data);
        });

        // hide popup
        this.onScrollGrid.subscribe((data: SlickGridScrollEvent) => {
            this.hidePopups();
        });

        this.onGridInited.emit()
    }

    getGridEl(): ElementRef {
        return this.gridEl;
    }

    /**
     * On double click by row
     * @param data
     */
    onRowDoubleClicked(data: SlickGridEventData) {
        if (this.config.options.type) {
            let destination = this.config.options.type.replace('inside-', '').toLowerCase();
            console.log(appRouter);
            this.router.navigate([
                appRouter[destination].detail.substr(0, appRouter[destination].detail.lastIndexOf('/')),
                (<any>data.row).ID
            ]);
        }
    }

    /**
     * On mousedown
     * @param data
     */
    onRowMousedown(data: SlickGridEventData) {
        // override;
    }

    onRowChanged(data: SlickGridEventData) {
        // override
    }

    hookSearchModel(searchModel: SearchModel): SearchModel {
        return searchModel;
    }

    /**
     * Build page
     * @param searchModel
     * @param resetSearch
     */
    buildPage(searchModel: SearchModel, resetSearch: boolean = false, withOverlays: boolean = true): void {
        this.isBusyGrid = true;
        this.onGridStartSearch.emit();
        if (withOverlays) {
            this.showOverlay();
        }
        this.hidePlaceholder();

        // store model as last model of search
        let requestForSearch: FinalSearchRequestType = this.getRequestForSearch(searchModel);
        this.lastRequestForSearch = requestForSearch;
        this.lastSearchModel = searchModel;
        let page = requestForSearch.Page;
        if (resetSearch && this.module.pager.enabled == true) {
            if (this.PagerProvider) {
                if (this.PagerProvider.currentPage != 1) {
                    page = 1;
                    this.PagerProvider.setPage(page)
                }
            }
        }
        searchModel = this.hookSearchModel(searchModel);
        this.service.search(
            this.config.options.searchType,
            searchModel,
            page,
            requestForSearch.SortField,
            requestForSearch.SortDirection
        ).subscribe(
            (resp: any) => {
                this.hidePlaceholder();
                if (withOverlays) {
                    this.showOverlay();
                }
                this.afterRequestData(resp, searchModel);
                this.hideOverlay();
            }, (err) => {
                this.isBusyGrid = false;
                this.onGridEndSearch.emit(false);
                // this.searchFormProvider && this.searchFormProvider.unlockForm();
                if (err.json().Message) {
                    this.setPlaceholderText(err.json().Message, false, {});
                } else {
                    this.setPlaceholderText('common.errorUnknown', true, {})
                }
                this.clearData(true);
                this.showPlaceholder();
                this.hideOverlay();
                new Promise((resolve, reject) => {
                    resolve();
                }).then(() => {
                        this.resize()
                    }, (err) => {
                        console.log(err);
                    }
                );
            }, () => {
                this.isBusyGrid = false;
                this.onGridEndSearch.emit(true);
                // this.searchFormProvider && this.searchFormProvider.unlockForm();
            });
    };

    buildPageByData(resp) {
        // this.showOverlay();
        this.hidePlaceholder();
        this.afterRequestData(resp)
        // this.hideOverlay();
    }

    public afterRequestData(resp: SlickGridResp, searchModel?: SearchModel) {
        if (this.loadingIndicator) {
            $(this.loadingIndicator[0]).remove();
            this.loadingIndicator = null;
        }
        let cols = this.getActualColumns();
        let regularCols = cols.filter((c: SlickGridColumn) => {
            return c.id > -1
        });
        if(!regularCols.length){
            this.setPlaceholderText('slick_grid.not_have_column', true);
            this.showPlaceholder();
        }
        if (!resp.Data || resp.Data.length == 0) {
            let type = this.module.searchType;
            if (type == 'Media' || type == 'versions' || type == 'title') {
                this.setPlaceholderText('ng2_components.ag_grid.noRowsToShow', true);
                this.showPlaceholder();
            }
        }

        let respLength = resp.Rows ? resp.Rows : resp.Data.length;
        let data = this.prepareData(resp.Data, respLength);
        this.clearData(false);
        this.setData(data, true);
        // selected first row
        if (data.length > 0 && this.module.selectFirstRow == true) {
            this.setSelectedRow(0, data[0]);
        } else if (data.length == 0) {
            this.setSelectedRow(null);
        }
        this.onGridRowsUpdated.emit(resp);
        // this.resize();
        if (searchModel) {
            // Update recent searches
            let recentSearch = new RecentModel();
            recentSearch.setSearchModel(searchModel);
            recentSearch.setTotal(respLength);
            // recentSearch.setTotal(Math.floor(6666 + Math.random() * (9999 + 1 - 6666)));
            recentSearch.fillBeautyString();
            let recentSearchesProvider = this.config.componentContext.searchRecentProvider;
            if (recentSearchesProvider) {
                recentSearchesProvider.addRecentSearch(recentSearch);
            }
        }

        // fill facets
        if ((<CoreSearchComponent>this.config.componentContext)) {
            let facetsConfig = (<CoreSearchComponent>this.config.componentContext).searchFacetsConfig;
            if (facetsConfig) {
                let facets = [];
                if (resp.Facets && resp.Facets.Facets) {
                    facets = resp.Facets.Facets;
                }
                facetsConfig.options.provider.fillFacets(facets);
            }
            // ----fill facets end----
        }
        //
        // if (this.PanelProvider) {
        //     if (this.PanelProvider.isShowAdditionalTopPanel()) {
        //         this.PanelProvider.showTopPanel(true)
        //     } else {
        //         this.PanelProvider.hideTopPanel(false)
        //     }
        //
        //     if (this.PanelProvider.isShowAdditionalBottomPanel()) {
        //         this.PanelProvider.showBottomPanel(true)
        //     } else {
        //         this.PanelProvider.hideBottomPanel(false)
        //     }
        // }

        this.slick.onDragEnd.unsubscribe();

        if((<any>this.componentContext).refreshStarted) {
            this.getSlick().setSelectedRows(this.selectedRows);
        }
        (<any>this.componentContext).refreshStarted = false;
    }

    getSlick(): Grid<SlickData> {
        return this.slick;
    }

    setViewColumns(_defaultView: ViewType, _viewColumns: ViewColumnsType, customCols: SlickGridColumn[] = []) {
        this._originalView = _.cloneDeep(_defaultView);
        this._originalColumns = _.cloneDeep(_viewColumns);
        let cols: SlickGridColumn[] = [];
        let self = this;
        $.each(_viewColumns, (key, settingsForCol: RESTColumnSettings) => {
            let col: RESTColumSetup = _defaultView.ColumnData[key];
            if (col && settingsForCol) {
                // Extract columns with prop IsExtendedField == true (for search optimisation on backend)
                if (settingsForCol.IsExtendedField) {
                    this._originalExtendedColumns.push(key);
                }

                let colDef: SlickGridColumn = {
                    id: col.Index,
                    name: settingsForCol.TemplateName,
                    field: settingsForCol.BindingName,
                    width: col.Width || 150,
                    resizable: true,
                    sortable: self.module.enableSorting ? (settingsForCol.CanUserSort || self.module.clientSorting) : false,
                    multiColumnSort: settingsForCol.CanUserSort,
                    __bindingFormat: settingsForCol.BindingFormat,
                    __col: col
                };

                cols.push(colDef);
            }

        });

        cols = customCols.concat(cols);

        // thumbs
        debugger;
        this.isThumbnails(!!this._originalView.ShowThumbs);
        if (this.isThumbnails()) {
            this.module.onIsThumbnails.subscribe((state: boolean) => {
                this._originalView.ShowThumbs = state;
            });
        }


        this.setDefaultColumns(cols, [], true);
    }

    prepareAndSetGlobalColumns(_c: ViewColumnsType) {
        let gc: SlickGridColumn[] = [];
        $.each(_c, (k, o: RESTColumnSettings) => {
            let colDef = {
                id: gc.length + 1,
                name: o.TemplateName,
                field: o.BindingName,
                width: 150,
                resizable: true,
                sortable: this.module.enableSorting ? (o.CanUserSort || this.module.clientSorting) : false,
                multiColumnSort: o.CanUserSort,
                __bindingFormat: o.BindingFormat,
            };
            gc.push(<SlickGridColumn>colDef);
        });
        this.setGlobalColumns(gc);
    }

    /**
     * Set global columns (all columns available at view)
     * @param cols
     */
    setGlobalColumns(cols: SlickGridColumn[]) {
        this.module.globalColumns = cols;
    }

    /**
     * Get global columns (all columns available at view)
     * @returns {SlickGridColumn[]}
     */
    getGlobalColumns(): SlickGridColumn[] {
        return this.module.globalColumns;
    }

    /**
     * Set columns prepared to show
     * @param cols
     */
    setActualColumns(cols: SlickGridColumn[], render: boolean = false) {
        this.module.actualColumns = this.ejectColumns(this.getColumnsForEjecting(), cols);
        if (render) {
            this.applyColumns();
            this.setSelectedRows(this.getSelectedRowsIds());
        }
    }

    /**
     * Return columns from actualColumns array (prepared for insert to grid)
     * @returns {SlickGridColumn[]}
     */
    getActualColumns(): SlickGridColumn[] {
        return this.module.actualColumns;
    }

    /**
     * Add column
     * @param col
     */
    addActualColumn(col: SlickGridColumn) {
        if (!col) {
            return;
        }
        // added because when add new column, it id can duplicate
        let idxArray = this.module.actualColumns.map((el) => {
            return el.id;
        });
        let maxId = Math.max.apply(null, idxArray);

        if (col && col.id >= 0) {
            col.id = (maxId < 0) ? 1 : maxId + 1;
        }
        this.module.actualColumns.push(col);
    }

    removeActualColumn(col: SlickGridColumn) {
        this.module.actualColumns = this.ejectColumns([col], this.getActualColumns());
    }

    /**
     * Store columns of view as defaultColumns;
     * @param cols
     * @param order
     * @param apply
     */
    setDefaultColumns(cols: SlickGridColumn[] = [], order?: string[], apply: boolean = false) {
        this.module.defaultColumns = cols;
        if (apply === true) {
            this.setActualColumns(cols, apply);
        }
    }

    /**
     * Just return default columns (columns of view)
     * @returns {SlickGridColumn[]}
     */
    getDefaultColumns(): SlickGridColumn[] {
        return this.module.defaultColumns;
    }

    /**
     * Apply changes of columns at grid
     */
    applyColumns() {
        $('.overlay-indicator').remove();
        let cols = this.getActualColumns();
        let regularCols = cols.filter((c: SlickGridColumn) => {
            return c.id > -1
        });

        if(!regularCols.length){
            this.setPlaceholderText('slick_grid.not_have_column', true);
            this.showPlaceholder();
            // this.cdr.detectChanges();
            this.getSlick().setColumns([]);
            if (this.getData().length > 0) {
                this.getSlick().invalidateAllRows();
                this.getSlick().render();
            }
            this.resize();
            return;
        } else {
            this.hidePlaceholder();
        }
        cols = cols.map((e: SlickGridColumn) => {
            if (!e.__contexts) {
                e.__contexts = this.getInjectedContexts()
            }
            return e;
        });

        cols = cols.sort(function (a: SlickGridColumn, b: SlickGridColumn) {
            if (a.id < b.id)
                return -1;
            if (a.id > b.id)
                return 1;
            return 0;
        });
        // this.slick.invalidateAllRows();
        let frozenCount = -1;
        let _cols = [];
        let viewsProvider: ViewsProvider = this.injector.get(ViewsProvider);
        $.each(cols, (k, o: SlickGridColumn) => {
            if (o.isFrozen) {
                frozenCount++;
            }

            // apply formatters
            let col = o.__bindingFormat ? viewsProvider.getFormatterByFormat(o.__bindingFormat, o.__col, o) : viewsProvider.getFormatterByName(o.field, o.__col, o);
            _cols.push(col);
        });

        if (this.slick.getColumns().length === 0) {
            this.slick.setColumns(_cols);
        }
        this.slick.setOptions({'frozenColumn': frozenCount});

        this.slick.setColumns(_cols);

        if (this.getData().length > 0) {
            this.getSlick().invalidateAllRows();
            this.getSlick().render();
        }


        // to highlight selected rows in newly added columns.
        this.setSelectedRows(this.getSelectedRowsIds());

        // dont remove it. resetData need for refresh already rendered formatters for columns
        if (this.getData().length > 0) {
            this.resetData(false);
        }
        this.resize();
    }

    getFrozenColumns(cols?: SlickGridColumn[]) {
        if (!cols) {
            cols = this.getDefaultColumns();
        }
        let res = [];
        $.each(cols, (k, o: SlickGridColumn) => {
            if (typeof o.isFrozen == 'boolean') {
                res.push(o);
            }
        });
        return res;
    }

    /**
     * Return cols that need eject from grid
     * @returns {SlickGridColumn[]}
     */
    getColumnsForEjecting(): SlickGridColumn[] {
        let res: SlickGridColumn[] = [];
        // eject thumbs
        if (!this.isThumbnails()) {
            $.each(this.getDefaultColumns(), (k: number, col: SlickGridColumn) => {
                if (col && col.__text_id == 'thumbnails') {
                    res.push(col);
                    return false
                }
            })
        }

        return res
    }

    ejectColumns(ejCols: SlickGridColumn[], from?: SlickGridColumn[]) {
        if (!from) {
            from = this.getDefaultColumns();
        }

        let result: SlickGridColumn[] = from.filter((dc: SlickGridColumn) => {
            let res = true;
            $.each(ejCols, (k: number | string, c: SlickGridColumn) => {
                if (c.__isCustom == true) {
                    if (c && c.__text_id && c.__text_id == dc.__text_id) {
                        res = false;
                        return true;
                    }
                } else {
                    if (c.field == dc.field) {
                        // for simple columns
                        res = false;
                        return true;
                    }
                }
            });

            return res;
        });

        this.module.actualColumns = result;

        return result;
    }

    /**
     * Get all simple (not custom) columns
     */
    getCustomColumns(from?: SlickGridColumn[]) {
        if (!from) {
            from = this.getDefaultColumns();
        }

        return from.filter((col: SlickGridColumn) => {
            if (col.__isCustom === true) {
                return true;
            }

            return false
        })
    }

    clearAllColumns() {
        this.setGlobalColumns([]);
        this.setDefaultColumns([], [], true);
    }

    /**
     * Set or get stated of thumbnail in table;
     * @param state
     * @param render
     * @returns {boolean}
     * @TODO FIX it (need remove multicheking for component)
     */
    isThumbnails(state: boolean = null, render: boolean = false): boolean {
        let res;
        let change = state != null ? true : false;
        if (this.componentContext && this.componentContext.searchThumbsComp) {
            // hand mode
            if (state === true || state === false) {
                // change state
                this.componentContext.searchThumbsComp.enabled = state;
                this.module.isThumbnails = state;
            }

            res = this.componentContext.searchThumbsComp.enabled;

        } else if (state === true || state === false) {
            this.module.isThumbnails = state;
            res = this.module.isThumbnails;
            change = true;
        } else {
            // always on or off
            res = this.module.isThumbnails;
            change = true;
        }


        let issetTumbnails = !!this.getColumnByTextId('thumbnails', this.getActualColumns());
        if (issetTumbnails != res && change == true) {
            if (res == false) {
                this.slick.setOptions({rowHeight: this.plugin.rowHeight}, true);
            } else {
                this.slick.setOptions({rowHeight: this.module.rowHeightWithThumb}, true);
            }

            let thumbCol = this.getColumnByTextId('thumbnails');
            if (state === true) {
                if (!issetTumbnails) {
                    this.addActualColumn(thumbCol);
                }
            } else {
                if (issetTumbnails) {
                    this.removeActualColumn(thumbCol);
                }
            }
            if (render == true) {
                this.applyColumns();
                // this.resize();
                this.setSelectedRows(this.getSelectedRowsIds());
            }
            this.cdr.markForCheck();
        }

        return res;
    }

    /**
     * Get column by __text_id
     * @param textId
     * @returns {SlickGridColumn}
     */
    getColumnByTextId(textId: string, from?: any[]): SlickGridColumn {
        if (!from) {
            from = this.getDefaultColumns();
        }
        let col = from.filter((e: SlickGridColumn) => {
            return e && e.__text_id == textId ? true : false
        });

        return col[0]
    }

    /**
     * Set data
     * @param data - array of data
     * @param withRender - rewrite data
     */
    setData(data: any[], withRender: boolean = false) {
        this.module.data = data;
        this.dataView.beginUpdate();
        this.dataView.setItems(this.module.data);

        if (withRender) {
            this.dataView.endUpdate();
            this.slick.invalidateAllRows();
            this.slick.render();
            // this.slick.invalidate();
            new Promise((resolve, reject) => {
                resolve();
            }).then(() => {
                    this.resize()
                }, (err) => {
                    console.log(err);
                }
            );
        }
    }

    /**
     * Clear data
     * @param render
     */
    clearData(render: boolean = false) {
        this.setData([], render);
        this.prevRowId = null;
    }

    /**
     * Reset data of grid
     */
    resetData(showOverlay: boolean = true) {
        if (showOverlay) {
            this.showOverlay();
        }
        new Promise((resolve, reject) => {
            resolve();
        })
            .then(
                () => {
                    this.setData(this.module.data, true);
                    if (showOverlay) {
                        this.hideOverlay();
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    updateData(rowNumber: number[] | number = null, data: SlickGridRowData[] = []) {
        let _data = !data.length ? this.module.data : data;
        this.getDataView().setItems(_data);
        if (typeof rowNumber === "object") {
            this.getSlick().invalidateRows((<number[]>rowNumber))
        } else if (!isNaN(rowNumber)) {
            this.getSlick().invalidateRow((<number>rowNumber))
        } else {
            this.getSlick().invalidate();
        }

        this.getSlick().render();
    }

    update() {
        this.slick.invalidateAllRows();
        this.slick.render();
    }

    /**
     * Get data from grid
     * @returns {any[]}
     */
    getData(clear: boolean = false): SlickGridTreeRowData[] | SlickGridExpandableRowData[] {
        let res: SlickGridTreeRowData[] = [];
        if (this.slick) {
            let dv: Slick.Data.DataView<SlickData> = this.getDataView();

            res = (<SlickGridTreeRowData[]>dv.getItems());
        }

        return res;
    }

    getOriginalData(): any[] {
        return this.originalData;
    }

    /**
     * Get DataView
     */
    getDataView(): Slick.Data.DataView<SlickData> {
        return this.slick.getData();
    }

    getFilter(): Function {
        return (item: SlickGridTreeRowData) => {
            return (item.parent != null && item.collapsed == true) ? false : true;
        }
    }

    private _overlayShowed = false;
    showOverlay() {
        this._overlayShowed= true;
        setTimeout(() => {
            if(this._overlayShowed){
                this.overlay.show(this.gridEl.nativeElement);
            }
        });
    }

    hideOverlay() {
        this._overlayShowed= false;
        this.overlay.hide(this.gridEl.nativeElement);
    }

    getColumnById(id: number, from?): SlickGridColumn[] {
        if (!from) {
            from = this.getActualColumns();
        }

        return from.filter((c: SlickGridColumn) => {
            return c.id == id ? true : false
        });
    }

    /**
     * Refresh ag-grid scroll
     */
    refreshGridScroll() {
        let gridEl = $(this.gridEl.nativeElement);
        let selectedRow = gridEl.find('.slick-cell.selected')
        let offset = selectedRow.offset();
        if (offset) {
            // 158 = header + search row + table header. TODO: calculate accurate
            // parseInt(selectedRow.parent().css('top')) -
            gridEl.find('.slick-viewport-right').scrollTop(parseInt(selectedRow.parent().css('top')) - 158 - (this.plugin.rowHeight * 2));
            // gridEl.find('.slick-viewport').scrollLeft(-parseInt($('.ag-header-container').css('left')))
        } else {
            gridEl.find('.slick-viewport-right').scrollTop(parseInt(selectedRow.parent().css('top')));
            // $(this.moduleContext.gridWrapper.nativeElement).find('.ag-body-viewport').scrollTop(parseInt($('.ag-row-selected').css('top')))
        }
    }

    /**
     * Create FinalRequest from search model;
     * @param searchModel
     * @returns {FinalSearchRequestType}
     */
    getRequestForSearch(searchModel?: SearchModel): FinalSearchRequestType {
        if (!searchModel) {
            if (this.componentContext.searchFormConfig && this.module.search.enabled === true) {
                searchModel = this.injector.get(SearchFormProvider).getModel(true, false);
                // searchModel = this.componentContext.searchFormConfig.options.provider.getModel(true, false);
            } else {
                searchModel = new SearchModel();
            }
        }

        // page
        let page = this.module.pager.enabled && this.PagerProvider ? this.PagerProvider.currentPage : 1;

        // sort model
        let colId = '';
        let sort = '';
        let sortModel = this.getSlick().getSortColumns();
        if (sortModel && sortModel.length > 0) {
            let sortModelItem = sortModel[0];
            let sortColumnId = parseInt(sortModelItem.columnId);
            let sortColumn: SlickGridColumn = this.getColumnById(sortColumnId)[0];
            if (sortColumn) {
                colId = sortColumn.field;
                sort = sortModelItem.sortAsc ? 'asc' : 'desc';
            }
        }

        return this.service.getParamsForSearch(searchModel, page, colId, sort);
    }

    resize(els: SlickGridElementsForResize = null, w: number | 'full' = 'full', h: number | 'full' = 'full') {
        if (els == null) {
            els = this.els;
        }

        if (!this._config || !this.config.moduleContext) {
            return;
        }
        let _h: number;
        let _w: number;
        if (!$.isNumeric(w) || !$.isNumeric(h) || h == 0) {
            let wrapEl;
            if (this.module.externalWrapperEl) {
                wrapEl = $(this.module.externalWrapperEl);
            } else {
                wrapEl = $(this.els.gridWrapper.nativeElement);
            }
            _h = parseFloat(wrapEl.css('height'));
            _w = parseFloat(wrapEl.css('width'));
        } else {
            _h = (<number>h);
            _w = (<number>w);
        }

        // minus height of panels
        if (
            this.module.bottomPanel.enabled == true &&
            els.bottomPanel
        // els.bottomPanel.isVisible
        ) {
            _h = _h - parseFloat($(els.bottomPanel.element.nativeElement).parent().css('height'));
        }
        if (
            this.module.topPanel.enabled == true &&
            els.topPanel
        // els.topPanel.isVisible
        ) {
            _h = _h - parseFloat($(els.topPanel.element.nativeElement).parent().css('height'));
        }

        if (els.grid) {
            $(els.grid.nativeElement).css({
                'height': _h + 'px',
                'width': _w + 'px'
            });
            if (this.slick) {
                this.slick.resizeCanvas();
            }
        }

        this.updatePlaceholderPosition();
    }

    /**
     * Apply callbacks
     * @param c
     */
    applyCallbacks(c: Function) {
        if (this.slick) {
            c(this.slick, this.dataView);
        }
    }

    collapseTreeRow(item: SlickGridTreeRowData): number[] {
        return this.__triggerTreeRow(item, false)
    }

    expandTreeRow(item: SlickGridTreeRowData): number[] {
        return this.__triggerTreeRow(item, true)
    }

    expandExpandableRow(item, silent) {
        this.__triggerExpandableRow(item, true, silent)
    }

    collapseExpandableRow(item, silent) {
        this.__triggerExpandableRow(item, false, silent)
    }

    public __triggerExpandableRow(item: SlickGridExpandableRowData, stateExpanded: boolean = null, silent: boolean = false) {
        let dataView = this.getDataView();
        dataView.beginUpdate();

        if (item && item.$id != null) {
            if (stateExpanded != null) {
                item._collapsed = stateExpanded;
            }
            if (!item._collapsed) {
                item._collapsed = true;
                this.lookupDynamicContent(item);
                this.removeExpandableRows(item, item._additionalRows);
            } else {
                item._collapsed = false;
                item._additionalRows = [];
                item._detailContent = null;
                item._sizePadding = 0;
                item._height = 0;
                this.lookupDynamicContent(item);
                this.addExpandableRows(item, item._sizePadding);
            }

            if (!silent) {
                dataView.updateItem((<string>item.id), item);
            }
        }

        if (!silent) {
            dataView.endUpdate();
            this.getSlick().updateRowCount();
            this.getSlick().render();
        }
    }

    public addExpandableRows(item: SlickGridExpandableRowData, count: number, additionalId = null) {
        let dataView = this.getDataView();
        let idxParent = dataView.getIdxById((<string>item.id));
        for (let idx = 1; idx <= count; idx++) {
            let newItem: SlickGridExpandableRowData = this.getPaddingItem(item.id, idx, additionalId);
            dataView.insertItem(idxParent + idx, newItem);
            let key = item._additionalRows.indexOf(newItem.id);
            if (key == -1) {
                item._additionalRows.push(newItem.id)
            }
        }
        this.updateDetailsSize(item);
    }

    public createDetailComponent(item) {
        // overrited (see WorkflowSlickGridProvider for example)
    }

    public getPaddingItem(id: number | string, idx: number | string, additionalId = null): SlickGridExpandableRowData {
        let _newItem: SlickGridExpandableRowData = <SlickGridExpandableRowData>{};
        _newItem.id = this.getAdditionalRowId(id, idx, additionalId);
        //additional hidden padding metadata fields
        _newItem._collapsed = true;
        _newItem._isPadding = true;

        return _newItem;
    }

    public removeExpandableRows(item: SlickGridExpandableRowData, idsToRemove: any[]): void {
        let dataView = this.getDataView();
        let _idsToRemove = JSON.parse(JSON.stringify(idsToRemove));
        $.each(_idsToRemove, (k, idToRemove) => {
            if (idToRemove == undefined) {
                return true;
            }
            dataView.deleteItem(idToRemove);
            let key = item._additionalRows.indexOf(idToRemove)
            if (key > -1) {
                item._additionalRows.splice(key, 1);
            }
            console.log(idToRemove);
        });

        this.updateDetailsSize(item);
    }

    public updateDetailsSize(item: SlickGridExpandableRowData) {
        let rowHeight = this.getSlick().getOptions().rowHeight;
        item._height = (item._additionalRows.length * rowHeight);
        $(this.getGridEl().nativeElement).find('div.dynamic-cell-detail#' + item.ID).height(item._height);
    }

    public lookupDynamicContent(item: SlickGridExpandableRowData) {
        // override
    }

    setSelectedRow(rowId: number = null, eventData?, suppressDataUpdated: boolean = false) {
        if (this.plugin.suppressSelection == true) {
            return;
        }
        if (rowId == null) {
            this.getSlick().setSelectedRows([]);
            this._selectedRowsIds = [];
            this.prevRowId = null;
            if (!suppressDataUpdated) {
                this.onDataUpdated.emit(<SlickGridEventData>{
                    row: null,
                    cell: null,
                });
            }
        } else {
            this.getSlick().setSelectedRows([rowId]);
            this._selectedRowsIds = [rowId];
            if (rowId != this.prevRowId) {
                this.prevRowId = rowId;
                if (!suppressDataUpdated) {
                    // emit data updated
                    let d = this.getSelectedRowData();
                    let c = 0;
                    if (eventData) {
                        c = eventData.cell;
                    }

                    this.onDataUpdated.emit(<SlickGridEventData>{
                        row: d,
                        cell: c,
                    });

                    this.onSelectRow.emit([rowId])
                }
            }
        }

    }

    setSelectedRows(rowIds: number[]) {
        this.getSlick().setSelectedRows(rowIds);
        this._selectedRowsIds = rowIds;
        // setTimeout(() => {
        this.onSelectRow.emit(rowIds)
        // })
    }

    isSelectedRow(idx: number): boolean {
        let d = this.getSelectedRowsIds();
        let res = !!d.filter((id: number) => {
            return id == idx ? true : false;
        }).length;

        return res;
    }

    getIdsByItems(items: SlickGridRowData[]): number[] {
        let dv = this.getDataView();
        let ids = items.map((item: SlickGridRowData) => {
            return dv.getRowById(<string>item.id);
        });

        return ids;
    }

    /**
     * Return columns from grid (for internal only; instead it use method getActualColumns)
     * @returns {Array}
     */
    public getColumns(): SlickGridColumn[] {
        let columns = [];
        if (this.slick) {
            columns = this.slick.getColumns();
        }

        return columns;
    }

    public onDragRowStart($event: any) {
        // override
    }

    public onDragRowDrop($event: any) {
        // override
    }

    public onDragOver($event) {
        return event.preventDefault()
    }

    public prepareData(data: any[], count: number = null): any[] {
        this.originalData = _.cloneDeep(data);
        let resp = this.prepareSimpleData(data, count);
        if (count == null) {
            count = data.length;
        }

        if (this.module.isTree.enabled === true) {
            resp = this.prepareTreeData(data);
            this.applyCallbacksForTreeGrid();
        }
        if (this.module.isExpandable.enabled) {
            resp = this.prepareExpandableData(data, count);
            this.applyCallbacksForExpandableGrid();
        }
        if (this.module.isDraggable.enabled) {
            this.applyCallbackForDraggableGrid()
        }

        return resp
    }

    public showAdditionalPanel(): boolean {
        return false;
        // override
    }

    public createAdditionalPanel(): boolean {
        return false;
        // override
    }

    public implementAdditionalPanel(): void {
        return
    }

    public getRowsBetweenIds(start, end): any[] {
        let res = [];
        let maxVal = start > end ? start : end;
        let minVal = start > end ? end : start;
        let iteration = (maxVal - minVal) + 1;
        for (let i = 0; i < iteration; i++) {
            let row = this.getDataView().getItemByIdx(minVal + i);
            res.push(row)
        }

        return res;

        // let res = [];
        // $.each(allRows)
    }

    public getFieldsOfSelectedRows(field): any[] {
        let items = this.getSelectedRows();
        let res = items.map((c: SlickGridColumn) => {
            return c[field];
        });

        return res;
    }

    public bindDragCallbacks() {
        $(this.els.grid.nativeElement).find('.slick-cell').on('drop', function (e) {
            $(e.target).addClass('selected')
        })
        // $(this.els.grid.nativeElement).find('.slick-cell').off('drop').on('drop', (e) => {
        //     $(e.target).parent().find('slick-cell').addClass('selected');
        //     // let i = $(e.target).index();
        //     // this.getSlick().setSelectedRows([i]);
        //     // let row = this.getDataView().getItemById(i);
        //     // this.onDrop.emit({row: row});
        //     // console.log('drop', e, row)
        // });
        // $.each(cells, (k, el) => {
        //     let $el = $(el);
        //     $el.unbind('drop')
        //
        //     $el.unbind('dragenter').bind('dragenter', (e) => {
        //         $(e.target).find('slick-cell').addClass('selected');
        //     })
        //
        //     $el.unbind('dragleave').bind('dragleave', (e) => {
        //         $(e.target).find('slick-cell').removeClass('selected');
        //         this.getSlick().setSelectedRows([]);
        //     })
        //
        // });

        // $(this.els.grid.nativeElement).find('.slick-cell').unbind('dragover').bind('dragover', (e) => {
        //     this.getSlick().setSelectedRows([]);
        //     console.log('dragover', e)
        // })

    }

    public bindCallbacks() {
        let isDbl = false;
        let isMouseDown = false;
        let isShiftPressed = false;
        let firstElementShifter = null;
        let lastElementShifter = null;
        let isCtrlPressed = false;
        $(this.getGridEl().nativeElement).off('keyup keydown');
        $(this.getGridEl().nativeElement).on('keyup keydown', (e) => {
            isShiftPressed = e.shiftKey;
        });

        $(this.getGridEl().nativeElement).on('keyup keydown', (e) => {
            isCtrlPressed = e.ctrlKey;
        });
        // on sort
        this.slick.onSort.unsubscribe();
        this.slick.onSort.subscribe((e, data: {
            multiColumnSort: boolean,
            sortCol: SlickGridColumn,
            sortCols: SlickGridColumn[],
            sortAsc: boolean
        }) => {
            if (this.lastSearchModel) {
                this.buildPage(<SearchModel>this.lastSearchModel);
            }
            if (this.module.clientSorting) {
                let currentSortCol = data.sortCol;
                let isAsc = data.sortAsc;
                this.dataView.sort(function (dataRow1, dataRow2) {
                    let field = currentSortCol.field;
                    let sign = isAsc ? 1 : -1;
                    let value1 = typeof dataRow1[field] === 'string' ? dataRow1[field].toLowerCase() : dataRow1[field],
                        value2 = typeof dataRow2[field] === 'string' ? dataRow2[field].toLowerCase() : dataRow2[field];
                    let result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                    if (result !== 0) {
                        return result;
                    }
                });
                this.slick.invalidate();
                this.slick.render();
            }
        });

        // on resize columns
        this.slick.onColumnsResized.subscribe((e) => {
            let aProvCol = this.getActualColumns()
                , slickCol = this.getSlick().getColumns()
                , i;

            for (i = 0; i< aProvCol.length; i++){
                aProvCol[i].width = slickCol[i].width;
            }

            if (this.module.colNameForSetRowHeight) {
                this.setRowHeight(this.module.colNameForSetRowHeight);
            }
        });

        // on reorder columns
        this.slick.onColumnsReordered.unsubscribe();
        this.slick.onColumnsReordered.subscribe((e) => {

            // checking of existing sortColumns and save it to apply after setActualColumns
            let _sortCol = [], sortCol = this.getSlick().getSortColumns();
            for (let item of sortCol) {
                let _item = {
                    columnIndex: this.getSlick().getColumnIndex(item['columnId']),
                    sortAsc: item['sortAsc']
                };
                _sortCol.push(_item);
            }


            let cols = this.getColumns().filter((el) => {
                return el.id >= 0;
            }).map((c: SlickGridColumn, i: string & number) => {
                c.id = i;
                return c;
            });
            let resCols = this.getColumns().filter((el) => {
                return el.id < 0;
            }).concat(cols);

            // set the same sortCols as until id was redefined
            if(_sortCol.length !=0){
                cols = this.getColumns();
                for (let item of _sortCol) {
                    item['columnId'] = cols[item['columnIndex']].id;
                    delete item['columnIndex'];
                }
                this.getSlick().setSortColumns(_sortCol);
            }

            this.setActualColumns(resCols, true);
            this.setSelectedRows(this.getSelectedRowsIds());
        });


        // on select view
        if (this.module.onSelectedView.observers.length > 0) {
            $.each(this.module.onSelectedView.observers, (k, o: any) => {
                o.unsubscribe()
            })
        }
        // this.module.onSelectedView.unsubscribe();
        this.module.onSelectedView.subscribe((data) => {
            if (!data) {
                this.clearAllColumns();
                this.applyColumns();
                this.module.viewIsEmpty = true;
                let viewsProvider: ViewsProvider = this.injector.get(ViewsProvider);
                viewsProvider.deleteView();
            } else {
            }
        });

        // dbl click
        this.slick.onDblClick.unsubscribe();
        this.slick.onDblClick.subscribe((event, eventData: any) => {
            isDbl = true;
            let rowData: SlickGridRowData = this.getSlick().getDataItem(eventData.row);
            this.onRowMouseDblClick.emit(<SlickGridEventData>{
                row: rowData,
                cell: eventData.cell,
            });
        });

        // click
        this.slick.onClick.unsubscribe();
        this.slick.onClick.subscribe(_.debounce((event, eventData: any) => {
            if (isDbl) {
                isDbl = false;
                return false
            }

            let rowData: SlickGridRowData = this.getSlick().getDataItem(eventData.row);
            this.onRowMouseClick.emit(<SlickGridEventData>{
                row: rowData,
                cell: eventData.cell,
            });
        }, 200));

        // mouse down
        this.slick.onMouseDown.unsubscribe();
        switch (this.module.viewMode) {
            case 'tile': {
                this.slick.onMouseDown.subscribe((event, eventData: any) => {
                    isMouseDown = true;
                    if (isDbl) {
                        isDbl = false;
                        return false
                    }
                    // set selected
                    let el = $(event.target).closest('.slick-row');
                    let i = el.index();
                    this.setSelectedRow(i, eventData);

                    // get data by rowId
                    let rowData: SlickGridRowData = this.getSlick().getDataItem(eventData.row);

                    // emit mousedown
                    this.onRowMouseDown.emit(<SlickGridEventData>{
                        row: rowData,
                        cell: eventData.cell,
                    });
                });
                break;
            }
            default: {
                this.slick.onMouseDown.subscribe((event, eventData: any) => {
                    if (
                        $(event.target).hasClass('dd-dots') ||
                        $(event.target).parent().hasClass('dd-dots')) {
                        return;
                    }

                    isMouseDown = true;
                    if (isDbl) {
                        isDbl = false;
                        return false
                    }

                    if (!this.plugin.multiSelect) { // simple
                        // set selected
                        this.setSelectedRow(eventData.row, eventData);
                        // this.emitOnRowMouseDown(eventData);
                    } else { // multi
                        if (isShiftPressed || event.shiftKey) {// shift
                            if (firstElementShifter == null) {
                                firstElementShifter = this._selectedRowsIds.length > 0 ? this._selectedRowsIds[0] : null;
                            }
                            if (firstElementShifter === null) {
                                firstElementShifter = eventData.row;
                            } else {
                                lastElementShifter = eventData.row;
                                let selectedRows = this.getRowsBetweenIds(firstElementShifter, lastElementShifter);
                                let _selectedRowsIds = this.getIdsByItems(selectedRows);
                                this._selectedRowsIds = $.extend(this._selectedRowsIds, _selectedRowsIds);
                                this.setSelectedRows(this._selectedRowsIds);
                            }
                        } else if (isCtrlPressed || event.ctrlKey) { // ctrl
                            let lastRowId = this._selectedRowsIds.length - 1;
                            firstElementShifter = this._selectedRowsIds.length > 0 && this._selectedRowsIds[lastRowId] ? this._selectedRowsIds[lastRowId] : null;
                            let idx = this._selectedRowsIds.indexOf(eventData.row);
                            if (idx > -1) {
                                this._selectedRowsIds.splice(idx, 1);
                            } else {
                                this._selectedRowsIds.push(eventData.row);
                            }
                            this.setSelectedRows(this._selectedRowsIds);
                        } else {
                            this._selectedRowsIds = [];
                            this.setSelectedRow(eventData.row, eventData);
                            firstElementShifter = lastElementShifter = null;
                            this._selectedRowsIds.push(eventData.row);
                        }
                    }

                    this.emitOnRowMouseDown(eventData);
                });
            }
        }

        // mouse up
        this.slick.onMouseUp.unsubscribe();
        this.slick.onMouseUp.subscribe((event, eventData: any) => {
            isMouseDown = false;
            if (isDbl) {
                isDbl = false;
                return false
            }

            let rowData: SlickGridRowData = this.getSlick().getDataItem(eventData.row);
            this.onRowMouseUp.emit(<SlickGridEventData>{
                row: rowData,
                cell: eventData.cell,
            });
        });

        // on scroll
        this.slick.onScroll.unsubscribe();
        this.slick.onScroll.subscribe((event, eventData: SlickGridScrollEvent) => {
            this.onScrollGrid.emit(<SlickGridScrollEvent>eventData);
        });


        this.slick.onMouseEnter.subscribe((e) => {
            let tc = this.getThemeColors();
            let rowEls = this.getMouseHoveredRowElement(e);
            if (rowEls.frozenRowEl) {
                rowEls.frozenRowEl.css('background', tc.colorbkgdmid);
            }
            rowEls.rowEl.css('background', tc.colorbkgdmid);
            // select rows use mouse
            // if (isMouseDown && this.plugin.multiSelect === true) {
            //     let rowId = this.getSlick().getCellFromEvent(e).row;
            //     // let data = dataView.getItemByIdx(this.getSlick().getCellFromEvent(event).row-1)
            //     let idx = this._selectedRowsIds.indexOf(rowId);
            //     if (idx == -1) {
            //         this._selectedRowsIds.push(rowId);
            //     } else {
            //         this._selectedRowsIds.splice(idx, 1);
            //     }
            //
            //     this.setSelectedRows(this._selectedRowsIds);
            // }
        });

        this.slick.onMouseLeave.subscribe((e) => {
            let tc = this.getThemeColors();
            let rowEls = this.getMouseHoveredRowElement(e);
            if (rowEls.frozenRowEl) {
                // rowEls.frozenRowEl.css('background', tc.colorbkgd);
                rowEls.frozenRowEl.css('background', '');
            }
            // rowEls.rowEl.css('background', tc.colorbkgd);
            rowEls.rowEl.css('background', '');
        });

        this.getDataView().onRowsChanged.subscribe((e, args) => {
            this.slick.invalidateAllRows();
            // this.slick.render();
            // setImmediate(() => {
            //     this.resize();
            // })
        });

        $(this.gridEl.nativeElement).dblclick(($event) => {
            if ($event && $event.target && $($event.target).hasClass('slick-resizable-handle')) {
                let columntText = $($event.target).parent().text();
                let columns = this.getActualColumns().filter((c: SlickGridColumn) => {
                    return c.name == columntText;
                })
                this.autoSizeColumns(columns)
            }
            ;
        });

        if (this.module.dragDropCellEvents.dropCell) {
            this.slick.onDropCell.subscribe((e, d) => {
                let row = this.getDataView().getItemById($(e.target.parentElement).index());
                this.onDropCell.emit({row: row});
            })
        }

        if (this.module.dragDropCellEvents.dragEnterCell) {
            this.slick.onDragEnterCell.subscribe((e, d) => {
                let tagName = e.target.tagName;
                if (tagName == "SPAN") {
                    e = e.target.parentElement;
                } else {
                    e = e.target;
                }
                // debugger;
                // this.setSelectedRow(null, null, true);
                // $(e.target.parentElement).find('.slick-cell').addClass('selected');
                this.setSelectedRow($(e.parentElement).index(), null, true);
                // let row = this.getDataView().getItemById($(e.target.parentElement).index());
                // this.onDragEnterCell.emit({row: row});
            })
        }


        if (this.module.dragDropCellEvents.dragLeaveCell) {
            this.slick.onDragLeaveCell.subscribe((e, d) => {
                let tagName = e.target.tagName;
                if (tagName == "SPAN") {
                    e = e.target.parentElement;
                } else {
                    e = e.target;
                }
                // $(e.target.parentElement).find('.slick-cell').removeClass('selected');
                let row = this.getDataView().getItemById($(e.parentElement).index());
                // this.onDragLeaveCell.emit({row: row})
            })
        }

        if (this.module.dragDropCellEvents.dragStartCell) {
            this.slick.onDragStartCell.subscribe((e, d) => {
                let row = this.getDataView().getItemById($(e.target.parentElement).index());
                this.onDragStartCell.emit({row: row});
            })
        }


        // if (this.plugin.multiSelect === true) {
        //     this.applyCallbacksForMultiselectGrid();
        // }

        // this.slick.onSelectedRowsChanged.subscribe((e, eventData) => {
        //     debugger
        // })


        // this.getDataView().onRowCountChanged.subscribe(() => {
        //     this.getSlick().updateRowCount();
        //     this.getSlick().render();
        // });
        //
        // this.getDataView().onRowsChanged.subscribe((e, a) => {
        //     this.getSlick().invalidateRows(a.rows);
        //     this.getSlick().render();
        // });
    }

    /**
     * Get data of selected row
     * @returns {SlickData}
     */
    getSelectedRow(): SlickGridRowData | SlickGridTreeRowData {
        let rowIds: number[] = this.getSlick().getSelectedRows();
        if (rowIds && rowIds.length > 0) {
            return this.getDataView().getItem(rowIds[0]);
        }
    }

    /**
     * Get number of selected row
     * @returns {number}
     */
    getSelectedRowId(): number {
        let rowIds: number[] = this.getSlick().getSelectedRows();
        if (rowIds && rowIds.length > 0) {
            return rowIds[0];
        }
    }

    getSelectedRowsIds(): number[] {
        let res: number[] = [];
        if (this.getSlick()) {
            res = this.getSlick().getSelectedRows();
        }

        return res;
    }

    getSelectedRows(): SlickGridRowData[] {
        let res: SlickGridRowData[] = [];
        if (this.getSlick()) {
            let ids = this.getSlick().getSelectedRows();
            res = ids.map((id: number) => {
                return this.getDataView().getItem(id);
            })
        }

        return res;
    }

    /**
     * Get only data of row (without __providers and other trash)
     * @returns any
     */
    getSelectedRowData(): any {
        let d: SlickGridRowData | SlickGridTreeRowData = this.getSelectedRow();
        if (d) {
            delete d.__contexts;
        }

        return d;
    }

    /**
     * Autosize columns
     */
    autoSizeColumns(columns: SlickGridColumn[] = []) {
        if (!this.slick.getData().getItems().length) {
            this.slick.autosizeColumns()
        } else {
            let allColumns = this.getActualColumns();
            if (!columns.length) {
                columns = this.getActualColumns();
            }
            //Sort actual columns by ID for correct entry of values into cells
            columns = columns.sort(CompareFunc);
            allColumns = allColumns.sort(CompareFunc);

            columns = columns.filter((el)=>{return el.id>=0;})
            let maxWidthsArr = this.getArrayOfMaxWidths(columns);

            $.each(maxWidthsArr, (i: number, w: number) => {

                let col = allColumns[i];
                if (w < 10) {
                    // s = colStr;
                }

                if (w !== col.width) {
                    if (col.minWidth > w) {
                        col.width = col.minWidth;
                    } else if (col.maxWidth < w) {
                        col.width = col.maxWidth;
                    } else {
                        col.width = w;
                    }
                }
            });
            this.applyColumns();
        }

        function CompareFunc(preEl: SlickGridColumn, nextEl: SlickGridColumn): number {
            return <number>preEl.id - <number>nextEl.id;
        }
    }

    getArrayOfMaxWidths(cols: SlickGridColumn[] = []): any {
        let realPositions = [];
        if (!cols.length) {
            cols = this.getActualColumns();
        } else {
            $.each(cols, (i: number | string, column: SlickGridColumn) => {
                realPositions[i] = this.getActualColumns().map(function (c: SlickGridColumn) {
                    return c.id;
                }).indexOf(column.id);
            })
        }

        let data = this.slick.getData().getItems();
        let matrixOfSizes = {};
        $.each(cols, (colNumber, col: SlickGridColumn) => {
            let cn = realPositions[colNumber] != undefined ? realPositions[colNumber] : col.id;
            let cell = this.slick.getHeaderColumns()[cn].el;
            measuringCB(cell);

            $.each(data, (rowNumber: number) => {
                let cell = this.slick.getCellNode(rowNumber, cn);
                if (cell && cell[0]) {
                    measuringCB(cell[0]);
                }
            });

            function measuringCB(cell){
                cell.style.width = '0px';
                cell.style.display = 'block';
                let scW =  cell.scrollWidth + (cell.offsetWidth - cell.clientWidth) + 5;
                let maxSize = matrixOfSizes[cn];
                if (!maxSize || ( maxSize < scW)) {
                    matrixOfSizes[cn] =  scW;
                }
                cell.style.width = '';
                cell.style.display = '';
            }
        });

        return matrixOfSizes;
    }

    // popup
    tryOpenPopup($event) {
        if (!this.els) {
            return;
        }
        let dropdown = $(this.els.grid.nativeElement).find('.settingsButton');
        let element = $event.target;
        let target = 0;
        for (var i = 0; i < dropdown.length; i++) {
            target += $(dropdown[i]).has(element).length;
        }

        if (dropdown.length >=0){
            this.hidePopups();
        }

        if (target === 1) {
            this.openPopups($event);
            let self = this;
            let cb = function f (ev){
                self.hidePopups();
                document.removeEventListener('click', f);
            }
            $event.stopPropagation();
            document.addEventListener('click',cb);
        }
    }

    openPopups($event) {
        let btnEl = $($event.target);
        if (!this.popupOpened || (btnEl.data('rowid') != null && btnEl.data('rowid') != this.popupOpenedId)) {
            if (!this.module.popupsSelectors) {
                return;
            }
            let opts = this.module.popupsSelectors[btnEl.data('popupid')];
            if (!opts) {
                this.hidePopups();
                return false;
            }

            // let rowId = btnEl.data('rowid');
            // let model = this.config.gridOptions.api.getModel();
            // this.rowData = model.getRow(rowId - 1);
            let offset = <any>btnEl.offset();
            offset.top = offset.top + 4;
            offset.left = offset.left;


            $(opts.popupEl).css(offset);
            $(opts.popupEl).show();

            let outOfconfines = $(window).height() - $(opts.popupEl).children().height() - offset.top - 15;
            if (outOfconfines < 0) {
                offset.top = offset.top + outOfconfines;
            }
            $(opts.popupEl).css(offset);
            this.popupOpened = true;
            this.popupOpenedId = btnEl.data('rowid');
        } else {
            this.hidePopups();
        }
    }

    hidePopups() {
        this.popupOpened = false;
        this.popupOpenedId = null;
        if (!this.config.moduleContext) {
            return;
        }
        // this.rowData = null;
        $.each(this.module.popupsSelectors, (l, sel) => {
            if (sel && sel.popupEl) {
                $(sel.popupEl).hide();
            }

        });
        return;
    }

    setPlaceholderText(text: string, translate: boolean = false, params: Object = {}): void {
        let resText = '';
        if (translate) {
            this.translate.get(text, params).subscribe((res: any) => {
                resText = res;
            });
        } else {
            resText = text;
        }

        if (!this.loadingIndicator) {
            let $g = $(this.gridEl.nativeElement);
            this.loadingIndicator = $("<span class='overlay-indicator'><label>" + resText + "</label></span>").appendTo($g);
            this.updatePlaceholderPosition();
        }
    }

    public updatePlaceholderPosition() {
        if (this.loadingIndicator) {
            let $g = $(this.gridEl.nativeElement);
            this.loadingIndicator
                .css("position", "absolute")
                .css("top", $g.position().top + 60)
                .css("left", $g.position().left);
        }

    }

    public setCustomPlaceholder(el) {
        this.loadingIndicator = el;
    }

    public clearPlaceholder() {
        this.loadingIndicator = null;
    }

    hidePlaceholder() {
        if (this.loadingIndicator) {
            this.loadingIndicator.hide();
        }

    }

    showPlaceholder() {
        if (this.loadingIndicator) {
            this.resize();
            this.loadingIndicator.show();
        }
    }

    public changeColParams(field, params) {
        let col = this.slick.getColumns().filter(el => {
            return el.field == field;
        })
        if (col.length > 0) {
            for (var key in params) {
                col[0][key] = params[key];
            }
            let cols = this.getColumns().map((c: SlickGridColumn, i: string & number) => {
                c.id = i;
                return c;
            });
            this.slick.setColumns(cols);
        }
    }

    public setRowHeight(field) {
        let col = this.slick.getColumns().filter(el => {
            return el.field == field;
        })

        let maxTagsLength = 0, tagsCount = 0;
        this.slick.getData().getItems().forEach(el => {
            if (el[field].join('').length > maxTagsLength) {
                maxTagsLength = el[field].join('').length;
                tagsCount = el[field].length;
            }
        });
        let calcHeight = (30 * (Math.floor((maxTagsLength + tagsCount * 20) / col[0].width) + 2));
        this.plugin.rowHeight = calcHeight;
        this.slick.setOptions({'rowHeight': calcHeight}, true);
        // this.resetData();
        let cols = this.getColumns().map((c: SlickGridColumn, i: string & number) => {
            c.id = i;
            return c;
        });
        this.slick.setColumns(cols);

    }

    public deleteRow(data) {
        let idToRemove = data.data.rowNumber;
        let id = this.dataView.getItem(idToRemove).id;
        this.dataView.deleteItem(id);
        this.slick.invalidate();
        this.slick.render();
        // this.onRowDelete.emit(id);
        this.onRowDelete.emit(data.data.data.ID || data.data.data.customId);
    }

    private getThemeColors(): {
        colorbkgd: string;
        colorbkgdmid: string
    } {

        // toDo fix hard code
        let res;

        if (this._config.options.module.customColorScheme) {
            res = this._config.options.module.customColorScheme.dark;
        } else {
            res = {
                colorbkgd: '#34404a',
                colorbkgdmid: '#21282E'
            };
        }


        if (!$(document).find('.common-app-wrapper').hasClass('dark')) {
            if (this._config.options.module.customColorScheme) {
                res = this._config.options.module.customColorScheme.default;
            } else {
                res = {
                    colorbkgd: '#EDF1F2',
                    colorbkgdmid: '#E2E7EB'
                };
            }
        }

        return res;
    }

    private getMouseHoveredRowElement(e): {
        rowEl: any, frozenRowEl: any
    } {
        let el = $(e.currentTarget).parent();
        let i = el.index();
        let frozenEl = null;
        // if fined element is friozen column
        if (el.parent('.grid-canvas-left').length) {
            frozenEl = el;
            el = $(this.gridEl.nativeElement).find('.grid-canvas-right .slick-row').eq(i);
        }
        else {
            // find frozen
            // if (this.plugin.frozenColumn > -1) {
            frozenEl = $(this.gridEl.nativeElement).find('.grid-canvas-left .slick-row').eq(i);
            // }
        }
        return {
            rowEl: el,
            frozenRowEl: frozenEl
        }
    }

    public getAdditionalRowId(id, idx, additionalId: number | string = null) {
        return id + (additionalId != null ? '.' + additionalId : '') + "." + idx;
    }

    private getInjectedContexts() {
        return <SlickGridInjectedContexts>{
            provider: this,
        };
    }

    private __triggerTreeRow(item: SlickGridTreeRowData, collapsed): number[] {
        let changed: number[] = [];
        let dataView = this.getDataView();
        let childProp = this.module.isTree.expandMode == 'allLevels' ? 'deepChilds' : 'childs';
        let mode = this.module.isTree.expandMode;
        item.collapsedMark = collapsed;
        if (collapsed == true) {
            childProp = 'deepChilds';
        } else {
            childProp = this.module.isTree.expandMode == 'allLevels' ? 'deepChilds' : 'childs';
        }

        if (item[childProp] && item[childProp].length > 0) {
            for (let i = 0; i <= item[childProp].length; i++) {
                let child: SlickGridTreeRowData = (<SlickGridTreeRowData>dataView.getItemById(item[childProp][i]));
                if (child) {
                    child.hidden = collapsed;
                    child.collapsed = item.collapsedMark;
                    child.collapsedMark = mode == 'allLevels' ? item.collapsedMark : !item.collapsedMark;
                    // dataView.updateItem((<string>child.id), child);
                    // changed.push(<number>child.id);
                }
            }

            dataView.updateItem((<string>item.id), item);
        }

        return changed;
    }

    private applyCallbacksForTreeGrid() {
        this.applyCallbacks((slick, dataView) => {
            slick.onMouseDown.subscribe((e, args) => {
                if ($(e.target).hasClass("slickgrid-toggle-row")) {
                    let id: number = parseInt($(e.target).attr('id'));
                    let item: SlickGridTreeRowData = dataView.getItemById(id);
                    let invalidRows = [];
                    if (item.collapsedMark) {
                        this.collapseTreeRow(item);
                        // invalidRows  = item.deepChilds;
                    } else {
                        this.expandTreeRow(item);
                        // invalidRows  = item.childs;
                    }

                    invalidRows.push(id);
                    this.slick.invalidateAllRows();

                    this.slick.render();
                    this.resize();
                    e.stopImmediatePropagation();
                }
            });
        });
    }

    private applyCallbacksForExpandableGrid() {
        this.applyCallbacks((slick, dataView) => {
            slick.onClick.subscribe((e, args) => {
                if ($(e.target).hasClass('slickgrid-toggle-expandable')
                // || $(e.target).prev().hasClass('slickgrid-toggle-expandable')
                ) {
                    let item: SlickGridExpandableRowData = dataView.getItemByIdx(args.row);
                    this.__triggerExpandableRow(item);
                    e.stopImmediatePropagation();
                }
            });

            // dataView.onRowsChanged.subscribe(function (e, args) {
            //     slick.invalidateRows(args.rows);
            //     slick.render();
            // });
        });
    }

    private applyCallbackForDraggableGrid() {
        this.applyCallbacks((slick, dataView) => {
            slick.onMouseDown.subscribe((e, args) => {
                if ($(e.target).hasClass('dd-dots')) {

                    // e.stopImmediatePropagation();
                }
            });
        });

    }

    /**
     * Prepare rows
     * @param data
     */
    private prepareSimpleData(data: any[], count: number): any[] {
        let res: any[] = [];
        for (let i = 0; i <= count; i++) {
            let item: SlickGridRowData = data[i];
            if (item) {
                item.id = $.isNumeric(item.$id) ? item.$id - 1 : i;
                if (item && !item.__contexts) {
                    item.__contexts = this.getInjectedContexts()
                }
                res.push(item)
            }
        }

        return res;
    }

    private prepareExpandableData(data: any[], count: number): any[] {
        let res: any[] = [];
        for (let i = 0; i <= count; i++) {
            let item: SlickGridExpandableRowData = data[i];
            if (item) {
                item.id = $.isNumeric(item.$id) ? item.$id - 1 : i;
                // item._collapsed = this.module.isExpandable.startState == 'collapsed' ? true : false;
                item._collapsed = true;
                item._sizePadding = 0;     //the required number of padding rows
                item._height = 0;     //the actual height in pixels of the detail field
                item._isPadding = false;
                item._additionalRows = [];
                if (!item.__contexts) {
                    item.__contexts = this.getInjectedContexts()
                }
                res.push(item)
            }
        }

        return res;
    }

    /**
     * Prepare rows for tree
     * @param data
     * @returns {Array}
     */
    private prepareTreeData(data: any[]): any[] {
        let res = [];
        let parentId = null;
        let indent = 0;

        res = this.processPrepareTreeData(data, res, parentId, indent);

        return res;
    }

    /**
     * Prepare data for tree in recursion
     * @param data
     * @param treeData
     * @param parentId
     * @param indent
     * @returns {any[]}
     */
    private processPrepareTreeData(data: any[], treeData: any[], parentId: number, indent: number): any[] {
        for (let i = 0; i <= data.length; i++) {
            let row: SlickGridTreeRowData = data[i];
            if (row) {
                let collapseState = this.module.isTree.startState == 'expanded' ? false : true;
                row.collapsed = collapseState;
                row.collapsedMark = collapseState;
                row.id = $.isNumeric(row.$id) ? row.$id - 1 : i;
                row.parent = parentId;
                row.indent = indent;
                if (!row.__contexts) {
                    row.__contexts = {
                        provider: this
                    }
                }
                if (row.Children && row.Children.length > 0) {
                    let newDeepChilds = [];
                    let newChilds = [];
                    let parentRow = treeData.filter((r) => {
                        return r.id == row.parent
                    })[0];
                    parentId = row.id;
                    indent++;
                    $.each(row.Children, (k, child) => {
                        let chId = $.isNumeric(child.$id) ? child.$id - 1 : k;
                        if (parentRow) {
                            parentRow.deepChilds.push(chId);
                            newDeepChilds.push(chId);
                            newChilds.push(chId);
                        } else {
                            newDeepChilds.push(chId);
                            newChilds.push(chId);
                        }
                    });

                    row.deepChilds = Object.assign([], newDeepChilds);
                    row.childs = Object.assign([], newChilds);
                    treeData.push(row);
                    this.processPrepareTreeData(row.Children, treeData, parentId, indent);
                    indent--;
                    parentId = parentRow ? parentRow.id : null;
                } else {
                    treeData.push(row);
                }
            }
        }

        return treeData;
    }

    private implementDisableFields(jqOld) {
        let origSortable = jqOld.fn.sortable;
        jqOld.fn.sortable = function (options) {
            if (options !== null && typeof options === 'object') {
                options.cancel = '.disable-reorder';
            }
            return origSortable.apply(this, arguments);
        };
    }

    private implementItemMetadata() {
    }

    private emitOnRowMouseDown(eventData) {
        // get data by rowId
        let rowData: SlickGridRowData = this.getSlick().getDataItem(eventData.row);

        // emit mousedown
        this.onRowMouseDown.emit(<SlickGridEventData>{
            row: rowData,
            cell: eventData.cell,
        });
    }

    private getTilesFormatter() {
        let columns = [];
        columns.push({
            id: 'tile-view',
            name: 'Tiles',
            formatter: TileFormatter,
            cssClass: 'tile-cell',
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
            },
            source: this.config.options.module.tileSource,
            isThumbnails: this.config.options.module.tileParams.isThumbnails,
            isIcons: this.config.options.module.tileParams.isIcons
        });
        return columns;
    }

    /**
     *Set mode for displaying table as grid or tiles
     *@param mode - string value
     */
    private setViewMode(mode: 'table' | 'tile') {
        if (this.module.viewMode == mode)
            return;

        this.module.viewMode = mode;
        switch (mode) {
            case 'tile': {
                this.columnsForSetTableViewMode = this.getActualColumns();
                let columns = this.getTilesFormatter();
                for (let e in columns) {
                    if (!columns[e].__contexts) {
                        columns[e].__contexts = this.getInjectedContexts();
                    }
                }
                let gridWrapperWidth = $('#' + this.uid).width();
                let tileParams = this.module.tileParams;
                let rowHeight = Math.round(this.module.pager.perPage / Math.floor(gridWrapperWidth / tileParams.tileWidth)) * tileParams.tileHeight / this.module.pager.perPage + 10;

                this.slick.setOptions({'autoHeight': true, 'rowHeight': rowHeight, frozenColumn: -1, 'tileMode': true});
                this.slick.setColumns(columns);
                this.update();
                this.setSelectedRows(this.getSelectedRowsIds());
                this.bindCallbacks();
                let self = this;
                // $(window).resize(function () {
                //     // let rowHeight = Math.round(self.totalPageRows / Math.floor($('#' + self.uid).width() / self.tileWidth)) * self.tileHeight / self.totalPageRows + 10;
                //     // self.slick.setOptions({rowHeight: rowHeight});
                //
                // });
                break;
            }
            case 'table': {
                this.slick.setOptions({'autoHeight': false, 'tileMode': false});
                let thumbEnabled = !!(this.componentContext.searchThumbsComp && this.componentContext.searchThumbsComp.enabled);
                if (!thumbEnabled) {
                    this.slick.setOptions({rowHeight: this.plugin.rowHeight}, true);
                } else {
                    this.slick.setOptions({rowHeight: this.module.rowHeightWithThumb}, true);
                }

                this.setActualColumns(this.columnsForSetTableViewMode, true)
                this.columnsForSetTableViewMode = [];
                this.applyColumns();
                this.setSelectedRows(this.getSelectedRowsIds());
                this.bindCallbacks();
                break;
            }
            default: {
                break;
            }
        }
        this.onToggleViewMode.emit(this.module.viewMode);
    }

    ngOnDestroy() {
        if(this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
    }

    public doRefresh() {
        if(this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        if((<any>this.componentContext).refreshOn) {
            this.refreshTimer = setInterval(() => {
                this.refreshGrid();
            }, 5000);
        }
    }

    selectedRows;
    refreshGrid() {
        if (this.lastSearchModel) {
            this.selectedRows = this.getSlick().getSelectedRows();
            this.buildPage(this.lastSearchModel, false, false);
            this.getSlick().render();
            (<any>this.componentContext).refreshStarted = true;
        }
    }
    /**
     * Show loading overlay
     */
// public showLoadingOverlay() {
//     this.config.gridOptions.api.showLoadingOverlay();
//     this.setPlaceholderText('', true, {})
// }
}


