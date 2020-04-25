/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import * as $ from "jquery";
import {ApplicationRef, ComponentFactoryResolver, EventEmitter, Injectable, Injector} from "@angular/core";
import {ViewsConfig} from "../views.config";

import {AgRendererComponent} from "ag-grid-ng2";
import {StatusColumnComponent} from "../../grid/comps/columns/status/status";
import {SlickGridProvider} from "../../slick-grid/providers/slick.grid.provider";
import {SlickGridColumn} from "../../slick-grid/types";
import {DatetimeFormatter} from "../../slick-grid/formatters/datetime/datetime.formatter";
import {ViewsService} from "../services/views.service";
import {IMFXModalComponent} from "../../../imfx-modal/imfx-modal";
import {IMFXModalProvider} from "../../../imfx-modal/proivders/provider";
import {SearchColumnsComponent} from "../../columns/search.columns";
import {
    CurrentViewsStateType,
    SaveViewValidateResult,
    UserViewsOriginalType,
    ViewColumnsType,
    ViewSaveResp,
    ViewsOriginalType,
    ViewType
} from "../types";
import {IMFXControlsSelect2Component} from "../../../controls/select2/imfx.select2";
import {Select2ListTypes} from "../../../controls/select2/types";
import {IMFXModalEvent} from "../../../imfx-modal/types";
import {SlickGridComponent} from "../../slick-grid/slick-grid";
import {IMFXModalPromptComponent} from "../../../imfx-modal/comps/prompt/prompt";
import {Observable} from "rxjs/Observable";
import {IMFXModalAlertComponent} from "../../../imfx-modal/comps/alert/alert";
import {ReturnRequestStateType} from "../../../../views/base/types";


@Injectable()
export class ViewsProvider {
    config: ViewsConfig;
    ui: IMFXControlsSelect2Component;
    service: ViewsService;
    modalProvider: IMFXModalProvider;
    onChangeViewState: EventEmitter<CurrentViewsStateType> = new EventEmitter<CurrentViewsStateType>();
    private lastSelectedView: ViewType;

    constructor(public compFactoryResolver: ComponentFactoryResolver,
                public appRef: ApplicationRef,
                public injector: Injector) {
        this.service = this.injector.get(ViewsService);
        this.modalProvider = this.injector.get(IMFXModalProvider);
    }

    private _originalViews: ViewsOriginalType = null;

    get originalViews(): ViewsOriginalType {
        return this._originalViews;
    }

    private _currentViewsState: CurrentViewsStateType = {
        viewObject: null,
        isSaved: false
    };

    get currentViewsState(): CurrentViewsStateType {
        return this._currentViewsState;
    }

    /**
     * On select view
     * @param id
     * @returns {any}
     */
    onSelect(id: number) {
        // let sgc: SlickGridComponent = this.getSlickGridComp();
        // sgc.provider.showOverlay();

        this.service.loadViewById(this.config.options.type, id).subscribe((view: ViewType) => {
            this.lastSelectedView = view;
            this.build(view);
            this.changeViewState({viewObject: view, isSaved: true});
            // sgc.provider.hideOverlay();
        });
    }


    /**
     * Return custom columns for table
     * @returns {any}
     */
    getCustomColumns(): Array<any> {
        return [];
    }

    /**
     * Return custom components for grid column
     * @returns {AgRendererComponent}
     */
    getCustomColumnRenderer(field: string) {
        if (field == "Status_text") {
            return StatusColumnComponent;
        }
        return null;
    }

    build(view: ViewType, colSetups: ViewColumnsType = null): void {
        if (!colSetups) {
            colSetups = this._originalViews.ViewColumns
        }
        let sgc: SlickGridComponent = this.getSlickGridComp();
        if (!sgc) {
            console.error('slickGridComp not found');
            return;
        }

        if ($.isEmptyObject(view.ColumnData)) {
            this.changeViewState({viewObject: view, isSaved: false});
            // return;
        }

        if (!sgc || !sgc.isGridReady) {
            sgc.onGridReady.subscribe(() => {
                sgc.provider.setViewColumns(
                    view,
                    colSetups,
                    this.getCustomColumns()
                );
            });
        } else {
            sgc.provider.setViewColumns(
                view,
                colSetups,
                this.getCustomColumns()
            );
            sgc.provider.prepareAndSetGlobalColumns(colSetups);
        }
    };

    load(): Observable<ViewsOriginalType | null> {
        let sgp: SlickGridProvider = this.getSlickGridComp().provider;

        return Observable.create((observer) => {
            if (!sgp) {
                observer.next(null);
            } else {
                this.service.getViews(this.config.options.type).subscribe((view: ViewsOriginalType) => {
                    this._originalViews = view;
                    sgp.prepareAndSetGlobalColumns(view.ViewColumns);
                    this.setViewsForUI(view.UserViews);
                    observer.next(view);
                });
            }
        });
    }

    setViewsForUI(views: UserViewsOriginalType) {
        let _views: Select2ListTypes = this.ui.turnSimpleObjectToStandart(views);
        this.ui.setData(_views, true);
    }

    setViewForUI(view: ViewType, isSavedState: boolean = true) {
        this.changeViewState({
            viewObject: view,
            isSaved: isSavedState
        });

        if (view.Id === -1) {
            console.warn('Id for current view is -1');
            return;
        }

        let views: UserViewsOriginalType = this.originalViews.UserViews;
        let index = -1;
        for (let e in views) {
            if (views[e] === view.ViewName) {
                index = parseFloat(e);
            }
        }
        this.lastSelectedView = view;
        this.ui.setSelectedByIds([index], false);
    }

    resetView() {
        this.build(this.lastSelectedView);
        this.setViewForUI(this.lastSelectedView);
    }

    /*
     * Delete current view
     */
    deleteView() {
        let modal: IMFXModalComponent = this.modalProvider.show(IMFXModalAlertComponent, {
            size: 'md',
            title: 'modal.titles.confirm',
            position: 'center',
            footer: 'close|ok'
        });
        let modalContent: IMFXModalAlertComponent = modal.contentView.instance;
        modalContent.setText('views.delete_confirm');
        modal.modalEvents.subscribe((e: IMFXModalEvent) => {
            if (e.name == 'ok') {
                let removedViewId = this.currentViewsState.viewObject.Id;
                this.service.deleteView(this.currentViewsState.viewObject).subscribe((resp: ReturnRequestStateType) => {
                    this.load().subscribe(() => {
                        this.build(this.originalViews.DefaultView);
                        this.setViewForUI(this.originalViews.DefaultView);
                        let isSaved = removedViewId != this.originalViews.DefaultView.Id;
                        this.changeViewState({viewObject: this.originalViews.DefaultView, isSaved: isSaved});
                    });
                });
                modal.hide();
            }
        });
    };

    saveCurrentView() {
        this.saveView().subscribe((view: ViewType) => {

        })
    }

    saveAsDefaultView() {
        let modal: IMFXModalComponent = this.modalProvider.show(IMFXModalAlertComponent, {
            size: 'md',
            title: 'table_search_dropdown.controls.save_as_default_view',
            position: 'center',
            footer: 'ok'
        });
        let modalContent: IMFXModalAlertComponent = modal.contentView.instance;
        modalContent.setText('views.as_default_confirm');
        modal.modalEvents.subscribe((e: IMFXModalEvent) => {
            if (e.name == 'ok') {
                this.saveView(this.getViewForSave(), true).subscribe(() => {
                })
                modal.hide();
            }
        })
    }

    saveViewAs(isPublic: boolean) {
        this.requestViewName(true, isPublic).subscribe((view: ViewType | null) => {
            if (view != null) {
                this.saveView(view).subscribe(() => {
                    // debugger;
                    // // this.load().subscribe((originalView: ViewsOriginalType) => {
                    // //     this.setViewForUI(view);
                    // // });
                });
            }
        });
    }

    requestViewName(isNew: boolean = false, isPublic: boolean = false): Observable<ViewType | null> {
        return Observable.create((observer) => {
            let view: ViewType = this.getViewForSave(isNew, isPublic);
            // if(view.ViewName){
            //     observer.next(view);
            //     return;
            // }
            let modal: IMFXModalComponent = this.modalProvider.show(IMFXModalPromptComponent, {
                size: 'md',
                title: isPublic ? 'views.global_save_view' : 'views.save_view',
                position: 'center',
                footer: 'close|ok'
            });
            let modalContent: IMFXModalPromptComponent = modal.contentView.instance;
            modalContent.setLabel('views.enter_view');
            modalContent.setPlaceholder('views.new_name_view');
            modal.modalEvents.subscribe((e: IMFXModalEvent) => {
                if (e.name === 'ok') {

                    let viewName = modalContent.getValue();
                    let validRes: SaveViewValidateResult = this.validate(viewName);
                    if (!validRes.valid) {
                        modalContent.setError(validRes.saveError);
                        return;
                    }
                    view.ViewName = viewName;

                    modal.hide();
                    observer.next(view);
                } else if (e.name === 'hide') {
                    observer.next(null);
                    modal.hide();
                }
            })
        });
    }

    /*
     * Save current view as - validation new name
     */
    validate(string): SaveViewValidateResult {
        let res = {saveError: '', valid: true};
        let currentView: ViewType = this.currentViewsState.viewObject || this.getViewForSave(true, false);
        let userViews: UserViewsOriginalType = this.originalViews.UserViews;
        if ($.isEmptyObject(currentView.ColumnData)) {
            res = {saveError: "views.view_columns_is_empty", valid: false};
        }
        if (!string || string.trim() == '') {
            res = {saveError: "views.view_name_is_empty", valid: false};
        } else {
            $.each(userViews, (k, v) => {
                if (v == string) {
                    res = {saveError: "views.view_name_exist", valid: false}
                }
            });


        }
        return res;
    }

    newView() {
        this.config.moduleContext.dropdown.setPlaceholder(
            this.config.moduleContext.translate.instant('table_search_dropdown.controls.new_view'),
            true
        );
        this.changeViewState({viewObject: null, isSaved: false});
        this.setupColumns(true);
    }

    setupColumns(isNewView: boolean = false) {
        let isOpened = true;
        let compContext = this.config.componentContext;
        let sgp: SlickGridProvider = this.getSlickGridComp().provider;
        let modal: IMFXModalComponent = this.modalProvider.show(SearchColumnsComponent, {
            size: 'md',
            title: 'columns_modal.header',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        }, {compContext: compContext});
        if (!this.currentViewsState.isSaved) {
            sgp.setDefaultColumns(this.getCustomColumns(), [], true);
        }

        modal.modalEvents.subscribe((e: IMFXModalEvent) => {
            if (e.name == 'ok_and_save') {
                let withRefresh = !e.state.isDefault;
                if (!this.currentViewsState.isSaved) {
                    modal.hide();
                    this.requestViewName(isNewView, e.state.isGlobal).subscribe((view: ViewType | null) => {
                        if (view != null) {
                            this.saveView(view, false, withRefresh).subscribe((view: ViewType) => {
                                if (e.state.isDefault) {
                                    this.saveView(view, e.state.isDefault).subscribe(() => {
                                        // debugger
                                    })
                                }
                            });
                        }
                    });
                } else {
                    let view = this.getViewForSave(false);
                    this.saveView(view, false, withRefresh).subscribe((view: ViewType) => {
                        if (e.state.isDefault) {
                            this.saveView(view, e.state.isDefault).subscribe(() => {
                                // debugger
                            })
                        }
                    });
                }


            } else if (e.name == 'ok') {
                modal.hide();
                this.changeViewState({viewObject: this.getViewForSave(isNewView, e.state.isGlobal), isSaved: false})
                isOpened = false;
            } else if (e.name == 'hide') {
                if (isOpened == true) {
                    this.onSelect(this.lastSelectedView.Id);
                    isOpened = false;
                }
            }
        })
    }

    getViewForSave(isNew: boolean = false, isPublic: boolean = false): ViewType {
        let sgp: SlickGridProvider = this.getSlickGridComp().provider;
        let columns = sgp.getActualColumns();
        let columnData = {};
        columns = columns.filter(function (el: SlickGridColumn) {
            return el.field != '*';
        });

        columns.forEach(function (el: SlickGridColumn) {
            columnData[el.field] = {
                "Index": el.id,
                "Tag": el.field,
                "Width": el.width
            }
        });

        let view: ViewType = Object.assign({}, this.currentViewsState.viewObject);
        view.ColumnData = columnData;
        view.Type = this.config.options.type;
        view.ShowThumbs = sgp.isThumbnails();
        if (isNew === true) {
            view.Id = 0;
            view.ViewName = null;
        }

        if (isPublic === true) {
            view.IsPublic = true;
        }

        return view;
    }

    shouldPinColumn(): boolean {
        let isIE = (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) || !!navigator.userAgent.match(/Trident\/7.0/);
        let isEdge = /Edge\/\d./i.test(navigator.userAgent);
        // return !(isEdge || isIE);
        return true;
    }

    getFormatterByName(bindingName, col, colDef: SlickGridColumn): SlickGridColumn {
        return colDef;
    }

    getFormatterByFormat(bindingFormat, col, colDef: SlickGridColumn): SlickGridColumn {
        if (bindingFormat) {
            switch (bindingFormat) {
                // Date
                case 'G':
                    colDef = $.extend(true, {}, colDef, {
                        isFrozen: false,
                        minWidth: 60,
                        resizable: true,
                        formatter: DatetimeFormatter,
                        enableColumnReorder: true,
                        __deps: {
                            componentFactoryResolver: this.compFactoryResolver,
                            appRef: this.appRef,
                            injector: this.injector
                        }
                    });
                    break;
                default:
                    break;
            }
        }

        return colDef;
    }

    changeViewState(viewState: CurrentViewsStateType) {
        this._currentViewsState = viewState;
        this.onChangeViewState.emit(viewState);
    }

    /*
     * Save current view
     */
    private saveView(view: ViewType = null, isDefault: boolean = false, withRefresh: boolean = true): Observable<ViewType> {
        return Observable.create((observer) => {
            if (!view) {
                view = this.getViewForSave();
            }

            this.service.saveView(view, isDefault).subscribe(
                (resp: ViewSaveResp) => {
                    if (resp.ErrorCode == null) {
                        if(resp.ObjectId){
                            view.Id = resp.ObjectId;
                        }
                        this.changeViewState({
                            viewObject: view,
                            isSaved: true
                        });
                        if (withRefresh) {
                            this.service.clearOriginalView(this.config.options.type);
                            this.load().subscribe(() => {
                                this.config.moduleContext.notificationRef.notifyShow(1, "views.success_save");
                                this.setViewForUI(view);
                            });
                        }
                        observer.next(view)

                    }
                },
                (error) => {
                }
            );
        })

    }

    private getSlickGridComp(): SlickGridComponent {
        return this.config.componentContext.slickGridComp;
    }
}
