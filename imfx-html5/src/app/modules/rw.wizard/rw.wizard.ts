import {
    ChangeDetectorRef, Component, EventEmitter, Injector, TemplateRef, ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {BasketService} from "../../services/basket/basket.service";
import {UploadProvider} from "./providers/upload.provider";
import {MediaFileType, MediaFileTypes} from "./types";
import {RaiseWorkflowWizzardProvider} from "./providers/rw.wizard.provider";
import {NotificationService} from "../notification/services/notification.service";
import {TranslateService} from "ng2-translate";
import {XMLService} from "../../services/xml/xml.service";
import {Router} from "@angular/router";
import {MediaClip} from "../../views/clip-editor/rce.component";
import {appRouter} from "../../constants/appRouter";
import {IMFXModalComponent} from "../imfx-modal/imfx-modal";
import {BsModalRef} from "ngx-bootstrap";

@Component({
    selector: 'imfx-rf-wizard-modal',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        // ControlToAdvTransfer,
    ]
})

export class RaiseWorkflowWizzardComponent {
    public onShow: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modalFooterTemplate', { read: TemplateRef }) modalFooterTemplate: TemplateRef<any>;
    @ViewChild('xmlTree') private xmlTree;
    private modalRef: IMFXModalComponent;
    private title: any;
    private currentStep = 1;
    private prevStep = 1;
    private overlayShowed = true;
    private overlayActive = true;
    private selectedPreset = null;
    private selectedSchemaModel: any = {};
    private selectedXmlModel: any = {};
    private visiblePresets = [];
    private presets = [];
    private resultsMessage = '';
    private selectedItem;
    private selectedItemType;
    private clips: Array<MediaClip> = [];
    private successPlacement = false;
    private resultJob = null;
    private resultJobRef = null;

    constructor(private cdr: ChangeDetectorRef,
                private router: Router,
                private injector: Injector,
                private translate: TranslateService,
                public rwwizardprovider: RaiseWorkflowWizzardProvider,
                private xmlService: XMLService,
                private notificationRef: NotificationService,
                private basketService: BasketService) {
        // ref to component
        this.rwwizardprovider.moduleContext = this;

        // modal data
        this.modalRef = this.injector.get('modalRef');
    }

    init(itemParams) {
        let self = this;
        // this.onShow.subscribe((itemParams) => {
            self.title = itemParams.itemTitle;
            self.selectedItem = itemParams.itemId;
            self.selectedItemType = itemParams.itemType;
            self.clips = itemParams.clips || [];
            self.currentStep = 1;
            self.prevStep = 1;
            self.loadStep();
        // });
    }

    /**
     * Hide modal
     * @param $event
     */
    hide($event?) {
        this.modalRef.hide();
        this.toggleOverlay(true);
        this.currentStep = 1;
        this.selectedPreset = null;
        this.resultJob = null;
        this.resultJobRef = null;
        this.visiblePresets = this.presets;
    }

    loadStep() {
        let self = this;
        if (this.currentStep === 1) {
            // Load presets
            if (this.presets.length === 0) {
                self.basketService.getOrderPresets().subscribe(
                    result => {
                        self.visiblePresets = result;
                        self.presets = result;
                        self.toggleOverlay(false);
                        self.cdr.detectChanges();
                    });
            } else {
                this.toggleOverlay(false);
            }
        } else if (this.currentStep === 2) {
            this.xmlService.getXmlData(this.selectedPreset.SchemaId)
                .subscribe((result: any) => {
                    if (result) {
                        self.selectedSchemaModel = result.SchemaModel;
                        self.selectedXmlModel = result.XmlModel;
                        self.toggleOverlay(false);
                        self.cdr.detectChanges();
                    }
                });
        } else if (this.currentStep === 3) {
            this.placeOrder();
        }
    }

    goToPreviousStep() {
        if (this.selectedPreset && this.selectedPreset.SchemaId !== 0) {
            this.currentStep--;
            this.visiblePresets = this.presets;
        } else {
            this.currentStep = 1;
            this.visiblePresets = this.presets;
        }
    }

    goToNextStep() {
        this.toggleOverlay(true);
        // check if schema not exist set step 3
        if (this.selectedPreset && this.selectedPreset.SchemaId !== 0) {
            this.currentStep++;
            if (this.currentStep === 2) {
                if (this.xmlTree && !this.xmlTree.isValid()) {
                    this.notificationRef.notifyShow(2, this.translate.instant('basket.xml_not_valid'));
                    return;
                }
            }
        } else {
            this.currentStep = 3;
        }
        this.loadStep();
    }

    toggleOverlay(bShow) {
        let self = this;
        this.overlayShowed = bShow;
        if (!bShow) {
            setTimeout(function () {
                self.overlayActive = false;
            }, 300);
        } else {
            self.overlayActive = bShow;
        }
    }

    selectPreset(item) {
        this.selectedPreset = item;
    }

    filterPresets($event) {
        let filterValue = $event.target.value.toLowerCase();
        if (filterValue !== '') {
            this.visiblePresets = this.presets.filter(
                (el) => el.Name.toLowerCase().indexOf(filterValue) > -1
            );
        } else {
            this.visiblePresets = this.presets;
        }
    }

    placeOrder() {
        let that = this;
        let model = that.selectedPreset && that.selectedPreset.SchemaId ?
            that.xmlTree.getXmlModel() : undefined;
        this.basketService.placeOrderFromWizzard({
            itemType: that.selectedItemType,
            itemId: that.selectedItem,
            preset: that.selectedPreset,
            clips: that.clips,
            note: '',
            schemaId: that.selectedPreset && that.selectedPreset.SchemaId,
            xmlDocAndSchema: model
        }).subscribe((result) => {
            let message = that.translate.instant('basket.success_message');
            message += '\n\rJob: ';
            that.resultJob = result.JobId;
            that.resultJobRef = result.JobRef && result.JobRef.length > 0 ?
                result.JobRef : result.JobId;
            that.resultsMessage = message;
            that.successPlacement = true;
            that.toggleOverlay(false);
        }, (error) => {
            let message = that.translate.instant('basket.error_message');
            if (typeof error._body === 'string') {
                message = error._body.replace(/.*\(.*\): /, '');
            } else {
                let errorLines = error.json().Message.match(/[^\r\n]+/g);
                message = errorLines[0].replace(/.*\(.*\): /, '');
            }
            that.successPlacement = false;
            that.resultsMessage = message;
            that.toggleOverlay(false);
        });
    }

    goToJobDetailFromWizard() {
        // let id = this.resultJob;
        // this.hide();
        this.toggleOverlay(true);
        debugger;
        this.router.navigate(
            [
                appRouter.workflow.detail.substr(
                    0,
                    appRouter.workflow.detail.lastIndexOf('/')),
                this.resultJob
            ]
        );
    }
}
