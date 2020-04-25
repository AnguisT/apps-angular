import {
  Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, Input,
  ViewChild
} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from '@angular/common';
import {GridOptions} from "ag-grid";
import {TableSearchService} from "../../../../services/viewsearch/table.search.service";
import {SearchAdvancedService} from "../../../../modules/search/advanced/services/search.advanced.service";
import {IMFXGrid} from "../../../../modules/controls/grid/grid";
import {SearchSavedService} from "../../../../modules/search/saved/services/search.saved.service";
import { appRouter } from '../../../../constants/appRouter';
@Component({
  moduleId: 'workflow-details',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss',
    '../../../../modules/styles/index.scss'
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [
    TableSearchService,
    SearchAdvancedService
  ],
  entryComponents: [
    IMFXGrid
  ]
})
export class WorkflowsDashComponent {

  @Input() headerTitle;
  @Input() savedSearch;
  @ViewChild('overlay') private overlay: any;
  @ViewChild('workflowtable') private workflowtable: any;

  private gridOptions: GridOptions;
  private data = {
    tableRows: [],
    tableColumns: [
      {
        field: "ID",
        headerName: "Id",
        sortable: true,
        suppressMovable: true,
        width: 80
      },
      {
        field: "CMB_IN_TTLS_text",
        headerName: "Title",
        sortable: true,
        suppressMovable: true
      },
      {
        field: "PNAME_text",
        headerName: "Job Type",
        sortable: true,
        suppressMovable: true
      },
      {
        field: "CMB_STAT_text",
        headerName: "Status",
        sortable: true,
        suppressMovable: true
      },
      {
        field: "J_COMPL_BY",
        headerName: "Complete By",
        sortable: true,
        suppressMovable: true
      }
    ]
  };

  private timerId;

  constructor(private cdr: ChangeDetectorRef,
              private searchService: TableSearchService,
              private searchAdvancedService: SearchSavedService,
              private router: Router,
              public location: Location) {
    this.gridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: true,
      toolPanelSuppressGroups: true,
      toolPanelSuppressValues: true,
      rowSelection: "single",
      icons: {
        sortAscending: '<i class="icons-up icon"></i>',
        sortDescending: '<i class="icons-down icon"></i>',
        groupExpanded: '<i class="icons-down icon"></i>',
        groupContracted: '<i class="icons-right icon"></i>'
      },
    };
  }

  ngOnInit() {
    this.InitGrid();
    let self = this;
    this.timerId = setInterval(function() {
      self.InitGrid();
    }, 15000);
  }

  ngOnDestroy() {
    clearInterval(this.timerId);
  }

  InitGrid() {
    console.log("Init data...");
    //this.overlay.show(this.workflowtable.nativeElement);
    let self = this;
    if(this.savedSearch != -1) {
      this.searchAdvancedService.getSavedSearches("Job", this.savedSearch).subscribe(result=> {
        let advSearchParams = [];
        if(result && result.length > 0) {
          result.forEach(function(el){
            advSearchParams.push(el);
          });
          self.searchService.search("workflow", "", 1, "", "desc", advSearchParams)
            .subscribe(res=> {
              let tableRows = [];
              res.Data.forEach(function(el){
                let exp = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
                for (var e in el){
                  if (typeof el[e]=="string" && el[e].match(exp))  {
                    el[e] = new Date(el[e]).toLocaleString();
                  }
                }
                tableRows.push({
                  ID: el.ID,
                  CMB_IN_TTLS_text: el.CMB_IN_TTLS_text,
                  PNAME_text: el.PNAME_text,
                  CMB_STAT_text: el.CMB_STAT_text,
                  J_COMPL_BY: el.J_COMPL_BY
                })
              });
              self.data.tableRows = tableRows;
              //self.overlay.hide(self.workflowtable.nativeElement);
              console.log("Updated");
              self.cdr.detectChanges();
            });
        }
      });
    } else {
      this.searchService.search("workflow","",1)
        .subscribe(res=> {
          let tableRows = [];
          res.Data.forEach(function(el){
            tableRows.push({
              ID: el.ID,
              CMB_IN_TTLS_text: el.CMB_IN_TTLS_text,
              PNAME_text: el.PNAME_text,
              CMB_STAT_text: el.CMB_STAT_text,
              J_COMPL_BY: el.J_COMPL_BY
            })
          });
          self.data.tableRows = tableRows;
          //self.overlay.hide(self.workflowtable.nativeElement);
          console.log("Updated");
          self.cdr.detectChanges();
        });
    }
  }

  onRowDoubleClicked($event): any {
    this.router.navigate(
      [
        appRouter.workflow.detail.substr(
          0,
          appRouter.workflow.detail.lastIndexOf('/')
        ),
        $event.data.ID
      ]
    );
  }
}
