import {Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {GridConfig} from "../../search/grid/grid.config";
import {GridOptions} from "ag-grid";
import {AgGridNg2} from "ag-grid-ng2";

@Component({
  selector: 'imfx-grid',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss',
  ],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class IMFXGrid {

  public api;
  public columnApi;
  public _nativeElement: HTMLElement;

  @ViewChild('gridRef') gridRef;

  @Input() gridOptions: GridOptions;
  @Input() rowData;
  @Input() columnDefs;

  @Output() ready: EventEmitter<any> = new EventEmitter<any>();
  @Output() bodyScroll: EventEmitter<any> = new EventEmitter<any>();
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() cellFocused: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowDoubleClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowDataChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() gridResized: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit() {
    this.api = this.gridRef.api;
    this.columnApi = this.gridRef.columnApi;
    this._nativeElement = this.gridRef._nativeElement;
    setTimeout(() => {
      let self = this;
      $(this.gridRef._nativeElement.parentElement).find('iframe')[0].onload = function() {
        self.setResizeEvent();
      };
      this.setResizeEvent();
      this.resizeHandler();
    });
  }

  private onReadyHandler(p) {
    this.ready.emit(p);
  }


  private onBodyScrollHandler(p) {
    this.bodyScroll.emit(p);
  }


  private onUpdateHandler(p) {
    this.update.emit(p);
  }

  private onCellFocusedHandler(p) {
    this.cellFocused.emit(p);
  }

  private onRowDataChangedHandler(p) {
    this.rowDataChanged.emit(p);
  }

  private rowDoubleClickedHandler(p) {
    this.rowDoubleClicked.emit(p);
  }

  private rowClickedHandler(p) {
    this.rowClicked.emit(p);
  }

  private setResizeEvent() {
    let componentRef = this;
    $($(this.gridRef._nativeElement.parentElement).find("iframe")[0]['contentWindow']).resize(function () {
      componentRef.resizeHandler();
    });
  }

  private resizeHandler() {
    this.api.doLayout();
    this.gridResized.emit(this.api);
    // this.api.resetRowHeights();
  }

}
