/**
 * Created by Sergey Trizna on 13.03.2018.
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';
import {JobStatuses, JobTextStatuses} from "../../../views/workflow/constants/job.statuses";
import {TasksControlButtonsService} from "./services/tcb.service";

@Component({
    selector: 'tasks-control-buttons',
    templateUrl: 'tpl/index.html',
    styleUrls: ['styles/index.scss'],
    providers: [
        TasksControlButtonsService
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TasksControlButtonsComponent {
    @Input('status') private status: number = 0;
    @Input('statusText') private statusText: string = '';
    @Input('taskId') private taskId: number = 0;
    @Input('provider') private provider: any = null;
    public data: any;
    public onReady: EventEmitter<void> = new EventEmitter<void>();
    private compRef = this;
    private btnComp = { visibility: true, enabled : true };
    private btnResm = { visibility: false, enabled : true };
    private btnStrt = { visibility: false, enabled : true };
    private btnAbrt = { visibility: true, enabled : true };
    private btnPaus = { visibility: true, enabled : true };
    private btnPend = { visibility: true, enabled : true };

    constructor(private injector: Injector,
                private tcbService: TasksControlButtonsService,
                private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.provider && this.provider.setTaskStatus.subscribe(res => {
            this.status = res.taskStatus;
            this.taskId = res.taskId;
            this.statusText = res.statusText;
            this.setTaskStatus();
        });
    }

    ngAfterViewInit() {
    }
    setTaskStatus() {
        this.btnComp = { visibility: true, enabled : true };
        this.btnResm = { visibility: false, enabled : true };
        this.btnStrt = { visibility: false, enabled : true };
        this.btnAbrt = { visibility: true, enabled : true };
        this.btnPaus = { visibility: true, enabled : true };
        this.btnPend = { visibility: true, enabled : true };
        switch (this.status) {
            case JobStatuses.READY:
                this.btnComp.visibility = false;
                this.btnResm.visibility = false;
                this.btnStrt.visibility = true;
                this.btnAbrt.enabled = this.btnPaus.enabled = this.btnPend.enabled = false;
                this.statusText = JobTextStatuses.READY;
                break;
            case JobStatuses.PEND:
                this.btnComp.visibility = false;
                this.btnResm.visibility = true;
                this.btnStrt.visibility = false;
                this.btnPaus.enabled = this.btnPend.enabled = false;
                this.statusText = JobTextStatuses.PEND;
                break;
            case JobStatuses.COMPLETED:
                this.btnAbrt.enabled = this.btnComp.enabled = this.btnPaus.enabled = this.btnPend.enabled = false;
                this.statusText = JobTextStatuses.COMPLETED;
                break;
            case JobStatuses.INPROG:
                this.statusText = JobTextStatuses.INPROG;
                // do nothing
                break;
            case JobStatuses.FAILED:
                this.btnComp.enabled = this.btnPaus.enabled = this.btnPend.enabled = false;
                this.statusText = JobTextStatuses.FAILED;
                break;
            case JobStatuses.PAUSED:
                this.btnComp.visibility = false;
                this.btnResm.visibility = true;
                this.btnStrt.visibility = false;
                this.btnPend.enabled = false;
                this.statusText = JobTextStatuses.PAUSED;
                break;
            default:
                this.btnAbrt.enabled = this.btnComp.enabled = this.btnPaus.enabled = this.btnPend.enabled = false;
                this.statusText = '';
                break;
        }
    };
    saveTaskStatus(status) {
        this.tcbService.saveTaskStatus(this.taskId, status).subscribe(res => {
            this.status = res.Status;
            this.setTaskStatus();
            this.cd.detectChanges();
        });
    }
}
