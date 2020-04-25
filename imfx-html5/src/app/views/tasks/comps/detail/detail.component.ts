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
    moduleId: 'workflow-details',
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
export class WorkflowDetailComponent {
    @ViewChild('jointModule') private joint;
    @ViewChild('overlay') private overlay: any;
    @ViewChild('workflow') private workflow: any;
    private selectedTask;
    private gridOptions: GridOptions;
    private error: boolean = false;
    private text: string = '';
    private data = {
        tableRows: [],
        tableColumns: [
            {
                field: 'TIMESTAMP',
                headerName: 'Timestamp',
                sortable: true,
                suppressMovable: true
            },
            {
                field: 'ActionText',
                headerName: 'Action',
                sortable: true,
                suppressMovable: true
            },
            {
                field: 'OPERATOR_ID',
                headerName: 'Operator ID',
                sortable: true,
                suppressMovable: true
            },
            {
                field: 'NOTES',
                headerName: 'Notes',
                sortable: true,
                suppressMovable: true,
                width: 270
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
            enableColResize: true,
            enableSorting: true,
            toolPanelSuppressGroups: true,
            toolPanelSuppressValues: true,
            rowSelection: "single",
            layoutInterval: -1,
            getRowHeight(params) {
                let h = params.data.NOTES
                    ? (18 * (Math.floor(params.data.NOTES.length / 45) + 1))
                    : 25;
                return h > 25 ? h : 25;
            }
        };

    }

    private onResize() {
        this.joint.resize();
    }

    clickBack() {
        this.location.back();
    }

    ngOnInit() {
        this.overlay.hideWhole();
        this.overlay.show(this.workflow.nativeElement);
    }

    ngAfterViewInit() {
        this.joint.on('blank:pointerdown',
            function (event, x, y) {
                paperOpts.dragStartPosition = {x: x, y: y};
            });
        //
        this.joint.on('cell:pointerup blank:pointerup', (cellView, x, y) => {
            delete paperOpts.dragStartPosition;
        });

        this.joint.on('cell:pointerclick', (cellView, evt, x, y) => {
            $('.html-element').removeClass('selected');
            if(cellView.$box){
                cellView.$box.addClass('selected');
                this.selectTask(cellView.model.get('task'))
            }
        });

        let paperOpts: any = {};
        $(this.joint.control).mousemove(function (event) {
            if (paperOpts.dragStartPosition) {
                this.joint.getPaper().setOrigin(
                    event.offsetX - paperOpts.dragStartPosition.x,
                    event.offsetY - paperOpts.dragStartPosition.y);
            }
        });

        let self = this;
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

            for (let task of this.details.Tasks) {
                tasks.push(this.joint.addBlock({
                    label: task.TaskTypeText,
                    status: task.StatusText,
                    progress: task.Progress,
                    task: task
                }));
            }

            for (let task of this.details.TaskLinks) {
                let source = tasks.filter(el => el.attributes.task.Id == task.ParentTaskId)[0];
                let target = tasks.filter(el => el.attributes.task.Id == task.TaskId)[0];
                if (source && target) {
                    this.joint.connectModel2Model(source, target, 'line', {
                        attrs: {
                            '.link-tools .tool-remove': {
                                display: 'none'
                            }
                        }
                    });
                }
            }

            setTimeout(() => {
                this.joint.drawAll();
                self.overlay.hide(self.workflow.nativeElement);
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
        this.overlay.hide(this.workflow.nativeElement);
        this.error = true;
        this.cdr.markForCheck();
    }

    selectTask(task) {
        this.selectedTask = task;
        this.workflowService.getWorkflowTaskDetails(task.Id).subscribe((res) => {
            let tableRows = res.map((el) => {
                return {
                    NOTES: el.NOTES,
                    OPERATOR_ID: el.OPERATOR_ID,
                    TIMESTAMP: new Date(el.TIMESTAMP).toLocaleString(),
                    ActionText: el.ActionText
                }
            });

            this.data.tableRows = tableRows;
            this.cdr.detectChanges();
        });
    }
}
