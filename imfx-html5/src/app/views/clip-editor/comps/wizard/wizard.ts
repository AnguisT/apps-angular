import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector, TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../modules/notification/services/notification.service';
import {MediaTypesWizard, MediaWizardProvider} from './providers/wizard.provider';
import {AdvancedCriteriaType} from '../../../../modules/search/advanced/types';
import {IMFXControlsLookupsSelect2Component} from '../../../../modules/controls/select2/imfx.select2.lookups';
import {WizardMediaTableComponent} from './comps/media/wizard.media.table.component';
import {ClipEditorService} from '../../../../services/clip.editor/clip.editor.service';
import {IMFXModalComponent} from "../../../../modules/imfx-modal/imfx-modal";
import {ClipEditorMediaSlickGridProvider} from "./comps/media/providers/clipedtor.slick.grid.provider";

@Component({
    selector: 'version-wizard-modal',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        MediaWizardProvider
    ]
})

export class MediaWizardComponent {
    @ViewChild('wizardMediaTableGrid') public grid: WizardMediaTableComponent;
    @ViewChild('controlUsageTypes') private controlUsageTypes: IMFXControlsLookupsSelect2Component;
    @ViewChild('controlMediaTypeFiles') private controlMediaTypeFiles: IMFXControlsLookupsSelect2Component;
    @ViewChild('modalFooterTemplate', {read: TemplateRef}) modalFooterTemplate: TemplateRef<any>;
    private modalRef: IMFXModalComponent;

    constructor(private cdr: ChangeDetectorRef,
                private injector: Injector,
                public provider: MediaWizardProvider,
                private router: Router,
                private ceService: ClipEditorService,
                @Inject(NotificationService) protected notificationRef: NotificationService) {
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

    ngOnChanges() {
        this.cdr.detectChanges();
    }

    onShow() {
        this.grid.getSearchGridProvider().buildPage(this.provider.getSearchModel());
        (<ClipEditorMediaSlickGridProvider>this.grid.slickGridComp.provider).models = this.provider.models;
    }

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
        this.grid.getSearchGridProvider().buildPage(this.provider.getSearchModel());
    }

    /**
     * Get model by field
     * @param field
     * @returns {AdvancedCriteriaType}
     */
    getModel(field): AdvancedCriteriaType {
        return this.provider.getModel(field);
    }

    /**
     * Get available media types
     * @returns {VersionMediaTypesWizard}
     */
    getMediaTypes(): MediaTypesWizard {
        return this.provider.getMediaTypes();
    }

    /**
     * Hide modal
     */
    closeModal() {
        this.modalRef.hide();
        this.provider.modalIsOpen = false;
    }

    /**
     * Hide modal
     */
    showModal() {
        this.provider.showModal();
    }

    addMediaToList() {
        this.ceService.addToMediaList(this.ceService.getItemForAddToMediaList());
        this.closeModal();
    }

    getRows(): Array<any> {
        return this.provider.getRows();
    }
}
