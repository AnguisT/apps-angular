import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {Router} from "@angular/router";
import {NotificationService} from "../../../../modules/notification/services/notification.service";
import {TasksUsersProvider} from "./providers/users.provider";
import {TasksSlickGridProvider} from "../../providers/tasks.slick.grid.provider";
import {SlickGridRowData} from "../../../../modules/search/slick-grid/types";
import {TreeStandardListTypes} from "../../../../modules/controls/tree/types";
import {IMFXControlsTreeComponent} from "../../../../modules/controls/tree/imfx.tree";
import {ModalConfig} from "../../../../modules/modal/modal.config";
import {AppointmentComponent} from "./comps/appointment/appointment";
import {ModalComponent} from "../../../../modules/modal/modal";
import {LookupSearchService} from "../../../../services/lookupsearch/common.service";
import {AreasSitesService} from "../../../../services/areas/areas.sites";
import {SlickGridProvider} from "../../../../modules/search/slick-grid/providers/slick.grid.provider";
import {AdvancedSearchModel} from "../../../../modules/search/grid/models/search/advanced.search";
import {SearchModel} from "../../../../modules/search/grid/models/search/search";
import {BaseSearchModel} from "../../../../modules/search/grid/models/search/base.search";
import {DebounceProvider} from "../../../../providers/common/debounce.provider";
import {WorkflowSlickGridProvider} from "../../../workflow/providers/workflow.slick.grid.provider";
import {JobService} from "../../../workflow/services/jobs.service";

@Component({
    selector: 'workflow-dd-users',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    providers: [
        LookupSearchService,
        AreasSitesService
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TasksUsersComponent {
    @Input('slickGridProvider') slickGridProvider: TasksSlickGridProvider;
    @ViewChild('tree') private tree: IMFXControlsTreeComponent;
    @ViewChild('appointmentModal') private appointmentModal: ModalComponent;
    // /**
    //  * Control for modal
    //  * @type {ModalConfig}
    //  */
    // private appointmentModalConfig = <ModalConfig>{
    //     componentContext: this,
    //     options: {
    //         modal: {
    //             title: 'tasks.appointments.title',
    //             size: 'sm',
    //             top: '47%',
    //             isFooter: false,
    //             height: '50vh',
    //             max_height: '300px'
    //         },
    //         content: {
    //             view: AppointmentComponent,
    //         }
    //     }
    // };
    private users: any[] = [];
    private rows: SlickGridRowData = <SlickGridRowData>[];

    constructor(private cdr: ChangeDetectorRef,
                private injector: Injector,
                public provider: TasksUsersProvider,
                private router: Router,
                private lookupSearchService: LookupSearchService,
                private areasSitesService: AreasSitesService,
                private debounceProvider: DebounceProvider,
                private jobService: JobService,
                @Inject(NotificationService) protected notificationRef: NotificationService,) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.tree.onDrop.subscribe((event) => {
            if (this.isAccessibleNode(event)) {
                this.onDrop(event);
                this.highlightOff(event);
            }
        });
        this.tree.onDragEnter.subscribe((event) => {
            // let func = this.debounceProvider.debounce(() => {
                if (this.isAccessibleNode(event)) {
                    this.highlightOn(event);
                }
            // }, 300);
            // func();
        });
        // this.tree.onDragOver.subscribe((event) => {
        //     if (this.isAccessibleNode(event)) {
        //         this.highlightOn(event);
        //     }
        // });
        this.tree.onDragLeave.subscribe((event) => {
            // let func = this.debounceProvider.debounce(() => {
                this.highlightOff(event);
            // }, 300);
            // func();
        });

        this.tree.onRenderNode.subscribe((d) => {
            let data = d.data;
            let node = data.node;
            let $span = $(node.span);
            let customClass = 'custom-style ' + node.data.dirtyObj.NodeType;
            node.extraClasses = customClass;
            $span.addClass(customClass);
        });

        this.tree.onSelect.subscribe((event) => {
            setTimeout(() => {

                let selectedNodes = this.tree.getCheckedNodes();
                this.provider.selectedNodes = selectedNodes;
                let sgp: SlickGridProvider = this.injector.get(SlickGridProvider);
                sgp.hookSearchModel = (searchModel: SearchModel) => {
                    // reset preview search
                    searchModel.setAdvanced(searchModel.removeAdvancedItemByDBField('SCHEDULE'));
                    let ids = [];
                    let asm = new AdvancedSearchModel();
                    asm.setDBField('SCHEDULE');
                    asm.setField('Schedule');
                    asm.setOperation('=');
                    $.each(selectedNodes, (k, node) => {
                        let dirtyData = node.data.dirtyObj;
                        let id = dirtyData.NodeType == 'User' ? dirtyData.Id * (-1) : dirtyData.Id;
                        ids.push(id);
                    });
                    asm.setValue(ids);
                    searchModel.setAdvancedItem(asm);

                    return searchModel;
                };
                if (!sgp.lastSearchModel) {
                    sgp.lastSearchModel = new SearchModel();
                    let bs = new BaseSearchModel();
                    bs.setValue("");
                    sgp.lastSearchModel.setBase(bs);
                }
                if (selectedNodes.length > 0) {
                    sgp.buildPage(sgp.lastSearchModel);
                }
            });
        });

        this.lookupSearchService.getLookup('job-schedule-nodes')
            .subscribe(
                (data: any) => {
                    let normData: TreeStandardListTypes = this.tree.turnArrayOfObjectToStandart(data, {
                        key: 'Id',
                        title: 'NodeName',
                        children: 'Children',
                    });
                    this.users = normData;
                    this.tree.setSource(this.users);
                    // setTimeout(() => {
                    //     this.tree.selectAll();
                    // });

                    // new Promise((resolve, reject) => {
                    //     resolve();
                    // }).then(
                    //     () => {
                    //
                    //     },
                    //     (err) => {
                    //         console.log(err);
                    //     }
                    // );
                },
                (error: any) => {
                    console.error('Failed', error);
                }
            );
    }

    /**
     * Filter of data
     * @param $event
     */
    filter($event) {
        this.tree.filterCallback($event.target.value, function (str, node) {
            if (node.title != null) {
                let normTitle = str.toLowerCase();
                let normNodeTitle = node.title.toLowerCase();
                if (normNodeTitle.indexOf(normTitle) != -1 || node.selected == true) {
                    return true;
                }
                return false;
            }
            return false;
        });
    }

    onDrop(event) {
        let mode = this.slickGridProvider.wfdragmode;
        let rows = !mode ? this.slickGridProvider.getSelectedRows() : this.slickGridProvider.item;
        let node = this.tree.getNodeByEvent(event);

        let jobs = [];
        if (!mode) {
            jobs = rows.map((n) => {
                return n.ID;
            });
        } else {
            jobs = [rows.ID];
        }

        if (node) {
            let nodeObj = node.data.dirtyObj;
            let route = 'tasks';
            this.assign(nodeObj.Id, nodeObj.NodeType, jobs, 'pass', route);
        }
    }

    assign(id: number, type: string, jobs: number[] = [], action: 'pass' | 'share' | 'passclear', route) {
        this.jobService.assign(id, type, jobs, action, route).subscribe((resp) => {
            this.notificationRef.notifyShow(1, "tasks.success_assign");
            (<TasksSlickGridProvider>this.slickGridProvider).refreshGrid();
        }, () => {
            this.notificationRef.notifyShow(2, "tasks.error_assign");
        });
    }

    // onDrop(event) {
    //     let rows = this.slickGridProvider.getSelectedRows();
    //     let node = this.tree.getNodeByEvent(event);
    //
    //     let appointmentContent = this.appointmentModal.getContent();
    //     // debugger
    //     this.appointmentModal.onShow.subscribe(() => {
    //         appointmentContent.onShow(rows, node);
    //         $.each(this.appointmentModal.onShow.observers, (k, o) => {
    //             (<any>o).unsubscribe();
    //         });
    //     });
    //     this.appointmentModal.show();
    // }

    onSelect($event) {
    }

    selectAll() {
        this.tree.selectAll();
    }

    private isAccessibleNode($event): boolean {
        return true;
        // debugger
        // let node = this.tree.getNodeByEvent($(event));
        // if (node && node.data.dirtyObj && node.data.dirtyObj.NodeType != "Area") {
        //     return true
        // }
        //
        // return false
    }

    private highlightOff(event) {
        let trgt = this.getEventTrgt(event);
        if (!trgt.hasClass('fancytree-node')) {
            trgt = trgt.find('.fancytree-node').eq(0);
        }
        trgt.removeClass('tree-dragging');
    }

    private highlightOn(event) {
        let trgt = this.getEventTrgt(event);
        trgt.addClass('tree-dragging');
    }

    private getEventTrgt(event) {
        let trgt = $(event.target);
        if (!trgt.hasClass('fancytree-node')) {
            trgt = trgt.find('.fancytree-node').eq(0);
            if (!trgt.length) {
                trgt = $(event.target).parent().parent();
            }
        }

        return trgt
    }
}
