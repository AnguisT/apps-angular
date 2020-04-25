import {
  Component, Input, ViewEncapsulation, Output, EventEmitter, ChangeDetectorRef, ViewChild,
  ElementRef, Injectable
} from '@angular/core';
import * as $ from 'jquery';
import {Pipe, PipeTransform} from '@angular/core';
import {GridOptions, RowNode} from "ag-grid";
import {TimeCodeFormat, TMDTimecode} from "../../../../../utils/tmd.timecode";
import {IMFXGrid} from "../../../../controls/grid/grid";
import {
    SlickGridColorScheme,
    SlickGridConfig, SlickGridConfigModuleSetups,
    SlickGridConfigOptions, SlickGridConfigPluginSetups
} from '../../../slick-grid/slick-grid.config';
import { SlickGridService } from '../../../slick-grid/services/slick.grid.service';
import { SlickGridProvider } from '../../../slick-grid/providers/slick.grid.provider';
import { SlickGridComponent } from '../../../slick-grid/slick-grid';
import { SlickGridColumn } from '../../../slick-grid/types';

@Component({
    selector: 'subtitles-pac-grid',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SlickGridProvider,
        SlickGridService],
    entryComponents: [
      IMFXGrid
    ]

})
@Injectable()
export class SubtitlesPacGrid {

    @Input() subtitles: Array<any>;
    @Input() standalone: boolean = false;
    @Input() private timecodeFormatString: string;

    @Output() selectSubtitle: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('subtitlesPacGrid') private subtitlesPacGrid: SlickGridComponent;
    public onResize: EventEmitter<{ comp: any }> = new EventEmitter<{ comp: any }>();

    private timecodeFormat: number;

    config: any;

    private colorGridScheme?: {
        dark: SlickGridColorScheme,
        default: SlickGridColorScheme
    };

    private data = {
        tableRows: [],
        tableColumns: <SlickGridColumn[]>[
            {
                id: 1,
                name: 'In',// TODO: i18n
                field: 'In',
                width: 90,
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
            {
                id: 2,
                name: 'Out',
                field: 'Out',
                width: 90,
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
            {
                id: 3,
                name: 'Text',
                field: 'Text',
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
        ]
    };

    private gridReady = false;

    private subtitlesPacGridOptions: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
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
                externalWrapperEl: '#externalWrapperSubPacSlickGridForInfoPanel',
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

    constructor(private cdr: ChangeDetectorRef) {
        this.onResize.subscribe(() => {
            this.subtitlesPacGrid.provider.resize();
        });
    };

    ngOnInit() {
        if (this.colorGridScheme){
            this.subtitlesPacGridOptions.options.module.customColorScheme = this.colorGridScheme;
        }
        this.initSubtitles()
    };

    ngOnChanges() {
        this.initSubtitles()
    };

    ngAfterViewInit(){
        this.gridReady = true;
    }

    setPacSubtitles(subtitles: Array<any>) {
        this.subtitles = subtitles;
        this.initSubtitles();
    };

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
        this.cdr.detectChanges();
        this.bindDataToGrid();
    };

    private bindDataToGrid() {
        this.subtitlesPacGrid.provider.setGlobalColumns(this.data.tableColumns);
        this.subtitlesPacGrid.provider.setDefaultColumns(this.data.tableColumns, [], true);
        this.subtitlesPacGrid.provider.buildPageByData({Data: this.data.tableRows});
        this.subtitlesPacGrid.provider.resize();
    }


}
