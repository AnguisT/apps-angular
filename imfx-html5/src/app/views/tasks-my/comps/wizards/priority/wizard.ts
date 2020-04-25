import {ChangeDetectionStrategy, Component, Inject, Injector, ViewEncapsulation, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {NotificationService} from "../../../../../modules/notification/services/notification.service";
import {MyTasksWizardPriorityComponentProvider} from "./providers/wizard.provider";
import {WorkflowChangePriorityModel} from "./types";
import {SlickGridProvider} from "../../../../../modules/search/slick-grid/providers/slick.grid.provider";
import {JobService} from "../../../services/jobs.service";
import {TasksMySlickGridProvider} from "../../../providers/slick.grid.provider";


@Component({
    selector: 'wf-wizard-priority-modal',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {provide: JobService, useClass: JobService},
        {provide: SlickGridProvider, useClass: TasksMySlickGridProvider}
    ]
})

export class MyTasksWizardPriorityComponent {
    @ViewChild('modalFooterTemplate') private modalFooterTemplate;
    // @ViewChild('controlMediaTypeFiles') controlMTF: IMFXControlsLookupsSelect2Component;
    // @ViewChild('versionWizardMediaGrid') public grid: VersionWizardMediaComponent;
    private data: any;
    private model: WorkflowChangePriorityModel = {
        Jobs: [],
        Priority: 0,
        UpdateChildren: true
    };
    private sgp;

    constructor(private injector: Injector,
                public provider: MyTasksWizardPriorityComponentProvider,
                private service: JobService,
                private router: Router,
                @Inject(NotificationService) protected notificationRef: NotificationService) {
        this.router.events.subscribe(() => {
            this.closeModal();
        });
        // ref to component
        this.provider.moduleContext = this;
        // modal data
        this.data = this.injector.get('modalRef');
    }

    ngOnInit() {
    }

    onShow() {
        this.sgp = this.injector.get(SlickGridProvider);
        this.model.Jobs = this.sgp.getFieldsOfSelectedRows('ID');
    }

    isSelectedPriority(val): boolean {
        return this.model.Priority == val;
    }

    onSelectPriority(val) {
        this.model.Priority = val;
    }

    onChangeUpdateChildren($event) {
        this.model.UpdateChildren = $event.target.checked;
    }

    isUpdateChildren(): boolean {
        return this.model.UpdateChildren;
    }

    apply() {
        let self = this;
        this.service.changePriority(this.model).subscribe(() => {
            (<TasksMySlickGridProvider>self.sgp).refreshGrid();
            self.notificationRef.notifyShow(1, 'version.wizard.priority.success');
            self.closeModal();
        }, (err) => {
            self.notificationRef.notifyShow(2, 'version.wizard.priority.error')
        });
    }

    closeModal() {
        this.data.hide();
        this.provider.modalIsOpen = false;
    }
}
