import {ChangeDetectorRef, Component, Injector, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {ExportProvider} from './providers/export.provider';
import {ExportService} from './services/export.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import * as FileSaver from 'file-saver';
import {TranslateService} from 'ng2-translate';
import {Router} from '@angular/router';
import {NotificationService} from '../notification/services/notification.service';
import {CoreSearchComponent} from '../../core/core.search.comp';
import {SlickGridProvider} from "../search/slick-grid/providers/slick.grid.provider";
import {ExportModelType} from "./types";
import {ViewsProvider} from "../search/views/providers/views.provider";
import {IMFXModalComponent} from "../imfx-modal/imfx-modal";
import { SlickGridTreeRowData } from '../search/slick-grid/types';

// import {} from '../error'
@Component({
    selector: 'export-modal',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        // IMFXModalProvider,
        // BsModalRef,
        // BsModalService,
    ]
})

export class ExportComponent {
    @ViewChild('modalFooterTemplate', {read: TemplateRef}) modalFooterTemplate: TemplateRef<any>;
    @ViewChild('overlayExport') private overlay;
    @ViewChild('overlayWrapper') private wrapper;
    private firstStep = 0;
    private lastStep = 1;
    private currentStep = 0;
    private modalRef: IMFXModalComponent;
    private formats = [
        // {name: 'PDF', type: 'application/pdf', ext: 'pdf'},
        {name: 'HTML', type: 'text/html', ext: 'html'},
        {name: 'Excel', type: 'application/vnd.ms-excel', ext: 'xls'},
        {name: 'CSV', type: 'text/csv', ext: 'csv'}
    ];
    private selectedFormatObject; // first by default
    private blob: any;
    private selectedFormat = 'HTML';
    private defaultSelectedFormat = 'HTML';
    private isAllExport: boolean = true;
    private errorMsg = null;

    constructor(private cdr: ChangeDetectorRef,
                private injector: Injector,
                private provider: ExportProvider,
                private service: ExportService,
                private translate: TranslateService,
                private router: Router,
                protected notificationRef: NotificationService) {
        // ref to component
        this.provider.moduleContext = this;
        // this.provider.componentContext;
        this.selectedFormatObject = this.formats[0];
        // modal data
        this.modalRef = this.injector.get('modalRef');
    }

    ngAfterViewInit() {
        // this.data.refs.modal.onHide.subscribe((data) => {
        //     debugger;
        //     this.closeModal();
        // });
        this.reset();
    }

    onShowModal() {
    }

    onShownModal() {
    }

    /**
     * Hide modal
     */
    closeModal() {
        this.modalRef.hide();
        this.reset()
    }

    reset() {
        this.toggleOverlay(false);
        this.blob = null;
        this.currentStep = this.firstStep;
        this.isAllExport = true;
        this.selectedFormat = this.defaultSelectedFormat;
        this.setFormat(this.selectedFormat);
        this.errorMsg = null;
    }

    setFormat(format) {
        this.selectedFormat = format;
        let sfo = this.formats.filter((el, k) => {
            return el.name === this.selectedFormat;
        });
        this.selectedFormatObject = sfo[0];
    }

    isAll(val: boolean) {
        this.isAllExport = val;
        this.cdr.markForCheck();
    }

    //
    loadStep(stepNumber): Observable<Subscription> {
        let self = this;

        return Observable.create((observer) => {
            if (stepNumber === 0) {

            } else if (stepNumber === 1) {
                let model = this.getExportModel();

                if (!model.Text && model.SearchCriteria.length === 0) {
                    self.errorMsg = self.translate.instant('export.empty_params');
                    observer.error();
                    return;
                }
                if (self.getSlickGridData().length === 0) {
                    self.errorMsg = self.translate.instant('export.empty_results');
                    observer.error();
                    return;
                }
                if (self.isAllExport) {
                    model.Page = -1;
                }
                self.toggleOverlay(true);
                self.service.getExportData(model).subscribe((resp: Blob) => {
                    self.errorMsg = null;
                    self.blob = resp;
                    observer.next();
                }, (err) => {
                    self.toggleOverlay(false);
                    self.notificationRef.notifyShow(2, err.statusText);
                    // self.cdr.detectChanges();
                    self.closeModal();
                    // observer.error(err.statysText);
                    // observer.error();
                    // return;
                    // let fr = new FileReader();
                    // let self = this;
                    // fr.onload = function () {
                    //     self.errorMsg = JSON.parse(this.result).Message;
                    //     observer.error();
                    //     return;
                    // };
                    // fr.readAsText(err._body);
                });
            }
        });
    }

    getSlickGridData() : SlickGridTreeRowData[] {
        let sgp : SlickGridProvider = (<CoreSearchComponent>this.provider.componentContext).slickGridComp.provider;
        let data : SlickGridTreeRowData[] = sgp ? sgp.getData() : [];
        return data;
    }

    getExportModel(): ExportModelType {
        let sgp: SlickGridProvider = (<CoreSearchComponent>this.provider.componentContext).slickGridComp.provider;
        let vp: ViewsProvider = (<CoreSearchComponent>this.provider.componentContext).viewsComp.provider;
        let model: any = sgp.lastRequestForSearch ? sgp.lastRequestForSearch : sgp.getRequestForSearch();
        model.ExportType = this.selectedFormat;
        model.SearchType = sgp.module.searchType;
        model.View = vp.currentViewsState.viewObject;

        return (<ExportModelType>model);
    }

    downloadFile() {
        if (this.blob) {
            FileSaver.saveAs(this.blob, 'Export.' + this.selectedFormatObject.ext);
        } else {
            this.goToPreviousStep();
        }
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
        if (this.currentStep >= this.lastStep) {
            return;
        }
        let nextStep = this.currentStep + 1;
        this.loadStep(nextStep).subscribe(() => {
            // success step
            this.currentStep++;
            this.toggleOverlay(false);
        }, () => {
            // error step
            this.toggleOverlay(false);
        });
    }

    toggleOverlay(bShow) {
        if (!bShow) {
            this.overlay.hide($(this.wrapper.nativeElement));
        } else {
            this.overlay.showWithoutButton($(this.wrapper.nativeElement));
        }
        this.cdr.markForCheck();
    }
}
