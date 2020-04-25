/**
 * Created by initr on 20.10.2016.
 */
import {
    Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Injectable, Inject, ChangeDetectorRef,
    ViewChild, Injector
} from '@angular/core'
import {FormControl} from '@angular/forms';
import {XMLService} from '../../../../../services/xml/xml.service';

// Loading jQuery
import * as $ from 'jquery';
import { GLComponent } from '../../gl.component';
import {ModalComponent} from '../../../../modal/modal';
import {ModalConfig} from '../../../../modal/modal.config';
import {XMLComponent} from '../../../xml/xml';
import {AdvancedSearchDataForControlType} from '../../../advanced/types';
import {IMFXSimpleTreeComponent} from '../../../../controls/simple.tree/simple.tree.component';
import { IMFXModalProvider } from '../../../../imfx-modal/proivders/provider';
import { IMFXModalEvent } from '../../../../imfx-modal/types';
import {IMFXMLTreeComponent} from "../../../../controls/xml.tree/imfx.xml.tree";
import {NotificationService} from "../../../../notification/services/notification.service";
import {TranslateService} from "ng2-translate";

@Component({
    selector: 'imfx-metadata-tab',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss',
        '../../styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class IMFXMetadataTabComponent {
    config: any;
    compIsLoaded = false;
    public modal;
    public withoutXmlTree = true;
    public data: AdvancedSearchDataForControlType;
    @ViewChild('commonMetadataModal') private commonMetadataModal: ModalComponent;
    @ViewChild('simpleTreeRef') private simpleTreeRef: IMFXSimpleTreeComponent;
    @ViewChild('xmlTreeRef') private xmlTreeRef: IMFXMLTreeComponent;

    private selectedSchemaModel: any = {};
    private selectedXmlModel: any = {};
    private xmls: any = [];
    private translateSchemaIdX: string = 'ng2_components.ag_grid.tbl_header_xml_schemas_SCHEMAIDx';
    private schemaFromCMModal;
    private resultFromCMModal;
    private content;
    //private schema;

    constructor(private cdr: ChangeDetectorRef,
                private xmlService: XMLService,
                private translate: TranslateService,
                private notificationService: NotificationService,
                private modalProvider: IMFXModalProvider) {
    }

    // ngOnInit() {
    //   this.config.readOnly = false;// FOR TEST
    // }

    afterViewInit() {
        if (this.config.readOnly === false) {
            this.content.setType('SCHEMAIDx');
        }

    }

    ngAfterViewInit() {
        this.editMode = false;
        this.cdr.detectChanges();
    }

    editDocument() {
        this.newDoc = false;
        this.editMode = true;
        this.cdr.detectChanges();
    }

    cancelEditDocument() {
        if(!this.newDoc) {
            this.selectXml(this.selectedXmlModel.XmlDocumentDbId);
        }
        else {
            let groupExist = false;
            for (var i = 0; i < this.xmls.length; i++) {
                if (this.xmls[i].Children.length > 0)
                    for (var j = 0; j < this.xmls[i].Children.length; j++) {
                        this.xmls[i].Children[j].selected = false;
                    }
                if(this.selectedSchemaModel.SchemaDbId == this.xmls[i].Id) {
                    if(this.xmls[i].Children.length > 1) {
                        this.xmls[i].Children.shift();
                        groupExist = true;
                    }
                }
            }
            if(!groupExist) {
                this.xmls.shift();
            }
            this.selectedSchemaModel =  {};
            this.selectedXmlModel = {};
            this.newDoc = false;
        }
        this.editMode = false;
        this.cdr.detectChanges();
    }

    private inSave = false;
    private newDoc = false;
    private editMode = true;

    saveSelectedMetadata() {
        this.inSave = true;
        if (this.xmlTreeRef && !this.xmlTreeRef.isValid()) {
            this.notificationService.notifyShow(2, this.translate.instant('basket.xml_not_valid'));
            this.inSave = false;
            return;
        }
        let model = this.xmlTreeRef.getXmlModel();
        debugger;
        let data = {
            "SchemaModel": this.selectedSchemaModel,
            "XmlModel": model.XmlModel
        }
        if (model && model.XmlModel && model.XmlModel.XmlModel) {
            this.xmlService.saveXmlDocument(data, this.newDoc ? 0 : model.XmlModel.XmlModel.Id).subscribe((res) => {
                if (res["Error"] != null) {
                    this.notificationService.notifyShow(2, this.translate.instant('modal.titles.error') + "." + res["Error"]);
                }
                else {
                    this.notificationService.notifyShow(1, this.translate.instant('modal.titles.success'));
                    this.selectXml(res['ID']);
                }
            });
        }
    }

    addCustomMetadata() {
        let self = this;

        let title = this.translateSchemaIdX;

        this.modal = this.modalProvider.show(XMLComponent, {
            size: 'md',
            title: title,
            position: 'center',
            footer: 'ok'
        }, {compContext: self});

        this.modal.modalEvents.subscribe((e: IMFXModalEvent) => {
            if (e.name === 'ok') {
                self.onAddNew();
                self.modal.hide();
            }
        });

        this.content = this.modal.contentView.instance;

        this.content.resetSelection();
        this.content.toggleOverlay(false);
        this.afterViewInit();

        this.content.onSelectEvent.subscribe((selected) => {
            self.onSelect(selected.schema, selected.result);
        });

        this.cdr.detectChanges();
    }

    onSelect(schema, result) {
        this.schemaFromCMModal = schema;
        this.resultFromCMModal = result;
        this.cdr.detectChanges();
    }

    onAddNew() {
        this.content.toggleOverlay(true);
        let data = this.resultFromCMModal;

        if (data) {
            data.XmlModel.OwnerId = this.config.file['ID'];
            data.XmlModel.OwnerType = 4000;
            this.selectedSchemaModel = data.SchemaModel;
            this.selectedXmlModel = data.XmlModel;
            let groupExist = false;
            for (var i = 0; i < this.xmls.length; i++) {
                if (this.xmls[i].Children.length > 0)
                    for (var j = 0; j < this.xmls[i].Children.length; j++) {
                        this.xmls[i].Children[j].selected = false;
                    }
                if(data.SchemaModel.SchemaDbId == this.xmls[i].Id) {
                    groupExist = true;
                    this.xmls[i].Children.unshift({
                        Id: 0,
                        selected: true
                    });
                }
            }
            if(!groupExist) {
                this.xmls.unshift({
                    Id: data.SchemaModel.SchemaDbId,
                    Name: data.SchemaModel.SchemaModel.Name,
                    Children: [{
                        Id: 0,
                        selected: true
                    }],
                });
            }
            this.newDoc = true;
            this.editMode = true;
            this.cdr.detectChanges();
        }
    }

    selectXml(selectId = null) {
        var sType = '';
        switch (this.config.typeDetailsLocal) {
            case 'version_details':
                sType = this.config.file['ITEM_TYPE'];
                break;
            case 'media_details':
                sType = '4000';
                break;
            case 'carrier_details':
                sType = '4001';
                break;
            default:
                console.log('ERROR: unknown detail type.');
        }
        this.xmlService.getXmlForMetadata(this.config.file['ID'], sType)
            .subscribe(result => {
                if (result != undefined && result.length > 0) {
                    this.xmls = result;
                    if (selectId) {
                        if(this.modal && this.content) {
                            this.content.toggleOverlay(false);
                            this.modal.hide();
                        }
                        for (var i = 0; i < this.xmls.length; i++) {
                            if (this.xmls[i].Children.length > 0)
                                for (var j = 0; j < this.xmls[i].Children.length; j++) {
                                    this.xmls[i].Children[j].selected = false;
                                    if (this.xmls[i].Children[j].Id == Math.round(selectId)) {
                                        this.xmls[i].Children[j].selected = true;
                                    }
                                }
                        }
                        this.selectXmlDocument(Math.round(selectId));
                    }
                }
                this.compIsLoaded = true;
                this.newDoc = false;
                this.inSave = false;
                this.cdr.detectChanges();
            });
    }

    selectXmlDocument(id) {
        this.selectedSchemaModel = {};
        this.selectedXmlModel = {};

        this.cdr.detectChanges();
        this.xmlService.getXmlDocument(id)
            .subscribe(res => {
                if (res.SchemaModel != undefined) {
                    this.selectedSchemaModel = res.SchemaModel;
                    this.selectedXmlModel = res.XmlModel;
                } else {
                    this.selectedSchemaModel = {};
                    this.selectedXmlModel = {};
                }
                this.newDoc = false;
                this.inSave = false;
                this.editMode = false;
                this.cdr.detectChanges();
            });
    };

    public loadComponentData() {
        if (!this.compIsLoaded) {
            this.selectXml();
        }
    }

    refresh(data?: any, readOnly?: boolean) {
        if (readOnly != null) {
            this.config.readOnly = readOnly;
        }
        ;
        if (data) {
            this.config.file = data;
            this.selectXml();
        }
        ;
    };
}
