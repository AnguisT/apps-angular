import {
  ChangeDetectorRef, Component, Injectable, Input, ViewEncapsulation, ElementRef,
  EventEmitter, Output
} from '@angular/core';
import { GridOptions } from 'ag-grid/main';

import { AgTagsComponent } from 'app/modules/controls/ag.tags/tags.component';
import { InputComponent } from 'app/modules/controls/table.input/table.input.component';
import { ThumbColumnComponent } from 'app/modules/search/grid/comps/columns/thumb/thumb';
import { DeleteRowComponent } from '../../../modules/search/grid/comps/rows/delete.row/delete.row';

import * as $ from 'jquery';
import {Subject} from "rxjs/Subject";
import {AgColorIndicatorComponent} from "./ag.color.indicator";

@Component({
    selector: 'imfx-logger-comments',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [DeleteRowComponent]
})
@Injectable()
export class IMFXLocatorsCommentsComponent {
    @Input() config: any;
    @Input() reloadData: Subject<any>;
    @Output() saveValid: EventEmitter<any> = new EventEmitter();
    private myResizing = false;
    private seriesCountForNewItemId = 0;
    private gridOptions = <GridOptions>{
        layoutInterval: -1,
        context: {
            componentParent: this
        }
    };
    private taxonomy: Array<any> = []
    private data = {
        tableRows: [],
        tableColumns: [
            {
              field: "indicator",
              headerName: "",
              width: 20,
              sortable: false,
              resizable: false,
              suppressMovable:false,
              cellRendererFramework: AgColorIndicatorComponent,
            },
            {
                field: "thumbIn",
                headerName: "",
                width: 120,
                sortable: true,
                suppressMovable: true,
                cellRendererFramework: ThumbColumnComponent
            },
            {
                field: "thumbOut",
                headerName: "",
                width: 120,
                sortable: true,
                suppressMovable: true,
                cellRendererFramework: ThumbColumnComponent
            },
            {
                field: "InTc",
                headerName: "In",
                width: 120,
                sortable: true,
                suppressMovable: true
            },
            {
                field: "OutTc",
                headerName: "Out",
                width: 120,
                sortable: true,
                suppressMovable: true
            },
            {
                field: "Notes",
                headerName: "Notes",
                sortable: true,
                suppressMovable: true,
                cellRendererFramework: InputComponent,
            },
            {
                field: "Tags",
                headerName: "Tags",
                sortable: true,
                suppressMovable: true,
                taxonomy: this.taxonomy,
                cellRendererFramework: AgTagsComponent
                // {
                //     component: TagsComponent,
                //     moduleImports: [CommonModule, IMFXControlsSelect2Module]
                // }
            }
        ]
    };

    constructor(private cdr: ChangeDetectorRef,
                protected drc: DeleteRowComponent,
                private elementRef: ElementRef) {
        this.gridOptions = <GridOptions>{
            layoutInterval: -1,
            enableColResize: true,
            enableSorting: true,
            toolPanelSuppressGroups: true,
            toolPanelSuppressValues: true,
            getRowHeight: this.getRowHeight,
            onColumnResized: this.onColumnResized,
            rowSelection: 'single',
            context: {
                componentParent: this
            }
        };
    }

    ngOnInit() {
        let tc = this.data.tableColumns
        let c = this.config.columns || [];
        if (c.length) {
            this.data.tableColumns = tc.filter(function (el) {
                return c.indexOf(el.field) > -1;
            });
            this.data.tableColumns.push({
                field: 'delete',
                headerName: '',
                width: 25,
                sortable: false,
                suppressMovable: true,
                cellRendererFramework: DeleteRowComponent
            });
        }
        this.selectMediaTagging();
        this.reloadData.subscribe(event => {
          this.selectMediaTagging();
        });
    }

    ngAfterViewInit() {
        this.config.moduleContext = this;
    };

    ngOnDestroy() {
      this.reloadData.unsubscribe();
    };

    /**
     * add new clip or replace selected clip
     */
    addClip(data, replace, currentTabsId) {
        if (!replace) {
            this.addNewClip(data, currentTabsId);
        }
        else {
            this.replaceClip(data);
        }
        this.saveValid.emit();
    }

    /**
     * add media tagging data into grid
     */
    selectMediaTagging() {
        let self = this;
        this.seriesCountForNewItemId = this.config.series.length;
        let tableRows = this.config.series;
        tableRows.forEach(function (el, ind) {
            el.tagsEditable = true;
            el.indicator = self.getCssClass(el);
            el.thumbIn = self.config.file["THUMBURL"];
            el.thumbOut = self.config.file["THUMBURL"];
            el.timelineId = self.config.id + '_' + ind;
        });
        this.data.tableRows = tableRows;
        this.cdr.detectChanges();
    };

    /**
     *Table methods
     */
    onReady($event) {
        this.resetRowHeights()
        // this.gridOptions.api.resetRowHeights();
    };

    resetRowHeights() {
        this.gridOptions.api.resetRowHeights();
    }

    onBodyScroll($event) {
    };

    onCellFocused($event): any {
        if ($event.column) {
            let model = this.gridOptions.api.getModel();
            let node = model.getRow($event.rowIndex);
            if (node) {
                node.setSelected(true);
                this.setNode({
                    markers: [
                        {time: node.data.InTc},
                        {time: node.data.OutTc}
                    ],
                    id: node.data.customId || node.data.Id
                });
            }
        }
    };

    /**
     * sent emitter for setting markers into player
     */
    setNode(o) {
        this.config.elem.emit('setMarkers', {markers: o.markers, m_type: 'clip', id: o.id});
    };

    getRowHeight(params) {
        // get current module
        let self = this['context'].componentParent;
        let columns = self.gridOptions.api.columnController.allDisplayedColumns;

        var titleColWidth;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].colId == "Tags") {
                titleColWidth = columns[i].actualWidth;
            }
        }
        var resultHeight = 50;
        var calcLength = (28 * (Math.floor((params.data.Tags.join('').length + params.data.Tags.length * 20) * 5 / titleColWidth) + 2));
        if (params.node.flower) {
            resultHeight = 52;
        } else if (self.config.columns.indexOf('thumbIn') > -1) {

            if (params.data.Tags && calcLength > 55) {
                resultHeight = calcLength;
            } else {
                resultHeight = 55;
            }
        } else {
            if (params.data.Tags && calcLength > 55) {
                resultHeight = calcLength;
            } else {
                resultHeight = 55;
            }
        }
        return resultHeight;
    };

    /**
     * add new clip
     */
    addNewClip(el, currentTabsId) {
        let newClip = {
            'Id': 0,
            'InTc': el.startTimecodeString,
            'OutTc': el.stopTimecodeString,
            'Notes': '',
            'Tags': [],
            'TagType': this.config.tagType[0].toUpperCase() + this.config.tagType.slice(1),
            'tagsEditable': true,
            'thumbIn': el.startThumbnail,
            'thumbOut': el.stopThumbnail,
            'indicator': {cssClass: 'green', title: 'iMfxOriginal'},
            'customId': currentTabsId + '_' + this.seriesCountForNewItemId++// el.customId //'_new' + new Date().getTime()
        };
        this.gridOptions.api.addItems([newClip]);
        this.config.series.push(newClip);
        this.config.locatorsComponent.config.series.push(newClip);
        let rowCount = (<any>this.gridOptions).api.rowModel.getRowCount();
        (<any>this.gridOptions).api.selectIndex(rowCount - 1);
        $(this.elementRef.nativeElement).find('.ag-cell textarea')[rowCount - 1].focus();
        el.customId = newClip.customId;
        this.config.elem.emit('clipAdded', el);
        this.setNode({
            markers: [
                {time: newClip.InTc},
                {time: newClip.OutTc}
            ],
            id: newClip.customId
        });
    }

    /**
     * replace selected clip
     */
    replaceClip(el) {
        let clip = this.gridOptions.api.getSelectedRows()[0];
        clip.InTc = el.startTimecodeString;
        clip.OutTc = el.stopTimecodeString;
        clip.thumbIn = el.startThumbnail;
        clip.thumbOut = el.stopThumbnail;
        this.gridOptions.api.refreshView();
        this.config.elem.emit('clipReplaced', {
            oldClipId: clip.customId || clip.timelineId,
            newClip: el
        });
        this.setNode({
            markers: [
                {time: clip.InTc},
                {time: clip.OutTc}
            ],
            id: clip.timelineId
        });
    };

    onColumnResized($event): void {
        if ($event.column.gridOptionsWrapper.gridOptions && !this.myResizing) {
            this.myResizing = true;
            $event.column.gridOptionsWrapper.gridOptions.api.resetRowHeights();
            this.myResizing = false;
        }
    }

    /**
     * add tag into item
     */
    addTag(tag): boolean {
        let res = false;
        let node = this.gridOptions.api.getSelectedNodes()[0];
        if (node) {
            let rowIndex = this.gridOptions.api.getSelectedNodes()[0].rowIndex;
            if (this.config.series[rowIndex].Tags.indexOf(tag) == -1) {
                this.config.series[rowIndex].Tags.push(tag);
                res = true;
            }
        }
        this.saveValid.emit();

        return res;
    }
    /**
     * remove tag from item
     */
    removeTag() {
      this.saveValid.emit();
    }

    /**
     * add notes into item
     */
    addNote(text) {
        let rowIndex = this.gridOptions.api.getSelectedNodes()[0].rowIndex;
        this.config.series[rowIndex].Notes = text;
        this.saveValid.emit();
    }

    /**
     * mark item for delete
     */
    deleteRow(rowId) {
        this.config.series.filter(function (el) {
            return el.Id === rowId;
        }).forEach(function (el) {
            el.Id = el.Id * -1;
        });
        this.saveValid.emit();
    }

    unselectRow() {
        this.gridOptions.api.deselectAll();
    }
    getCssClass(locator) {
      let cssClass = '';
      switch (locator.Origin) {
        case 'iMfxOriginal':
          cssClass = 'green';
          break;
        case 'AvidLocator':
          cssClass = 'red';
          break;
        case 'FCP':
          cssClass = 'yellow';
          break;
        case 'Premier':
          cssClass = 'blue';
          break;
        // AvidRestriction,  AiService
        default: break;
      }
      return {cssClass: cssClass, title: locator.Origin};
    }
}
