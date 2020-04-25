import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewEncapsulation,
    ViewChild,
    ApplicationRef, Inject, Injector, ComponentFactoryResolver
} from '@angular/core';
import {
    SettingsGroupsService
} from '../../../../../../../services/system.config/settings.groups.service';
import { TranslateService } from 'ng2-translate';
import { RemoveButtonColumn } from './comps/remove.button/remove.button.component';
import { IMFXGrid } from '../../../../../../../modules/controls/grid/grid';
import {
    SlickGridConfig, SlickGridConfigModuleSetups,
    SlickGridConfigOptions, SlickGridConfigPluginSetups
} from '../../../../../../../modules/search/slick-grid/slick-grid.config';
import { SlickGridProvider } from '../../../../../../../modules/search/slick-grid/providers/slick.grid.provider';
import { SlickGridService } from '../../../../../../../modules/search/slick-grid/services/slick.grid.service';
import { SlickGridComponent } from '../../../../../../../modules/search/slick-grid/slick-grid';
import {
    DeleteSettingsGroupsFormatter
} from '../../../../../../../modules/search/slick-grid/formatters/delete-settings-groups/delete.settings.group.formatter';
@Component({
    selector: 'settings-groups-grid',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    entryComponents: [
        IMFXGrid,
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SlickGridProvider,
        SlickGridService,
        SettingsGroupsService
    ]
})

export class SettingsGroupsGridComponent implements OnInit {

    private settingsGroupGridOptions: SlickGridConfig = new SlickGridConfig(<SlickGridConfig>{
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
                externalWrapperEl: "#externalWrapperSubPacSlickGridForInfoPanel",
                selectFirstRow: false
            },
            plugin: <SlickGridConfigPluginSetups>{
                headerRowHeight: 25,
                fullWidthRows: true,
                rowHeight:25,
                forceFitColumns: false
            }
        })
    });


    private data: any = {};
    @ViewChild('overlayGroup') private overlayGroup: any;
    @ViewChild('settingsGroup') private settingsGroup: any;
    @ViewChild('settingsGroupGrid') private settingsGroupGrid: SlickGridComponent;
    private error: boolean = false;

    @Output() private selectSettingsGroup: EventEmitter<any> = new EventEmitter<any>();

    constructor(private cdr: ChangeDetectorRef,
                private settingsGroupsService: SettingsGroupsService,
                private translate: TranslateService,
                @Inject(ComponentFactoryResolver) public compFactoryResolver: ComponentFactoryResolver,
                @Inject(ApplicationRef) public appRef: ApplicationRef,
                @Inject(Injector) public injector: Injector) {

        this.data = {
            tableRows: [],
            tableColumns: [
                {

                    id: 1,
                    name: 'ID',// TODO: i18n
                    field: 'ID',
                    width: 70,
                    resizable: true,
                    sortable: true,
                    multiColumnSort: false
                },
                {
                    id: 2,
                    name:  this.translate.instant('settings_group.name_column'), // TODO: i18n
                    field: 'NAME',
                    width: 300,
                    resizable: true,
                    sortable: true,
                    multiColumnSort: false

                },
                {
                    id: 3,
                    name:  this.translate.instant('settings_group.description_column'), // TODO: i18n
                    field: 'DESCRIPTION',
                    resizable: true,
                    sortable: true,
                    multiColumnSort: false
                },
                {
                    id: 4,
                    name: ' ',
                    field: '',
                    width: 70,
                    resizable: false,
                    sortable: false,
                    formatter: DeleteSettingsGroupsFormatter,
                    multiColumnSort: false,
                    isCustom: true,
                    __deps: {
                        componentFactoryResolver: this.compFactoryResolver,
                        appRef: this.appRef,
                        injector: this.injector
                    }
                }
            ]
        };
    };

    ngOnInit() {
        let self = this;
        setTimeout(() => self.overlayGroup.show(self.settingsGroup.nativeElement));

        this.settingsGroupsService.getSettingsGroupsList().subscribe((res) => {
            self.onGetSettingsGroups(res);
        });

        this.settingsGroupGrid.onGridReady.subscribe(()=>{
            self.settingsGroupGrid.provider.onRowMouseDblClick.subscribe((data)=> {
                delete data.row.id; //delete dublicate lowerCase property 'id'
                self.selectSettingsGroup.emit(data.row);
            });
        });
    }

    isError($event) {
        if ($event) {
            this.error = true;
        }
    }

    clickRepeat() {
        this.error = false;
        let self = this;
        this.overlayGroup.show(this.settingsGroup.nativeElement);
        this.settingsGroupsService.getSettingsGroupsList().subscribe(
            (res) => {
                self.onGetSettingsGroups(res);
            },
            (err) => {
                self.error = true;
                self.overlayGroup.hide(this.settingsGroup.nativeElement);
            });
    }

    onGetSettingsGroups(res){
        this.data.tableRows = res;
        this.cdr.detectChanges();
        this.bindDataToGrid();
        this.overlayGroup.hide(this.settingsGroup.nativeElement);
    }

    addSettingsGroup() {
        this.selectSettingsGroup.emit({
            KEY: '',
            VALUE: null,
            DATA: null
        });
    }

    private bindDataToGrid() {
        this.settingsGroupGrid.provider.setGlobalColumns(this.data.tableColumns);
        this.settingsGroupGrid.provider.setDefaultColumns(this.data.tableColumns, [], true);
        this.settingsGroupGrid.provider.buildPageByData({Data: this.data.tableRows});
        this.settingsGroupGrid.provider.resize();
    }

    ngOnDestroy() {
        this.overlayGroup.hide(this.settingsGroup.nativeElement);
    }

}










