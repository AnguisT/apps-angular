/**
 * Created by Sergey Trizna on 17.01.2016.
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    LookupSearchLocationService
} from '../../../../../../../../../../../../services/lookupsearch/location.service';
import { LocationComponent } from '../../../../../../../../../../location/location';
import { ModalConfig } from '../../../../../../../../../../../modal/modal.config';
import {
    AdvancedSearchDataForControlType, AdvancedSearchDataFromControlType
} from '../../../../../../../../../types';
import { SearchAdvancedCriteriaProvider } from '../../../../../../../providers/provider';
import { RowNode } from 'ag-grid';
import {
    TreeStandardListOfPointersToNodesTypes,
    TreeStandardPointerToNodeType
} from '../../../../../../../../../../../controls/tree/types';
import { ModalComponent } from '../../../../../../../../../../../modal/modal';
import { IMFXModalProvider } from '../../../../../../../../../../../imfx-modal/proivders/provider';
import { IMFXModalComponent } from '../../../../../../../../../../../imfx-modal/imfx-modal';
import { IMFXModalEvent } from '../../../../../../../../../../../imfx-modal/types';
import { BsModalService } from 'ngx-bootstrap';

@Component({
    selector: 'advanced-criteria-control-hierarchical-lookupsearch-location-modal',
    templateUrl: 'tpl/index.html',
    providers: [
        LookupSearchLocationService,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IMFXAdvancedCriteriaControlHierarchicalLookupSearchLocationModalComponent {
    public data: AdvancedSearchDataForControlType;
    private result: AdvancedSearchDataFromControlType;
    private selectedNodes: any[] = [];
    private modalRef: any;
    private modal: IMFXModalComponent;
    private modalService;


    constructor(private injector: Injector,
                private transfer: SearchAdvancedCriteriaProvider,
                private cdr: ChangeDetectorRef,
                private modalProvider: IMFXModalProvider) {
        this.data = this.injector.get('data');
    }

    onSelect(nodes: RowNode[]) {
        this.selectedNodes = nodes;
        let humanValue = [];
        let value = [];
        let dirtyValue: TreeStandardListOfPointersToNodesTypes = [];
        nodes.forEach((obj: any) => {
            dirtyValue.push(<TreeStandardPointerToNodeType>{key: obj.key});
            humanValue.push(obj.title);
            value.push(obj.key);
        });

        this.result = {
            dirtyValue: dirtyValue,
            value: value.join('|'),
            humanValue: humanValue.join('|')
        };
        this.transferData(<AdvancedSearchDataFromControlType>this.result);
    }

    afterViewInit() {
        let self = this;
        let value: AdvancedSearchDataFromControlType = this.data.criteria.data.value;
        let valueCriteria = this.transfer.data;
        let content: LocationComponent = this.modal.contentView.instance;
        let _ids = [];
        if (value) {
            let dv = value.dirtyValue;
            if (!dv) {
                _ids = (<string>value.value).split('|');
            } else {
                $.each(dv, (i, o) => {
                    _ids.push(o.key);
                });
            }

            content.onReady.subscribe(() => {
                content.setSelectedByIds(_ids);
                self.onSelect(content.getSelected());
                content.setCheckboxByObj(content.getSelected());
            });
        }
        if (valueCriteria) {
            let dv = valueCriteria.dirtyValue;
            $.each(dv, (i, o) => {
                _ids.push(o.key);
            });

            content.onReady.subscribe(() => {
                content.setSelectedByIds(_ids);
                self.onSelect(content.getSelected());
                content.setCheckboxByObj(content.getSelected());
            });
        }
        content.onSelectEvent.subscribe((selected) => {
            content.setSelectedByObject(selected);
            self.onSelect(selected);
        });
    }

    /**
     * Send data to parent comp
     */
    transferData(res: AdvancedSearchDataFromControlType) {
        this.transfer.onSelectValue(<AdvancedSearchDataFromControlType>res);
        this.cdr.markForCheck();
    }

    showModal() {
        let self = this;

        this.modal = this.modalProvider.show(LocationComponent, {
            size: 'lg',
            title: 'ng2_components.ag_grid.select_location',
            position: 'center',
            footer: 'ok'
        });

        this.modal.modalEvents.subscribe((e: IMFXModalEvent) => {
            if (e.name === 'ok') {
                self.modal.hide();
            }
        });

        this.afterViewInit();
    }

    ngOnDestroy() {
        // this.data.selected = null;
    }
}
