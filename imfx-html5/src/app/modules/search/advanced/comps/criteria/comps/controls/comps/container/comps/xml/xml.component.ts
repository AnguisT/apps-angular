/**
 * Created by Sergey Trizna on 06.02.2016.
 */
import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectorRef
} from '@angular/core';
// Modal
import { ModalConfig } from '../../../../../../../../../../modal/modal.config';
import { XMLComponent } from '../../../../../../../../../../search/xml/xml';
import {
    AdvancedSearchDataForControlType,
    AdvancedSearchDataFromControlType
} from '../../../../../../../../types';
import { ModalComponent } from '../../../../../../../../../../modal/modal';
import { SearchAdvancedCriteriaProvider } from '../../../../../../providers/provider';
import { IMFXModalEvent } from '../../../../../../../../../../imfx-modal/types';
import { IMFXModalProvider } from '../../../../../../../../../../imfx-modal/proivders/provider';

@Component({
    selector: 'advanced-criteria-control-xml',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IMFXAdvancedCriteriaControlXMLComponent {
    public data: AdvancedSearchDataForControlType;
    private modal;
    private translateSchemaId: string = 'ng2_components.ag_grid.tbl_header_xml_schemas_SCHEMAID';
    private translateSchemaIdX: string = 'ng2_components.ag_grid.tbl_header_xml_schemas_SCHEMAIDx';
    private selectedSchemaModel: any = {};
    private selectedXmlModel: any = {};
    private selectedSchemaFormList: any = null;
    private cuttedSerializedValue?: string;
    private serializedValue?: string;
    private content: XMLComponent;

    constructor(private injector: Injector,
                private transfer: SearchAdvancedCriteriaProvider,
                private modalProvider: IMFXModalProvider,
                private cdr: ChangeDetectorRef) {
        this.data = this.injector.get('data');
    }

    onSelect(schema: any, result: any, i?: number) {
        this.selectedSchemaFormList = schema;
        this.selectedSchemaModel = result.SchemaModel;
        this.selectedXmlModel = result.XmlModel;
        if (this.data.field.Name === 'SCHEMAID') {
            this.onSave();
        }
    }

    onSave() {
        this.transferData();
        this.cdr.detectChanges();
    }

    afterViewInit() {
        if (this.data.field.Name === 'SCHEMAID') {
            this.onInitSchemaID();
        } else {
            this.onInitSchemaIDx();
        }

        let self = this;
        this.content = this.modal.contentView.instance;
        this.content.onSelectEvent.subscribe((selected) => {
            self.onSelect(selected.schema, selected.result);
        });

        this.modal.modalEvents.subscribe((e: IMFXModalEvent) => {
            if (e.name === 'ok') {
                self.onSave();
                self.modal.hide();
            }
        });

        setTimeout(() => {
            this.modal.contentView.instance.setType(this.data.field.Name);
        });
    }

    showModal() {
        let self = this;

        let title = this.data.field.Name === 'SCHEMAID' ?
        this.translateSchemaId : this.translateSchemaIdX;

        this.modal = this.modalProvider.show(XMLComponent, {
            size: 'lg',
            title: title,
            position: 'center',
            footer: 'ok'
        }, {compContext: self});

        this.afterViewInit();
    }

    /**
     * Send data to parent comp
     */
    transferData() {
        if (this.selectedSchemaModel) {
            let schemaId = this.selectedSchemaModel.SchemaDbId;
            let schemaName = this.selectedSchemaFormList.Name;
            let res: AdvancedSearchDataFromControlType = <AdvancedSearchDataFromControlType> {
                dirtyValue: '',
                value: '',
                humanValue: '',
            };
            if (this.data.field.Name === 'SCHEMAIDx') {
                let xmlTree = this.content.xmlTree;
                let serializedTree = xmlTree.xmlTree.getSerializedTree();
                this.serializedValue = schemaId + '|' + schemaName + '|' + serializedTree;
                this.cuttedSerializedValue = this.cutSerializedData();
                res.value = this.serializedValue;
                res.humanValue = this.cuttedSerializedValue;
                res.dirtyValue = {
                    schemaId: schemaId
                };
            } else {
                res = {
                    value: schemaId,
                    humanValue: schemaId + '|' + schemaName,
                    dirtyValue: {
                        schemaId: schemaId
                    }
                };
            }

            this.transfer.onSelectValue(<AdvancedSearchDataFromControlType>res);
        }
    }

    private onInitSchemaID() {
        let value: AdvancedSearchDataFromControlType = this.data.criteria.data.value;
        if (value) {
        }
    }

    private onInitSchemaIDx() {
    }

    private cutSerializedData(len: number = 50) {
        return this.serializedValue.substr(0, len);
    }
}
