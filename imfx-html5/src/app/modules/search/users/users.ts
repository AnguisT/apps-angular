/**
 * Created by Sergey Trizna on 10.01.2016.
 */
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { LookupSearchUsersService } from '../../../services/lookupsearch/users.service';
import * as $ from 'jquery';
import { Observable } from 'rxjs/Rx';
import { UserLookupType, UsersListLookupTypes } from '../../../services/lookupsearch/types';
import {
    AdvancedCriteriaControlLookupUsersModalDataType
} from '../advanced/comps/criteria/comps/controls/comps/container/comps/lookupsearch/users.modal/types';
import { GridOptions } from 'ag-grid';
import { TranslateService } from 'ng2-translate';
import { SlickGridProvider } from '../slick-grid/providers/slick.grid.provider';
import { SlickGridService } from '../slick-grid/services/slick.grid.service';
import { SlickGridComponent } from '../slick-grid/slick-grid';
import {
    SlickGridConfigOptions,
    SlickGridConfig,
    SlickGridConfigModuleSetups,
    SlickGridConfigPluginSetups
} from '../slick-grid/slick-grid.config';
import { SlickGridColumn } from '../slick-grid/types';
import { IMFXGrid } from '../../controls/grid/grid';

@Component({
    selector: 'users-list',
    templateUrl: 'tpl/index.html',
    styleUrls: ['styles/index.scss'],
    providers: [
        LookupSearchUsersService,
        SlickGridProvider,
        SlickGridService,
    ],
    entryComponents: [
        IMFXGrid
    ],
    encapsulation: ViewEncapsulation.None
})

export class UsersComponent {
    public data: any;
    public onReady: EventEmitter<void> = new EventEmitter<void>();
    public onSelectEvent: EventEmitter<any> = new EventEmitter<any>();
    private compRef = this;
    private paramsOfSearch = '';
    private users: UsersListLookupTypes = [];
    @ViewChild('filterInput') private filterInput: any;
    @Input('isModal') private isModal: boolean = true;

    @ViewChild('slickGridComp') private slickGridComp: SlickGridComponent;

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

    // private dataTable = {
    //     tableRows: [],
    //     tableColumns: [
    //         {
    //             field: 'UserId',
    //             headerName: this.translate.instant('ng2_components.ag_grid.tbl_header_user_id'),
    //             sortable: true,
    //         },
    //         {
    //             field: 'Forename',
    //             headerName: this.translate.instant('ng2_components.ag_grid.tbl_header_surname'),
    //             sortable: true,
    //         },
    //         {
    //             field: 'Surname',
    //             headerName: this.translate.instant('ng2_components.ag_grid.tbl_header_forename'),
    //             sortable: true,
    //         },
    //     ]
    // };

    private dataTable = {
        tableRows: [],
        tableColumns: <SlickGridColumn[]>[
            {
                id: '0',
                name: this.translate.instant('ng2_components.ag_grid.tbl_header_user_id'),
                field: 'UserId',
                width: 100,
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
            {
                id: '1',
                name: this.translate.instant('ng2_components.ag_grid.tbl_header_surname'),
                field: 'Forename',
                width: 100,
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
            {
                id: '2',
                name: this.translate.instant('ng2_components.ag_grid.tbl_header_forename'),
                field: 'Surname',
                width: 100,
                resizable: true,
                sortable: true,
                multiColumnSort: false
            },
        ]
    };

    constructor(private injector: Injector,
                private lookupSearchUserService: LookupSearchUsersService,
                private cdr: ChangeDetectorRef,
                private translate: TranslateService) {
    }

    ngOnInit() {
        let self = this;
        this.getUsers().subscribe((users: UsersListLookupTypes) => {
            self.users = users;
            self.dataTable.tableRows = self.users;
            this.bindDataToGrid();
            self.cdr.detectChanges();
        });
    }

    ngAfterViewInit() {
        if (this.isModal) {
            this.data = this.injector.get('modalRef');
        }
    }

    bindDataToGrid() {
        let self = this;
        this.onReady.subscribe(() => {
            self.slickGridComp.provider.setGlobalColumns(self.dataTable.tableColumns);
            self.slickGridComp.provider.setDefaultColumns(self.dataTable.tableColumns, [], true);
            self.slickGridComp.provider.buildPageByData({Data: self.dataTable.tableRows});

            self.slickGridComp.provider.onRowMouseClick.subscribe((data) => {
                self.onSelect(data);
            });
        });
    }

    onSelect(user) {
        if (this.isModal) {
            this.onSelectEvent.emit(
                <AdvancedCriteriaControlLookupUsersModalDataType>{
                user: user.row,
                paramsOfSearch: this.paramsOfSearch,
                users: this.users,
            });
        }
    }

    setData(userData: AdvancedCriteriaControlLookupUsersModalDataType) {
        this.filterInput.nativeElement.value = userData.paramsOfSearch;
        this.cdr.detectChanges();
    }

    findUserByUserId(id: string): UserLookupType | boolean {
        let res: UserLookupType;
        $.each(this.users, (key, user) => {
            if (id === user.UserId) {
                res = user;
                return;
            }
        });

        return res || false;
    }

    private onFilter() {
        let self = this;
        this.paramsOfSearch = this.filterInput.nativeElement.value;
        let filter = this.users.filter((el) => {
            let element = el.UserId.toLowerCase();
            let value = self.paramsOfSearch.toLowerCase();
            if (element.indexOf(value) !== -1) {
                return true;
            }
            return false;
        });
        if (filter.length === 0) {
            this.slickGridComp.provider.clearData(true);
        } else {
            this.dataTable.tableRows = filter;
            this.slickGridComp.provider.setData(self.dataTable.tableRows, true);
            this.cdr.markForCheck();
        }
    }

    private getUsers(): Observable<UsersListLookupTypes> {
        return Observable.create((observer) => {
            this.lookupSearchUserService.getUsers().subscribe(
                (users: any) => {
                    setTimeout(() => {
                        this.onReady.emit();
                    });

                    observer.next(users);
                },
                (error: any) => {
                    console.error('Failed', error);
                    observer.error(error);
                }
            );
        });

    }
}
