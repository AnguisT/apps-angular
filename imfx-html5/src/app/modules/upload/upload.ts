/**
 * Created by Sergey Trizna on 02.09.2017.
 */
import {Component, ElementRef, Injector, TemplateRef, ViewChild, ViewEncapsulation} from "@angular/core";
import {BasketService} from "../../services/basket/basket.service";
import {LookupService} from "../../services/lookup/lookup.service";
import * as $ from "jquery";
import {UploadProvider} from "./providers/upload.provider";
import {IMFXControlsLookupsSelect2Component} from "../controls/select2/imfx.select2.lookups";
import {Select2ItemType} from "../controls/select2/types";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {IMFXModalComponent} from "../imfx-modal/imfx-modal";
import {IMFXModalProvider} from "../imfx-modal/proivders/provider";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {IMFXModalEvent} from "../imfx-modal/types";
// let BDC = require('binary-data-chunking');
require('./libs/filedrop/filedrop.js');

@Component({
    selector: 'imfx-upload-modal',
    templateUrl: 'tpl/upload.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        // ControlToAdvTransfer,
        BasketService,
        LookupService,
        IMFXModalProvider,
        BsModalRef,
        BsModalService,
    ]
})

export class UploadComponent {
    @ViewChild('modalFooterTemplate', {read: TemplateRef}) modalFooterTemplate: TemplateRef<any>;
    public isValidForm: boolean = false;
    @ViewChild('inputFile') public inputFile;
    @ViewChild('inputFilename') public inputFilename;
    @ViewChild('controlWorkflow') public controlWorkflow: IMFXControlsLookupsSelect2Component;
    @ViewChild('controlMediaTypes') public controlMediaTypes: IMFXControlsLookupsSelect2Component;
    @ViewChild('controlAspectRatio') public controlAspectRatio: IMFXControlsLookupsSelect2Component;
    @ViewChild('controlTvStandards') public controlTvStandards: IMFXControlsLookupsSelect2Component;
    @ViewChild('controlUsageTypes') public controlUsageTypes: IMFXControlsLookupsSelect2Component;
    @ViewChild('controlItemTypes') public controlItemTypes: IMFXControlsLookupsSelect2Component;
    @ViewChild('controlNotes') public controlNotes;
    @ViewChild('controlVersionTitle') public controlVersionTitle;
    // data of modal
    public modalRef: IMFXModalComponent;
    @ViewChild('overlayExport') private overlay;
    @ViewChild('overlayWrapper') private wrapper;
    private firstStep = 0;
    private lastStep = 1;
    private currentStep = 0;
    private versionText: string;
    private data: any;
    public uploadProvider: UploadProvider;
    constructor(private injector: Injector,
                public modalProvider: IMFXModalProvider) {
        this.modalRef = this.injector.get('modalRef');
        this.data = this.modalRef.getData();
        this.uploadProvider = this.injector.get(UploadProvider);
        // ref to component
        this.uploadProvider.moduleContext = this;
        this.modalRef.modalEvents.subscribe((e: IMFXModalEvent) =>{
            if(e.name == 'hide'){
                this.hide();
            }
        })
    }

    /**
     * On show modal
     */
    onShown() {
        this.isValidForm = this.uploadProvider.isValidForm();
    }

    /**
     * Hide modal
     * @param $event
     */
    hide($event?) {
        this.uploadProvider.uploadModalIsOpen = true;
        this.disableAllFields();
        this.modalRef.hide();
        this.clearControls();
        this.uploadProvider.clearProperties();
        this.isValidForm = this.uploadProvider.isValidForm();
        this.toggleOverlay(false);
        this.currentStep = this.firstStep;
    }

    //
    goToPreviousStep() {
        if (this.currentStep <= this.firstStep) {
            return;
        }

        this.currentStep--;
        this.toggleOverlay(false);
    }

    //
    goToNextStep() {
        if (!('id' in this.uploadProvider._selectedVersion)) {
            this.openVersions();
        } else {
            if (this.currentStep >= this.lastStep) {
                return;
            }
            let nextStep = this.currentStep + 1;
            this.loadStep(nextStep).subscribe(() => {
                // success step
                this.currentStep++;
                // this.toggleOverlay(false);
            }, () => {
                // error step
                this.toggleOverlay(false);
            });
        }
    }

    loadStep(stepNumber): Observable<Subscription> {
        return Observable.create((observer) => {
            // this.toggleOverlay(true);
            if (stepNumber === 0) {

            } else if (stepNumber === 1) {
                this.fillControls();
            }

            observer.next();

        });
    }

    toggleOverlay(bShow) {
        if (!bShow) {
            this.overlay.hide($(this.wrapper.nativeElement));
        } else {
            this.overlay.showWithoutButton($(this.wrapper.nativeElement));
        }
        // this.cdr.markForCheck();
    }

    onSelectFileItem(key) {
        this.clearControls();
        this.enableAllFields();
        // this.activeItem = key;
        this.uploadProvider.selectFileItem(key);
        this.isValidForm = this.uploadProvider.isValidForm();
    }

    /**
     * On change Notes field
     */
    onChangeNotes() {
        this.uploadProvider.setFormData('Notes', $.trim(this.controlNotes.nativeElement.value));
    }

    //
    setVersion(id, text) {
        this.uploadProvider._selectedVersion = {
            title: text,
            id: id
        };
        this.versionText = text;
    }

    //
    openVersions() {
        this.uploadProvider.showVersions();
    }

    ngAfterViewInit() {
        this.modalRef.showOverlay();
        this.controlMediaTypes.onReady.subscribe(() => {
            this.uploadProvider.init().subscribe(() => {
                // this.enableAllFields();
                let self = this;
                (<any>$('.files-block')).filedrop({
                    callback: function (files) {
                        self.onSelectFiles(files);
                    }
                });
            });
            this.modalRef.hideOverlay();
        });
        this.disableAllFields();
    }

    /**
     * On select files
     */
    onSelectFiles(_files: Event | FileList) {
        if(!$.isEmptyObject(this.controlMediaTypes._serverResponse)) {
            this._onSelectFiles(_files);
        } else {
            this.controlMediaTypes.onReady.subscribe(() => {
                this._onSelectFiles(_files);
            });
        }
    }

    _onSelectFiles(_files: Event | FileList) {
        let files: any; //
        if (_files instanceof Event) {
            files = (<any>_files.target).files;
        } else if (_files instanceof FileList) {
            files = _files;
        }

        if (!$.isEmptyObject(files)) {
            // if uncommented - clear value of controls
            // this.clearControls();
            // if uncommented - clear list of files
            // this.uploadProvider.clearProperties();
            this.uploadProvider.bindFilesToFormData(files);
            // this.formData = this.uploadProvider.getFullFormData();
            // this.onSelectFileItem(this.activeItem);
            this.uploadProvider.selectFileItem(this.uploadProvider.getActiveFileItem() || 0);
            // this.fillControls();
            this.isValidForm = this.uploadProvider.isValidForm();
            if (this.isValidForm) {
                this.enableAllFields();
            } else {
                this.disableAllFields();
            }
        }

        this.inputFile.nativeElement.value = '';
    }

    /**
     * Emulate click by <input type='file'> button
     */
    simulateClickByFile($event) {
        // debugger;
        if ($($event.target).closest('.row-item').length) {
            return true;
        }
        if ($($event.target).closest('.select-files-block-handler')) {
            setTimeout(() => {
                $(this.inputFile.nativeElement).click();
            });
        }
    }

    /**
     * Fill controls by activeFormItem
     */
    public fillControls() {
        let selectedFile = this.uploadProvider.getFormData('fileToUpload');
        if (selectedFile) {
            // notes
            this.controlNotes.nativeElement.value = this.uploadProvider.getFormData('Notes') || '';

            // item types
            this.controlItemTypes.setSelected(this.uploadProvider.getFormData('MiType'));

            // usage types
            this.controlUsageTypes.setSelected(this.uploadProvider.getFormData('Usage', 'ID'));

            // tv standards
            this.controlTvStandards.setSelected(
                this.uploadProvider.getFormData('TvStandard', 'ID')
            );

            // aspect ratio
            this.controlAspectRatio.setSelected(
                this.uploadProvider.getFormData('AspectRatio', 'ID')
            );

            // media types
            let fileExt = this.uploadProvider.getFormData('fileToUpload').name.split('.').pop();
            let types = this.uploadProvider.getMediaTypesAsSelect2ItemByExt(fileExt);
            let selectedMediaItemId = this.uploadProvider.getFormData('MediaFormat');
            // if (!selectedMediaItemId) {
            //     selectedMediaItemId = types[0].id;
            //     this.uploadProvider.setFormData('MediaFormat', selectedMediaItemId);
            // }
            this.controlMediaTypes.setData(types);
            if (types.length > 1) {
                this.controlMediaTypes.enable();
                this.controlMediaTypes.setValidation(false);
            } else {
                this.controlMediaTypes.disable();
                this.controlMediaTypes.setSelectedByIds([selectedMediaItemId]);
                this.controlMediaTypes.setValidation(true);
            }

            if(selectedMediaItemId) {
                this.controlMediaTypes.setSelectedByIds([selectedMediaItemId]);
                this.controlMediaTypes.setValidation(true);
            }

            // workflow presets
            this.controlWorkflow.setSelected(this.uploadProvider.getFormData('WorkflowPresetId'));

            // versiontitles
            // this.controlVersionTitle.nativeElement
            // .value = this.uploadProvider.getFormData('VersionTitle', null, -1)||'';
            // this.controlVersionTitle.nativeElement
            // .value = this.uploadProvider._selectedVersion.title || '';
        } else {
            this.controlMediaTypes.clearSelected();
        }
    }

    /**
     * Clear value for all controls
     */
    public clearControls() {
        this.controlItemTypes.clearSelected();
        this.controlUsageTypes.clearSelected();
        this.controlTvStandards.clearSelected();
        this.controlAspectRatio.clearSelected();
        this.controlMediaTypes.clearSelected();
        this.controlWorkflow.clearSelected();
        this.controlNotes.nativeElement.value = '';
        // this.controlVersionTitle.nativeElement.value = '';
    }

    /**
     * Disable all fields
     */
    disableAllFields() {
        this.controlItemTypes.disable();
        this.controlUsageTypes.disable();
        this.controlTvStandards.disable();
        this.controlAspectRatio.disable();
        this.controlMediaTypes.disable();
        this.controlWorkflow.disable();
        this.controlNotes.nativeElement.disabled = true;
        // this.controlVersionTitle.nativeElement.disabled = true;
        // this.cdr.detectChanges();
    }

    /**
     * Enable all fields
     */
    enableAllFields() {
        this.controlItemTypes.enable();
        this.controlUsageTypes.enable();
        this.controlTvStandards.enable();
        this.controlAspectRatio.enable();
        this.controlMediaTypes.enable();
        this.controlWorkflow.enable();
        this.controlNotes.nativeElement.disabled = false;
        // this.controlVersionTitle.nativeElement.disabled = false;
        // this.cdr.detectChanges();
    }

    /**
     * Update value of controls
     * @param controlRefStr
     * @param field
     */
    private onUpdateControl(controlRefStr, field, forced: boolean = true) {
        let id = this[controlRefStr].getSelected();
        if (id) {
            let item: Select2ItemType = {
                id: id,
                text: this[controlRefStr].getSelectedText()[0]
            };
            this.uploadProvider.updateControl(field, item);
            if(field == 'MediaFormat'){
                this.controlMediaTypes.setValidation(true);
            }
        } else {
            this.uploadProvider.updateControl(field, null);
        }

    }

    /**
     * Remove item from selected files
     */
    private removeItem(itemIndex: number) {
        this.uploadProvider.removeItem(itemIndex);
        this.isValidForm = this.uploadProvider.isValidForm();
    }

    private upload() {
        this.uploadProvider.upload();
    }
}
