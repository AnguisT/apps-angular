import {
  Component, ElementRef, EventEmitter, Injector, ViewChild, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {AcquisitionService} from "../../services/acquisition.service";
import {TreeStandardListTypes} from "../../../../modules/controls/tree/types";
import {IMFXControlsTreeComponent} from "../../../../modules/controls/tree/imfx.tree";
import {ModalComponent} from "../../../../modules/modal/modal";
import {ModalConfig} from "../../../../modules/modal/modal.config";
import {EditAcquisitionModalProvider} from "./modals/edit.acquisition.modal/edit.acquisition.modal.provider";
import {EditAcquisitionModalComponent} from "./modals/edit.acquisition.modal/edit.acquisition.modal.component";
import {EditArticleModalProvider} from "./modals/edit.article.modal/edit.article.modal.provider";
import {EditArticleModalComponent} from "./modals/edit.article.modal/edit.article.modal.component";
import {NewContactModalComponent} from "./modals/new.contact.modal/new.contact.modal.component";
import {NewContactModalProvider} from "./modals/new.contact.modal/new.contact.modal.provider";
import { OverlayComponent } from '../../../../modules/overlay/overlay';
import { IMFXModalProvider } from '../../../../modules/imfx-modal/proivders/provider';

@Component({
    selector: 'acquisition-workspace',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        AcquisitionService,
        EditAcquisitionModalProvider,
        EditArticleModalProvider,
        NewContactModalProvider
    ],
    entryComponents: [
        EditAcquisitionModalComponent,
        EditArticleModalComponent,
        NewContactModalComponent
    ]
})

export class AcquisitionsWorkspaceComponent {
    @ViewChild('overlayWrapper') overlayWrapper: any;
    @ViewChild('overlay') overlay: OverlayComponent;
    @ViewChild('articlesHeader', {read: ElementRef}) articlesHeader: ElementRef;
    @ViewChild('articlesBody', {read: ElementRef}) articlesBody: ElementRef;
    @ViewChild('tree') private tree: IMFXControlsTreeComponent;

    private onSaveAcquisition: EventEmitter<any> = new EventEmitter<any>();
    private onSaveArticle: EventEmitter<any> = new EventEmitter<any>();

    private id;
    private data = null;
    private mainData = null;
    private activeData = null;
    private activeTab = 0;
    private containerData = null;
    private articlesData = null;

    private acquisitionLabels = {
        DESCRIPTION: 'Description',
        ALT_ID1: 'Transfer Job Number',
        EXT_REF: 'External Ref',
        FILE_NO: 'File Number',
        CHANNEL: 'Client',
        ORIGIN: 'Origin',
        ID: 'Acquisition ID',
        SYSTEM_STATUS: 'System Status',
        CREATED: 'Created',
        CREATED_BY: 'Created By',
        UPDATED: 'Updated',
        UPDATED_BY: 'Updated By',
        DRAFT_CONTRACT_PROV: 'Contract Prov',
        CATEGORY: 'Category',
        TYPE: 'Type',
        STATUS: 'Status',
        SOURCE: 'Source',
        COPYRIGHT: 'Copyright',
        COLLECTION: 'Collection',
        DISPOSAL_RIGHTS: 'Disposal Authority',
        CASE_OFFICER: 'Case Officer',
        DEPARTMENT: 'Section',
        DRAFT_CONTRACT: 'Draft Contract'
    };

    private articleLabels = {
        DESCRIPTION: 'Description',
        ARTICLE_MEDIUM: 'Medium',
        ARTICLE_SUBMEDIUM: 'Submedium',
        ARTICLE_FORM: 'Category/Form',
        ARTICLE_FORMAT: 'Article Format',
        ARTICLE_ITEMTYPE: 'Item Type',
        ARTICLE_QTY_EXPECTED: 'Quantity Expected',
        ARTICLE_QTY_RECEIVED: 'Quantity Received',
        ARTICLE_QTY_REMAINING: 'Quantity Remaining',
        ARTICLE_CONDITION: 'Condition',
        ARTICLE_MATERIAL: 'Material',
        OBJECT_ID: 'Article ID',
        STATUS: 'Status',
        CREATED: 'Created',
        CREATED_BY: 'Created By',
        ARTICLE_BARCODE: 'Article Barcode'
    };

    private proposalLabels = [
        'Supplier',
        'Title',
        'Category',
        'Category Code',
        'Status',
        'Pitching Date',
        'Evaluation Mark'
    ];

    constructor(protected injector: Injector,
                protected router: Router,
                protected service: AcquisitionService,
                protected cdr: ChangeDetectorRef,
                protected editAcquisitionModalProvider: EditAcquisitionModalProvider,
                protected editArticleModalProvider: EditArticleModalProvider,
                protected newContactModalProvider: NewContactModalProvider,
                protected route: ActivatedRoute,
                protected modalProvider: IMFXModalProvider) {
        this.route.params.subscribe(params => {
            this.id = params.id;
        });
        this.onSaveAcquisition.subscribe((res) => {
            this.acquisitionSave(res);
        });
        this.onSaveArticle.subscribe((res) => {
            this.articleSave(res);
        });
    }

    newContactShow() {
        let modal = this.modalProvider.show(NewContactModalComponent, {
            size: 'md',
            title: 'contacts.new_contact',
            footerRef: 'modalFooterTemplate'
        });

        let content = modal.contentView.instance;
        content.toggleOverlay(true);
        content.setData();
    }

    editAcquisitionShow() {
        let modal = this.modalProvider.show(EditAcquisitionModalComponent, {
            size: 'md',
            title: 'acquisitions.edit_acq'
        });

        let content = modal.contentView.instance;
        content.toggleOverlay(true);
        content.setData(this.onSaveAcquisition);
    }

    editArticleShow() {
        let modal = this.modalProvider.show(EditArticleModalComponent, {
            size: 'md',
            title: 'acquisitions.edit_article'
        });

        let content = modal.contentView.instance;
        content.toggleOverlay(true);
        content.setData(this.onSaveArticle);
    }

    acquisitionSave(data) {
        alert(1);
    }

    articleSave(data) {
        alert(2);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.overlay.show(this.overlayWrapper.nativeElement);
        // $(this.overlayWrapper.nativeElement).show();
        this.initData();
    }

    onSelect(e) {
        if (e.data.targetType == "title") {
            let tmp = e.data.node.data.dirtyObj;
            let self = this;
            this.containerData = [];
            this.activeData = tmp;

            if (tmp.OBJECT_TYPE == 3) {
                $.each(tmp, function (i, v) {
                    if (i in self.articleLabels)
                        self.containerData.push({Key: self.articleLabels[i], Value: v});
                });
                self.containerData.push({Key: self.articleLabels["STATUS"], Value: self.mainData["STATUS"]});
            }
            else if (tmp.OBJECT_TYPE == 0) {
                $.each(self.mainData, function (i, v) {
                    if (i in self.acquisitionLabels)
                        self.containerData.push({Key: self.acquisitionLabels[i], Value: v});
                });
            }
            else {
                $.each(tmp, function (i, v) {
                    if (i in self.acquisitionLabels)
                        self.containerData.push({Key: self.acquisitionLabels[i], Value: v});
                });
            }
        }
    }

    ngAfterViewChecked() {
        if (this.articlesHeader != undefined && this.articlesBody != undefined) {
            //setTimeout(()=>{
            let headers = $(this.articlesHeader.nativeElement).find('th');
            let rows = $(this.articlesBody.nativeElement).find('.fake-rows');
            for (var i = 0; i < rows.length; i++) {
                rows[i].style.width = this.articlesHeader.nativeElement.Width + "px";
                let columns = $(rows[i]).find('.fake-cell');
                for (var j = 0; j < headers.length; j++) {
                    if (headers.length - 1 == j) {
                        columns[j].style.width = headers[j].offsetWidth - 20 + "px";
                    }
                    else {
                        columns[j].style.width = headers[j].offsetWidth + "px";
                    }

                }
            }
            //},0);
        }
    }

    changeTab(tab) {
        this.activeTab = tab;
    }

    toggleTree(expand) {
        if (expand) {
            this.tree.expandAll();
        }
        else {
            this.tree.collapseAll();
        }
    }

    /*
      0 – Acquisition (root node in treeview)
      1 – Container
      3 – Article
      4 – XML Document
     */
    filterData(arr, term, self) {
        var matches = [];

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].OBJECT_TYPE == term) {
                matches.push(arr[i]);
            }
            if (arr[i].Children && arr[i].Children.length > 0) {
                let tmp = self.filterData(arr[i].Children, term, self);
                for (var j = 0; j < tmp.length; j++) {
                    matches.push(tmp[j]);
                }
            }
        }
        return matches;
    }

    initData() {
        let self = this;
        this.service.getDetail(self.id).subscribe((res) => {
            if (res && res.Objects && res.Objects.length > 0) {
                self.data = res.Objects;
                self.mainData = res.Acq;
            }
            else {
                self.data = null;
            }

            if (self.data != null) {
                debugger;
                setTimeout(() => {
                    self.articlesData = self.filterData(self.data, 3, self);
                    let normData: TreeStandardListTypes = self.tree.turnArrayOfObjectToStandart(self.data, {
                        key: 'ACQ_ID',
                        title: 'DESCRIPTION',
                        children: 'Children',
                    });
                    self.data = normData;
                    self.tree.setSource(this.data);

                    self.overlay.hide(self.overlayWrapper.nativeElement);
                    // $(self.overlayWrapper.nativeElement).hide();
                    self.cdr.detectChanges();
                }, 0)
            }
        });
    }
}
