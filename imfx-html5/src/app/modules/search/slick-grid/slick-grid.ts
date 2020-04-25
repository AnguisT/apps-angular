/**
 * Created by Sergey Trizna on 27.11.2017.
 */
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {SlickGridService} from './services/slick.grid.service';
import {SlickGridProvider} from './providers/slick.grid.provider';
import {CoreComp} from '../../../core/core.comp';
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions,
    SlickGridConfigPluginSetups
} from './slick-grid.config';
import {OverlayComponent} from '../../overlay/overlay';
import 'style-loader!./libs/jlynch7/css/smoothness/jquery-ui-1.8.16.custom.css';
import {ThumbnailFormatterComp} from './formatters/thumbnail.formatter';
import {SlickGridPanelBottomComp} from './comps/panels/bottom/bottom.panel.comp';
import {SlickGridPagerProvider} from './comps/pager/providers/pager.slick.grid.provider';
import {SlickGridInfoProvider} from './comps/info/providers/info.slick.grid.provider';
import {SlickGridPanelTopComp} from "./comps/panels/top/top.panel.comp";

require('./libs/jlynch7/lib/jquery-1.7.min.js');
let jqOld = (<any>window).$;
(<any>window).jqOld = jqOld;

(<any>window).jqOld.noConflict(true);
require('./libs/jlynch7/lib/jquery-ui-1.8.16.custom.min.js');

// (<any>window).jqOld =

require('./libs/jlynch7/lib/jquery.event.drag-2.2.js');
require('./libs/jlynch7/lib/jquery.mousewheel.js');

require('./libs/jlynch7/slick.core.js');
require('./libs/jlynch7/slick.grid.js');
require('./libs/jlynch7/slick.dataview.js');
require('./libs/jlynch7/slick.dataview.js');
require('./libs/jlynch7/plugins/slick.rowselectionmodel.js');
require('./libs/jlynch7/plugins/slick.autotooltips.js');

@Component({
    selector: 'slick-grid',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss',
        // 'libs/jlynch7/slick.grid.css'
    ],
    host: {
        // '(document:click)': 'onDocumentClick($event)',
        '(window:resize)': 'onResize($event)',
        '(click)' : 'onClick($event)',
    },
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SlickGridPagerProvider,
        SlickGridInfoProvider
    ]
})

export class SlickGridComponent extends CoreComp {
    public slickPlugin;
    public isGridReady: boolean = false;
    @Output() onGridReady = new EventEmitter<boolean>();
    protected readonly setups: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                dragDropCellEvents: {
                    dropCell: false,
                    dragEnterCell: false,
                    dragLeaveCell: false,
                    dragStartCell: false,
                },
                overlay: {
                    zIndex: 1029
                },
                viewModeSwitcher: true,
                clientSorting: false,
                enableSorting: true,
                showMediaLogger: true,
                tileSource: [],
                viewMode: 'table',
                onIsThumbnails: new EventEmitter<boolean>(),
                onSelectedView: new EventEmitter<any>(),
                rowHeightWithThumb: 100,
                pager: {
                    enabled: true,
                    perPage: 50,
                    currentPage: 1
                },
                info: {
                    enabled: true
                },
                isExpandable: {
                    enabled: false
                },
                isDraggable: {
                    enabled: false,
                },
                isTree: {
                    enabled: false
                },
                defaultColumns: [],
                actualColumns: [],
                globalColumns: [],
                data: [],
                tileParams: { // base
                    tileWidth: 267 + 24,
                    tileHeight: 276 + 24,
                    isThumbnails: true,
                    isIcons: true
                },
                topPanel: {
                    enabled: false
                },
                bottomPanel: {
                    enabled: true,
                    typeComponent: SlickGridPanelBottomComp
                },
                hasOuterFilter: false,
                search: {
                    enabled: true
                },
                selectFirstRow: true
            },
            plugin: <SlickGridConfigPluginSetups>{
                autoHeight: false,
                rowHeight: 30,
                showHeaderRow: false,
                leaveSpaceForNewRows: false,
                forceFitColumns: false,
                editable: false,
                enableAddRow: false,
                enableCellNavigation: false,
                multiSelect: false,
                fullWidthRows: false,
                multiAutoHeight: false,
                // forceSyncScrolling: true,
                explicitInitialization: true,
                // enableAsyncPostRender: false,
                // asyncPostRenderDelay: 100,
                // , enableCellNavigation: false
                // , asyncEditorLoading: true
                // , autoEdit: false
                // , topPanelHeight: 60,
                frozenColumn: -1, // -1 for suppress
                // multiColumnSort: true
                // frozenRow: 5,
                suppressSelection: false
            }
        })
    });
    private isError: boolean = false;
    private overlayErrorRepeatMessage: boolean = false;
    @ViewChild('grid') private gridEl: ElementRef;
    @ViewChild('slickGridWrapper') private gridWrapperEl: ElementRef;
    @ViewChild('slickGridOverlay') private overlay: OverlayComponent;
    @ViewChild('slickGridTopPanel') private topPanel: SlickGridPanelTopComp;
    @ViewChild('slickGridBottomPanel') private bottomPanel: SlickGridPanelBottomComp;

    constructor(protected injector: Injector,
                protected cdr: ChangeDetectorRef,
                // protected slickGridPanelProvider: SlickGridPanelProvider
    ) {
        super(injector);
    }

    get provider(): SlickGridProvider {
        return (<SlickGridProvider>this.config.provider);
    }

    get service(): SlickGridService {
        return (<SlickGridService>this.config.service);
    }

    get options(): SlickGridConfigOptions {
        return (<SlickGridConfigOptions>this.config.options);
    }

    get plugin(): SlickGridConfigPluginSetups {
        return (<SlickGridConfigPluginSetups>this.config.options.plugin);
    }

    get module(): SlickGridConfigModuleSetups {
        return (<SlickGridConfigModuleSetups>this.config.options.module);
    }

    ngAfterViewInit() {
        new Promise((resolve, reject) => {
            this.provider.cdr = this.cdr;
            this.provider.init({
                grid: this.gridEl,
                overlay: this.overlay,
                gridWrapper: this.gridWrapperEl,
                topPanel: this.topPanel,
                bottomPanel: this.bottomPanel
            }, (<any> window).jqOld);

            resolve();
        }).then(
            () => {
                if (this.isModuleReady) {
                    this.isGridReady = true;
                    this.onGridReady.emit(this.isGridReady);
                } else {
                    this.onModuleReady.subscribe(() => {
                        this.isGridReady = true;
                        this.onGridReady.emit(this.isGridReady);
                    });
                }

            },
            (err) => {
                console.log(err);
            }
        );
    }

    onClickCancelInOverlay() {
        this.overlayErrorRepeatMessage = true;
        this.provider.setCustomPlaceholder($(this.gridWrapperEl.nativeElement).find('#overlayErrorRepeatMessage'));
        this.provider.updatePlaceholderPosition();
        this.provider.showPlaceholder();
        this.provider.clearData(true);
        this.cdr.markForCheck();
    }

    onClickRepeat() {
        this.overlayErrorRepeatMessage = false;
        this.provider.clearPlaceholder();
        this.provider.clearData();
        if (this.provider.lastSearchModel) {
            this.provider.buildPage(this.provider.lastSearchModel);
        }

        this.cdr.markForCheck();

    }

    onResize($event) {
    }

    onClick($event) {
        this.provider.tryOpenPopup($event);
    }

    onDocumentClick($event) {
        this.provider.tryOpenPopup($event);
    }

    setService(service: SlickGridService) {
        this.config.service = service;
    }
}
