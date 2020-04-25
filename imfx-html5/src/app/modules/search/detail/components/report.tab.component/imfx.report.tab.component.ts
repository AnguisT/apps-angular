import { Component, ViewEncapsulation, Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { DetailService } from '../../../../../modules/search/detail/services/detail.service';
import { StatusComponent } from '../status/status';
import { GridOptions } from 'ag-grid/main';
import { I18NTable } from '../../../../../services/i18n/table/i18n.table';
import { LocalDateGridComponent } from '../../../../controls/local.date/local.date.component';
import { MediaDetailReportsResponse } from '../../../../../models/media/detail/reports/media.detail.reports.response';
import {AgDocViewerComponent} from "../../../../controls/ag.doc.viewer/ag.doc.viewer.component";

@Component({
    selector: 'imfx-report-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../../../styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
@Injectable()
export class IMFXReportTabComponent {
    config: any;
    private compIsLoaded = false;
    private data = {
        tableColumns: [
            {
                field: "IsReportAvailable",
                headerName: "",
                cellRendererFramework: StatusComponent,
                width: 50,
                sortable: true,
                suppressMovable: true
            },
            {
                field: "ReportName",
                headerName: "Report Name",
                sortable: true,
                suppressMovable: true
            },
            {
                field: "ReportType",
                headerName: "Report Type",
                sortable: true,
                suppressMovable: true
            },
            {
                field: "JobRef",
                headerName: "Job Ref",
                sortable: true,
                suppressMovable: true
            },
            {
                field: "GeneratedDate",
                headerName: "Generated Date",
                sortable: true,
                suppressMovable: true,
                cellRendererFramework: LocalDateGridComponent
            },
            {
                field: "Url",
                headerName: "",
                sortable: true,
                suppressMovable: true,
                cellRendererFramework: AgDocViewerComponent
            }
        ]
    };
    private gridOptions = <GridOptions> {
        rowData: [],
        rowHeight: 30,
        columnDefs: this.data.tableColumns,
        enableColResize: true,
        enableSorting: true,
        toolPanelSuppressGroups: true,
        toolPanelSuppressValues: true,
        rowSelection: 'single',
        layoutInterval: -1,
    };
    constructor(private cdr: ChangeDetectorRef,
                private detailService: DetailService,
                @Inject(I18NTable) protected i18nTable: I18NTable) {
        this.gridOptions.localeText = this.i18nTable.getTranslate();
    }
    ngOnInit() {
        if (this.config.elem && !this.config.elem._config._isHidden) {
            this.selectReport();
        }
    }
    selectReport() {
        let self = this;
        this.detailService.getDetailReport(this.config.file["ID"])
            .subscribe((res: Array<MediaDetailReportsResponse>) => {
                let tableRows = [];
                res.forEach(function(el){
                    tableRows.push({
                        ReportName: el.ReportName,
                        ReportType: el.ReportType,
                        JobRef: el.JobRef,
                        GeneratedDate: el.GeneratedDate,
                        IsReportAvailable: el.IsReportAvailable,
                        Url: el.Url
                    });
                });
                this.gridOptions.api.setColumnDefs(this.data.tableColumns);
                this.gridOptions.api.setRowData(tableRows);
                this.gridOptions.api.doLayout();
                this.compIsLoaded = true;
                this.cdr.detectChanges();
            });

    };
     /*
     *Table methods
     */
    onReady($event) {};
    onBodyScroll($event) {};
    onCellFocused($event): any {
        if ($event.column) {
            let model = this.gridOptions.api.getModel();
            let node = model.getRow($event.rowIndex);
            if (node) {
                node.setSelected(true);
            }
        }
    }
    public loadComponentData() {
        if (!this.compIsLoaded) {
            this.selectReport();
        }
    }
}
