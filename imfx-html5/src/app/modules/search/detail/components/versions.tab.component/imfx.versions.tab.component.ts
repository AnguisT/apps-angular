import {ChangeDetectorRef, Component, Injectable, ViewChild, ViewEncapsulation} from '@angular/core'
/*import {DetailService} from "../../../../../modules/search/detail/services/detail.service";
import {GridOptions} from 'ag-grid/main';*/
// Views
import {ViewsConfig} from '../../../../../modules/search/views/views.config';
import {VersionsViewsProvider} from '../../../../../views/titles/modules/versions/providers/views.provider';
// Grid
import {VersionsGridService} from '../../../../../views/titles/modules/versions/services/grid.service';
// Loading jQuery
import {VersionsGridProvider} from "../../../../../views/version/providers/versions.grid.provider";
import {SearchViewsComponent} from "../../../views/views";
import {SegmentsSlickGridProvider} from "../segments.tab.component/providers/segments.slickgrid.provider";
import {
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigOptions,
    SlickGridConfigPluginSetups
} from "../../../slick-grid/slick-grid.config";
import {SlickGridService} from "../../../slick-grid/services/slick.grid.service";
import {SlickGridProvider} from "../../../slick-grid/providers/slick.grid.provider";
import {VersionsTabSlickGridProvider} from "./providers/versions.tab.slickgrid.provider";
import {SlickGridComponent} from "../../../slick-grid/slick-grid";
import {SlickGridColumn, SlickGridResp} from "../../../slick-grid/types";

@Component({
    selector: 'imfx-versions-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        VersionsGridService,
        // VersionsGridProvider,
        // VersionsViewsProvider,

        SlickGridService,
        SlickGridProvider,
        VersionsTabSlickGridProvider,
        {provide: SlickGridProvider, useClass: VersionsTabSlickGridProvider},
    ]
})
@Injectable()
export class IMFXVersionsTabComponent {
    config: any;
    compIsLoaded = false;
    /**
     * Views
     * @type {ViewsConfig}
     */
    @ViewChild('viewsComp') public viewsComp: SearchViewsComponent;
    // protected searchGridConfig = <GridConfig>{
    //     componentContext: this,
    //     gridOptions: {
    //       layoutInterval: -1,
    //       columnDefs: []
    //     },
    //     options: {
    //         type: 'versions',
    //         searchType: 'Version',
    //         viewModeSwitcher: false,
    //         service: <VersionsGridService>null,
    //         provider: <VersionsGridProvider>null
    //     }
    // };
    // protected searchViewsConfig = <ViewsConfig>{
    //     componentContext: this,
    //     options: {
    //         type: 'VersionGrid',
    //     }
    // };


    private tableColumns: SlickGridColumn[] = [
        {
            id: '1',
            field: 'ID',
            name: 'Id',
            minWidth: 50,
            resizable: true,
            sortable: false,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '2',
            field: 'TITLE',
            name: 'Title',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '3',
            field: 'VERSION',
            name: 'Version',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '4',
            field: 'VERSIONID1',
            name: 'Version Id1',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '5',
            field: 'VERSIONID2',
            name: 'Version Id2',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '6',
            field: 'CREATED_BY',
            name: 'Created By',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '7',
            field: 'DURATION_text',
            name: 'Duration',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '8',
            field: 'SER_EP_NUM',
            name: 'Episode',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '9',
            field: 'FORMAT_text',
            name: 'Format',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '10',
            field: 'PRGM_ID_INHOUSE',
            name: 'House Number',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '11',
            field: 'OWNERS_text',
            name: 'Network',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        },
        {
            id: '12',
            field: 'SER_TITLE',
            name: 'Series Title',
            minWidth: 50,
            resizable: true,
            sortable: true,
            multiColumnSort: false,
            headerCssClass: "disable-reorder",
        }
    ]
    @ViewChild('versionSlickGrid') private versionSlickGrid: SlickGridComponent;
    private searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
        componentContext: this,
        // providerType: TitlesSlickGridProvider,
        providerType: VersionsTabSlickGridProvider,
        serviceType: SlickGridService,
        options: new SlickGridConfigOptions(<SlickGridConfigOptions>{
            module: <SlickGridConfigModuleSetups>{
                viewModeSwitcher: false,
                isThumbnails: false,
                search: {
                    enabled: false
                }
            },
            plugin: <SlickGridConfigPluginSetups>{
                rowHeight: 40,
                forceFitColumns: false
            }
        })
    });

    constructor(private cdr: ChangeDetectorRef,
                public searchGridService: VersionsGridService) {
    }

    ngAfterViewInit() {
        this.versionSlickGrid.provider.setGlobalColumns(this.tableColumns);
        this.versionSlickGrid.provider.setDefaultColumns(this.tableColumns, [], true);
        this.compIsLoaded = true;
        if (this.config.elem && !this.config.elem._config._isHidden) {
            (<VersionsTabSlickGridProvider>this.versionSlickGrid.provider).getRowsById(this.config.file.ID).subscribe(
                (resp: SlickGridResp) => {
                    this.versionSlickGrid.provider.buildPageByData(resp);
                    // this.compIsLoaded = true;
                }
            )
        }
    }

    public loadComponentData() {
        if (!this.compIsLoaded) {
            (<VersionsTabSlickGridProvider>this.versionSlickGrid.provider).getRowsById(this.config.file.ID).subscribe(
                (resp: SlickGridResp) => {
                    this.versionSlickGrid.provider.buildPageByData(resp.Data);
                    this.compIsLoaded = true;
                }
            )
        }
    }
}
