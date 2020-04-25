import {
    ApplicationRef,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Inject,
    Injectable,
    Injector,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {TimeCodeFormat, TMDTimecode} from "../../../../../utils/tmd.timecode";
import {IMFXGrid} from "../../../../controls/grid/grid";
import {TextMarkerConfig} from "../../../../controls/text.marker/imfx.text.marker.config";
import {SearchFormProvider} from "../../../form/providers/search.form.provider";
import {SearchAdvancedProvider} from "../../../advanced/providers/search.advanced.provider";
import {IMFXTextMarkerComponent} from "../../../../controls/text.marker/imfx.text.marker";
import {DetailService} from "../../services/detail.service";
import {
    SlickGridColorScheme,
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions,
    SlickGridConfigPluginSetups
} from "../../../slick-grid/slick-grid.config";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {SlickGridColumn} from "../../../slick-grid/types";
import {SubtitleFormatter} from "../../../slick-grid/formatters/subtitle/subtitle.formatter";

@Component({
    selector: 'subtitles-grid',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [SlickGridProvider,
        SlickGridService,
        IMFXTextMarkerComponent],
    entryComponents: [
        IMFXGrid
    ]
})
@Injectable()
export class IMFXSubtitlesGrid {
    @ViewChild('subtitlesGrid') private subtitlesGrid: SlickGridComponent;
    @Input() subtitles: Array<any/*{
     timecode: string,
     subtitle: string
     }*/>;
    @Input() additionalSubs: Array<any> = [];
    @Input() standalone: boolean = false;
    @Input() private timecodeFormatString: string;
    @Input() externalSearchText: string;
    @Input() colorGridScheme?: {
        dark: SlickGridColorScheme,
        default: SlickGridColorScheme
    };

    @Output() selectSubtitle: EventEmitter<any> = new EventEmitter<any>();
    public onResize: EventEmitter<{ comp: any }> = new EventEmitter<{ comp: any }>();


    private timecodeFormat: number;

    config: any;
    private selectedLangSub;
    private previousScrollIndex: number = 0;

    private data = {
        tableRows: [],
        tableColumns: <SlickGridColumn[]>[
            {
                id: 1,
                name: 'Timecode',
                field: 'In',
                width: 90,
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
            {
                id: 2,
                name: 'Text',
                field: 'Text',
                resizable: true,
                sortable: true,
                formatter: SubtitleFormatter,
                multiColumnSort: false,
                isFrozen: true,
                isCustom: true,
                __deps: {
                    componentFactoryResolver: this.compFactoryResolver,
                    appRef: this.appRef,
                    injector: this.injector
                }
            }
        ]
    };
    private textMarkerConfig = <TextMarkerConfig> {
        componentContext: this
    };
    private gridReady = false;

    private prevMinNode;
    private prevMinValueId;

    private subtitlesGridOptions: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        providerType: SlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                isThumbnails: false,
                search: {
                    enabled: false
                },
                externalWrapperEl: '#externalWrapperSlickGridForInfoPanel',
                customColorScheme: {
                    dark: <SlickGridColorScheme>{
                        colorbkgd: '#21282E',
                        colorbkgdmid: '#34404a'

                    },
                    default: <SlickGridColorScheme>{
                        colorbkgd: '#E2E7EB',
                        colorbkgdmid: '#EDF1F2'
                    },
                },
                selectFirstRow: false
            },
            plugin: <SlickGridConfigPluginSetups>{
                headerRowHeight: 20,
                fullWidthRows: true,
                forceFitColumns: false
            }
        })
    });

    constructor(private cdr: ChangeDetectorRef,
                private detailSvc: DetailService,
                @Inject(ComponentFactoryResolver) public compFactoryResolver: ComponentFactoryResolver,
                @Inject(ApplicationRef) public appRef: ApplicationRef,
                @Inject(Injector) public injector: Injector) {


        // this.onResize.subscribe(() => {
        //     this.subtitlesGrid.provider.resize();
        // });
    };


    ngOnInit() {
        if (this.colorGridScheme){
            this.subtitlesGridOptions.options.module.customColorScheme = this.colorGridScheme;
        }
        this.initSubtitles();
    };

    ngOnChanges() {
        this.initSubtitles();

    };

    ngAfterViewInit() {
        this.gridReady = true;
        this.updateSubtitle();
    }

    refreshGrid(){
        // setImmediate(() => {
        //     this.subtitlesGrid.provider.resize();
        // });
    }

    private bindDataToGrid() {
        this.subtitlesGrid.provider.setGlobalColumns(this.data.tableColumns);
        this.subtitlesGrid.provider.setDefaultColumns(this.data.tableColumns, [], true);
        this.subtitlesGrid.provider.buildPageByData({Data: this.data.tableRows});

        this.subtitlesGrid.provider.onSelectRow.subscribe((rowIndex: number) => {
            this.onSelectRow(rowIndex);
        });

    }

    private initSubtitles() {
        if (!this.subtitles || !this.gridReady) {
            return;
        }
        this.subtitles = this.subtitles.map(el => {
            el.Text = el.Text.trim();
            return el;
        });

        this.data.tableRows = this.subtitles;
        this.timecodeFormat = TimeCodeFormat[this.timecodeFormatString];
        this.bindDataToGrid();
    };

    refreshSlickGrid() {
        this.subtitlesGrid.provider.slick.invalidate();
        this.subtitlesGrid.provider.slick.render();
    }

    scrollToIndex(rowIndex: number, withSelect: boolean = false) {
        let scrollOffset;
        if ((rowIndex < 3) || (this.subtitles.length - rowIndex) <= 3) {
            scrollOffset = rowIndex;
        } else {
            if(rowIndex > this.previousScrollIndex){
                scrollOffset = rowIndex + 2;
            } else {
                scrollOffset = rowIndex - 2;
            }
        }

        this.previousScrollIndex = scrollOffset;

        this.subtitlesGrid.provider.slick.scrollRowIntoView(scrollOffset, false);
        if (withSelect) {
            this.subtitlesGrid.provider.setSelectedRow(rowIndex, null,true);
        }

    }

    setSubtitles(subtitles: Array<any>, additionalSubs: Array<any> = []) {
        if (additionalSubs && additionalSubs.length > 0) {
            this.additionalSubs = additionalSubs;
        }
        this.subtitles = subtitles;
        this.storedSubs = this.subtitles;
        this.initSubtitles();
        this.updateSubtitle();
    };

    storedSubs = [];

    setLangSubtitles(id) {
        if (id == 0) {
            this.subtitles = this.storedSubs;
            this.initSubtitles();
            this.updateSubtitle();
            this.cdr.detectChanges();
        }
        else {
            this.selectedLangSub = id;
            this.detailSvc.getPacSubtitles(id).subscribe((res) => {
                this.subtitles = res;
                this.initSubtitles();
                this.updateSubtitle();
                this.cdr.detectChanges();
            });
        }
    };

    updateSubtitle() {
        if (this.gridReady) {
            setTimeout(() => {
                try {
                    let searchString = this.injector.get(SearchFormProvider).getSearchString();
                    if (searchString != "" && searchString != null) {
                        let searchAdvancedProvider = this.injector.get(SearchAdvancedProvider);
                        if (searchAdvancedProvider) {
                            let models = searchAdvancedProvider.getModels();
                            for (var e in models) {
                                if (models[e]._dbField == 'CC_TEXT') {
                                    searchString = models[e]._value;
                                }
                            }
                        }
                    }
                    this.externalSearchText = searchString;
                    this.textMarkerConfig.moduleContext.config.options.filterText = searchString;
                    this.textMarkerConfig.moduleContext.searchKeyUp();
                }
                catch (err) {
                    console.log("no provider");
                }
            }, 0);
        }
    }


    public selectRow(timecode: string) {
        if (!this.subtitles || this.subtitles.length == 0) {
            return;
        }

        let sgp = this.injector.get(SlickGridProvider);
        let selectedRowData = sgp.getSelectedRowData();


        if (!!selectedRowData && (timecode == selectedRowData.In)) {
            return;
        }

        let currentTime = TMDTimecode.fromString(timecode, this.timecodeFormat).toMilliseconds();
        let minTime = 0;

        let minValueId: number;
        let _data = sgp.getData();

        for (let i = 0; i < _data.length; i++) {
            let rowTimeIn = TMDTimecode.fromString(_data[i + ''].In, this.timecodeFormat).toMilliseconds()
            let rowTimeOut = TMDTimecode.fromString(_data[i + ''].Out, this.timecodeFormat).toMilliseconds()
            if (rowTimeIn < currentTime && rowTimeOut > currentTime) {
                minValueId = i;
            }
        }

        if (!minValueId) {
            return;
        }

        this.scrollToIndex(minValueId, true);

        if (this.prevMinNode && this.prevMinNode.rowIndex == minValueId) {
            return;
        } else {
            this.prevMinValueId = minValueId;
            this.prevMinNode = _data[minValueId];
        }
    };

    onSelectRow(rowIndex) {
        let rowData = this.subtitlesGrid.provider.getSelectedRowData();
        if (!rowData){
            return;
        }
        this.config && this.config.elem.emit('setTimecode', rowData.In);
        this.selectSubtitle.emit(rowData.In);
    };

    public loadComponentData() {
        // setImmediate(() => {
        //     this.subtitlesGrid.provider.resize();
        // });

        this.gridReady = true;
        this.updateSubtitle();
    };

    refresh(data) {
        this.subtitles = data;
        this.cdr.detectChanges();
    }
}
