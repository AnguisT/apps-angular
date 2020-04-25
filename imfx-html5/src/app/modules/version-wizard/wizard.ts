import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {Router} from "@angular/router";
import {NotificationService} from "../../modules/notification/services/notification.service";
import {VersionMediaTypesWizard, VersionWizardProvider} from "./providers/wizard.provider";
import {AdvancedCriteriaType} from "../../modules/search/advanced/types";
import {IMFXControlsLookupsSelect2Component} from "../../modules/controls/select2/imfx.select2.lookups";
import {VersionWizardMediaComponent} from "./comps/media/version.wizard.media.component";
import {appRouter} from '../../constants/appRouter';
import {IMFXModalComponent} from "../../modules/imfx-modal/imfx-modal";
import {ClipEditorService} from "../../services/clip.editor/clip.editor.service";

@Component({
    selector: 'version-wizard-modal',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VersionWizardComponent {
    @ViewChild('versionWizardMediaGrid') public grid: VersionWizardMediaComponent;
    @ViewChild('modalFooterTemplate', {read: TemplateRef}) modalFooterTemplate: TemplateRef<any>;
    @ViewChild('controlUsageTypes') private controlUsageTypes: IMFXControlsLookupsSelect2Component;
    @ViewChild('controlMediaTypeFiles') private controlMediaTypeFiles: IMFXControlsLookupsSelect2Component;
    private modalRef: IMFXModalComponent;

    constructor(private cdr: ChangeDetectorRef,
                private injector: Injector,
                @Inject(VersionWizardProvider) public provider: VersionWizardProvider,
                private router: Router,
                @Inject(NotificationService) protected notificationRef: NotificationService,
                public clipEditorService: ClipEditorService) {
        this.router.events.subscribe(() => {
            this.closeModal();
        });
        // ref to component
        this.provider.moduleContext = this;
        // modal data
        this.modalRef = this.injector.get('modalRef');
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.provider.updateModel('MEDIA_TYPE_text', this.getMediaTypes().Video);
            this.grid.slickGridComp.provider.buildPage(this.provider.getSearchModel());
        })
    }

    // ngOnChanges() {
    //     this.cdr.detectChanges();
    // }

    /**
     * Update model by field
     * @param field
     * @param value
     */
    updateModel(field, value, select2Control?: string): void {
        if (select2Control) {
            value = this[select2Control].getSelected().join('|');
        }
        this.provider.updateModel(field, value);
        this.grid.slickGridComp.provider.buildPage(this.provider.getSearchModel());
    }

    /**
     * Get model by field
     * @param field
     * @returns {AdvancedCriteriaType}
     */
    getModel(field): AdvancedCriteriaType {
        return this.provider.getModel(field)
    }

    /**
     * Get available media types
     * @returns {VersionMediaTypesWizard}
     */
    getMediaTypes(): VersionMediaTypesWizard {
        return this.provider.getMediaTypes();
    }

    /**
     * Hide modal
     */
    closeModal() {
        this.modalRef.hide();
        this.provider.modalIsOpen = false;
    }

    goToClipEditor() {
        let rows: Array<any> = this.getRows();
        // set rows
        this.clipEditorService.setSelectedRows(rows);

        // set isAudio flag
        let isAudio = this.getModel('MEDIA_TYPE_text').Value === this.provider.getMediaTypes().Audio ? true : false;
        this.clipEditorService.setIsAudio(isAudio);

        // this.router.navigate(["clip-editor", this.provider.selectedVersionId])
        this.router.navigate(
            [
                appRouter.clip_editor_version.substr(
                    0,
                    appRouter.clip_editor_version.lastIndexOf('/')
                ),
                this.provider.selectedVersionId
            ]
        );
    }

    getRows(): Array<any> {
        let res = [];
        if(this.grid.slickGridComp.isGridReady){
            res = this.grid.slickGridComp.provider.getOriginalData();
        }
        return res;
    }
}
