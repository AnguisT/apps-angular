/**
 * Created by Sergey Trizna on 06.02.2016.
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { XMLService } from '../../../services/xml/xml.service';
import { Observable } from 'rxjs/Rx';
import { XmlSchemaListTypes } from '../../controls/xml.tree/types';
import { OverlayComponent } from '../../overlay/overlay';
import { IMFXMLTreeComponent } from '../../controls/xml.tree/imfx.xml.tree';
import { GridOptions } from 'ag-grid';
import { TranslateService } from 'ng2-translate';
import { SlickGridProvider } from '../slick-grid/providers/slick.grid.provider';
import { SlickGridService } from '../slick-grid/services/slick.grid.service';
import {
    SlickGridConfigOptions,
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigPluginSetups
} from '../slick-grid/slick-grid.config';
import { BsModalService } from 'ngx-bootstrap';
import { SlickGridComponent } from '../slick-grid/slick-grid';
import { SlickGridColumn } from '../slick-grid/types';

@Component({
    selector: 'xml',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SlickGridProvider,
        SlickGridService,
    ]
})

export class XMLComponent {
    public data: any;
    public modalService;
    public onReady: EventEmitter<void> = new EventEmitter<void>();
    public onSelectEvent: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('xmlTree') public xmlTree: IMFXMLTreeComponent;
    @ViewChild('overlayXML') public overlayXML: OverlayComponent;
    @ViewChild('tableSplit') public tableSplit: any;
    @ViewChild('filterInput') public filterInput: any;
    @ViewChild('slickGridComp') private slickGridComp: SlickGridComponent;
    private schemas: any = [];
    private selectedSchemaModel = {};
    private selectedXmlModel = {};
    private selectedSchemaFormList: any = null;
    private type;
    private selectedIndex;
    private modalData;
    // private dataTable = {
    //     tableRows: [],
    //     tableColumns: [
    //         {
    //             field: 'Name',
    //             headerName: this.translate.instant('ng2_components.ag_grid.tbl_header_xml_field_schema_name'),
    //             sortable: true
    //         },
    //         {
    //             field: 'Description',
    //             headerName: this.translate.instant('ng2_components.ag_grid.tbl_header_xml_field_description'),
    //             sortable: true
    //         },
    //     ]
    // };

    // private gridOptions = <GridOptions>{
    //     layoutInterval: -1,
    //     enableColResize: true,
    //     enableSorting: true,
    //     rowSelection: 'single',
    //     moduleContext: this,
    //     context: {
    //         componentParent: this
    //     },
    //     onGridReady: function (params) {
    //         params.api.sizeColumnsToFit();
    //     },
    //     icons: {
    //         sortAscending: '<i class="icons-up icon"></i>',
    //         sortDescending: '<i class="icons-down icon"></i>'
    //     }
    // };

    /**
     * Grid
     * @type {GridConfig}
     */
    private searchGridConfig: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
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
            },
            plugin: <SlickGridConfigPluginSetups>{
                forceFitColumns: true
            }
        })
    });

    private dataTable = {
        tableRows: [],
        tableColumns: <SlickGridColumn[]>[
            {
                id: '0',
                field: 'Name',
                name: this.translate.instant('ng2_components.ag_grid.tbl_header_xml_field_schema_name'),
                width: 100,
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
            {
                id: '1',
                field: 'Description',
                name: this.translate.instant('ng2_components.ag_grid.tbl_header_xml_field_description'),
                width: 100,
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
        ]
    };

    constructor(private xmlService: XMLService,
                private injector: Injector,
                private cdr: ChangeDetectorRef,
                private translate: TranslateService) {
        this.data = this.injector.get('modalRef');
        this.modalData = this.data.getData();
        this.modalService = this.injector.get(BsModalService);
    }

    ngAfterViewInit() {
        let self = this;

        this.xmlService.getSchemaList()
            .subscribe((result: XmlSchemaListTypes) => {
                self.schemas = result.sort(function (ob1, ob2) {
                    let na = ob1.Name.toLowerCase(), nb = ob2.Name.toLowerCase();
                    if (na < nb)
                        return -1;
                    if (na > nb)
                        return 1;
                    return 0;
                });

                setTimeout(() => {
                    self.onReady.emit();
                    self.dataTable.tableRows = self.schemas;
                    self.bindDataToGrid();
                    self.cdr.detectChanges();
                });
            });
    }

    bindDataToGrid() {
        let self = this;
        // this.onReady.subscribe(() => {
        if (this.slickGridComp) {
            this.slickGridComp.onGridReady.subscribe((ready) => {
                console.log(true);
                self.slickGridComp.provider.setGlobalColumns(self.dataTable.tableColumns);
                self.slickGridComp.provider.setDefaultColumns(self.dataTable.tableColumns, [], true);
                self.slickGridComp.provider.buildPageByData({Data: self.dataTable.tableRows});

                self.slickGridComp.provider.onRowMouseClick.subscribe((data) => {
                    console.log(data);
                    // self.onSelect(data);
                });
            });
        }
    }

    onSelect(schema, i) {
        this.selectedIndex = i;
        if (this.tableSplit) {
            this.overlayXML.show($(this.tableSplit.nativeElement));
        } else {
            // if(this.data)
            //   schema = schema.data;
        }
        let self = this;
        this.selectedSchemaFormList = schema;
        this.xmlService.getXmlData(schema.Id)
          .subscribe((result: any) => {
            self.selectedSchemaModel = result.SchemaModel;
            self.selectedXmlModel = result.XmlModel;
            let selected = {
                schema: schema,
                result: result
            }
            self.onSelectEvent.emit(selected);
            // self.data.contentView.instance.onSelect(schema, result);
            // self.data.config.componentContext.onSelect(schema, result);
            if (self.tableSplit) {
              self.overlayXML.hide($(this.tableSplit.nativeElement));
            }
            self.cdr.markForCheck();
          }, (err) => {
            self.overlayXML.hide($(this.tableSplit.nativeElement));
            self.cdr.markForCheck();
          }, () => {
            self.overlayXML.hide($(this.tableSplit.nativeElement));
            self.cdr.markForCheck();
          });
    }

    fillByString(str: string) {
        this.xmlTree.fillFromString(str);
    }

    getShemaById(id): Observable<any> {
        return Observable.create((observer) => {
            this.xmlService.getXmlData(id)
                .subscribe(result => {
                    observer.next(result);
                });
        });
    }
    resetSelection() {
      this.selectedSchemaModel = {};
      this.selectedXmlModel = {};
      this.selectedSchemaFormList = null;
      this.selectedIndex = undefined;
      this.cdr.markForCheck();
    }

    setSelectedSchemaAndModel(schema, model) {
        this.selectedSchemaModel = schema;
        this.selectedXmlModel = model;
    }

    private showOverlay = false;
    toggleOverlay(show) {
      this.showOverlay = show;
      this.cdr.markForCheck();
    }

    // onSave() {
    //     this.data.config.componentContext.onSave();
    // }

    setType(type) {
        this.type = type;
    }

    cdrFired() {
        let self = this;
        let valueOfSearch = this.filterInput.nativeElement.value;
        let filter = this.schemas.filter((el) => {
            let element = el.Name.toLowerCase();
            let value = valueOfSearch.toLowerCase();
            if (element.indexOf(value) !== -1) {
                return true;
            }
            return false;
        });
        this.dataTable.tableRows = filter;
        this.cdr.markForCheck();
    }
}
