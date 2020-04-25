import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import {Router} from "@angular/router";
import {NotificationService} from "../../../../../modules/notification/services/notification.service";
import {TasksWizardAbortComponentProvider} from "./providers/wizard.provider";

@Component({
    selector: 'wf-wizard-abort-modal',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TasksWizardAbortComponent {
    @ViewChild('modalFooterTemplate') private modalFooterTemplate;
    private data: any;

    constructor(private cdr: ChangeDetectorRef,
                private injector: Injector,
                public provider: TasksWizardAbortComponentProvider,
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

    // ngOnChanges() {
    //     this.cdr.detectChanges();
    // }

    onShow() {
        // this.provider.updateModel('MEDIA_TYPE_text', this.getMediaTypes().Video);
        // this.grid.getSearchGridProvider().buildPage(this.provider.getSearchModel())
        // .subscribe((data) => {
        //     this.provider.setRows(data);
        // })
    }

    onSelect() {

    }

    isSelected(): boolean {
        return false;
    }

    /**
     * Hide modal
     */
    closeModal() {
        this.data.hide();
        this.provider.modalIsOpen = false;
    }
}
