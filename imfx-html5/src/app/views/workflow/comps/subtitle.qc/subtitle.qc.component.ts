import {Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, ViewChild} from '@angular/core';
import {WorkflowService} from '../../../../services/workflow/workflow.service';
import {ConfigService} from '../../../../services/config/config.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import * as $ from 'jquery';
import {GridOptions} from 'ag-grid';
import {SplashProvider} from '../../../../providers/design/splash.provider';
import {TranslateService} from 'ng2-translate';
import {IMFXGrid} from "../../../../modules/controls/grid/grid";
@Component({
    moduleId: 'subtitle-qc-details',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    providers: [
        WorkflowService
    ],
    entryComponents: [
      IMFXGrid
    ]
})
export class SubtitleQcDetailsComponent {
    @ViewChild('overlay') private overlay: any;
    @ViewChild('subtitleqc') private subtitleqc: any;
    private gridOptions: GridOptions;
    private error: boolean = false;
    private text: string = '';
    private data = {
        tableRows: [],
        tableColumns: [
          {
            field: "In",
            headerName: "In", // TODO: i18n
            width: 30,
            sortable: true,
            suppressMovable: true
          },
          {
            field: "Out",
            headerName: "Out", // TODO: i18n
            width: 30,
            sortable: true,
            suppressMovable: true
          },
          {
            field: "Text",
            headerName: "Text",  // TODO: i18n
            sortable: true,
            suppressMovable: true
          }
        ]
    };

    private details: any;
    constructor(private cdr: ChangeDetectorRef,
                private workflowService: WorkflowService,
                private splashProvider: SplashProvider,
                private route: ActivatedRoute,
                public location: Location,
                private translate: TranslateService) {

        this.gridOptions = <GridOptions>{
            layoutInterval: -1,
            enableColResize: true,
            enableSorting: true,
            toolPanelSuppressGroups: true,
            toolPanelSuppressValues: true,
            rowSelection: 'single',
            moduleContext: this,
            onGridReady: function(params) {
              params.api.sizeColumnsToFit();
            },
            getRowHeight(params) {
                let h = params.data.NOTES
                    ? (18 * (Math.floor(params.data.NOTES.length / 45) + 1))
                    : 25;
                return h > 25 ? h : 25;
            }
        };
    }

    clickBack() {
        this.location.back();
    }

    ngOnInit() {
        this.overlay.hideWhole();
        this.overlay.show(this.subtitleqc.nativeElement);
    }

    ngAfterViewInit() {
        this.workflowService.getWorkflowDetails(this.route.snapshot.params['id']).subscribe((res) => {
            this.error = false;
            let tasks = [];
            this.details = res;
            for (let el of res.SourceMedia) {
                if (el.THUMBID == -1) {
                    el.THUMBURL = './assets/img/default-thumb.png';
                } else {
                    el.THUMBURL = ConfigService.getAppApiUrl() + '/getfile.aspx?id=' + el.THUMBID;
                }
            }

            setTimeout(() => {
                this.overlay.hide(this.subtitleqc.nativeElement);
            })
        }, (error) => {
            if (error.status == 500) {
                // ошибка сервера
                this.text = this.translate.instant('details_item.server_not_work');
            } else if (error.status == 400) {
                // элемент не найден
                this.text = this.translate.instant('details_item.media_item_not_found');
            } else if (error.status == 0) {
              // сети нет
                this.text = this.translate.instant('details_item.check_network');
            }
            this._isError();
        });
    }

    _isError() {
        this.overlay.hide(this.subtitleqc.nativeElement);
        this.error = true;
        this.cdr.markForCheck();
    }
}
