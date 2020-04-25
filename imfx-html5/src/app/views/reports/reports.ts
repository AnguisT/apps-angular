/**
 * Created by Sergey Trizna on 22.05.2017.
 */
import { Component, ViewChild } from '@angular/core';
import { ModalConfig } from '../../modules/modal/modal.config';
import { ReportParamsModalComponent } from './report.params';
import { ReportService } from '../../services/reports/report.service';
import { SplashProvider } from '../../providers/design/splash.provider';
import { IMFXModalProvider } from '../../modules/imfx-modal/proivders/provider';
import { IMFXModalEvent } from '../../modules/imfx-modal/types';

@Component({
    selector: 'reports',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    providers: [
        ReportService
    ]
})

export class ReportsComponent{
    public data: any;
    @ViewChild('tree') private tree: any;
    @ViewChild('reportParamsModal') private modal: any;
    @ViewChild('pdfViewer') private pdfViewer: any;
    @ViewChild('overlayReports') private overlay: any;
    @ViewChild('list') private list: any;
    @ViewChild('report') private report: any;
    private defaultDate = new Date();
    private error: boolean = false;

    private listOfReports: Array<any> = [];
    private currentNode = null;
    private _listhandler: any;
    // private waitedReports: Array<{guid: string, state: boolean}> = [];
    private reportHandler;

    constructor(private reportService: ReportService,
                private splashProvider: SplashProvider,
                private modalProvider: IMFXModalProvider) {
        this._listhandler = reportService.getListOfReports();
    }

    ngAfterViewInit() {
        this.overlay.showWhole();
        this._listhandler.subscribe(
            (listOfReports: any) => {
                let normData = this.tree.turnArrayOfObjectToStandart(listOfReports, {
                    key: 'Id',
                    title: 'Name',
                    children: 'Children'
                });
                this.listOfReports = listOfReports;
                setTimeout(() => {
                    this.listOfReports = normData;
                    this.tree.setSource(normData);
                    this.overlay.hideWhole();
                });
            },
            () => {
                this.error = true;
                this.overlay.hideWhole();
            });
    }

    isError($event) {
        if ($event) {
            this.error = true;
        }
    }

    /**
     * Filter of data
     * @param $event
     */
    filter($event) {
        this.tree.filterCallback($event.target.value, function (str, node) {
            let normTitle = str.toLowerCase();
            let normNodeTitle = node.title.toLowerCase();
            if (normNodeTitle.indexOf(normTitle) !== -1 || node.selected === true) {
                return true;
            }
            return false;
        });
    }

    onClickByTreeItem($event) {
        let node = $event.data.node;
        if ($event.event.originalEvent.target.className !== 'fancytree-expander') {
            if (!node.children) {
                this.onDblClickByTreeItem($event);
            } else {
                node = $event.data.node;
                node.setExpanded(!node.expanded);
            }
        }
    }

    onDblClickByTreeItem($event) {
        let node = $event.data.node;
        if (node.children) return false;
        this.overlay.showWhole();
        this.error = false;
        let self = this;
        // let modalComp = this.modal.getContent();
        // modalComp.context = this;
        this.currentNode = node;
        // get parameters
        this.reportService.getParamsByReport(node.key)
            .subscribe(
                (paramsForReport: Array<any>) => {
                    if (paramsForReport && paramsForReport.length > 0) {
                        self.overlay.hideWhole();

                        self.modal = self.modalProvider.show(ReportParamsModalComponent, {
                            size: 'lg',
                            title: 'reports.select_params',
                            position: 'center',
                            footer: 'close|ok'
                        });

                        let content = self.modal.contentView.instance;
                        content.buildParams(paramsForReport);
                        content.generateEvent.subscribe((params) => {
                            self.startGenerateReport(params);
                            self.modal.hide();
                        });

                        self.modal.modalEvents.subscribe((e: IMFXModalEvent) => {
                            if (e.name === 'close') {
                                self.modal.hide();
                            } else if (e.name === 'ok') {
                                content.startGenerateReport();
                            }
                        });
                    } else {
                        self.startGenerateReport();
                    }
                },
                () => {
                    self.error = true;
                    self.overlay.hideWhole();
                });
    }

    startGenerateReport(params = []) {
        this.overlay.showWhole();
        if (!this.currentNode) return;
        this.reportService.generateReport(this.currentNode.key, params)
            .subscribe((guid) => {
                    this.reportService.moduleContext = this;
                    this.tryGetReport(guid);
                },
                (err) => {
                    this.error = true;
                    this.overlay.hideWhole();
                });
    }

    tryGetReport(guid) {
        this.reportHandler = this.reportService.getReportByGUID(guid).subscribe(
            (report: any) => {
                this.pdfViewer.renderPDFFromContent(report.blob());
                this.finishWaitReport();

            }, (err) => {
                // let modal = this.modalProvider.getModal('error');
                // modal.setText(err.message).show();
                this.finishWaitReport();
                this.error = true;
            }, (resp) => {
                this.finishWaitReport();
            });
    }

    private finishWaitReport() {
        this.reportHandler.unsubscribe();
        this.overlay.hideWhole();
        // this.overlay.hide(this.list.nativeElement);
        // this.error = true;
        // this.overlay.hide(this.report.nativeElement);
    }
}
