/**
 * Created by Sergey Trizna on 22.11.2017.
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
    AdvancedSearchDataForControlType,
    AdvancedSearchDataFromControlType
} from '../../../../../../../../../types';
import { SearchAdvancedCriteriaProvider } from '../../../../../../../providers/provider';
import { RowNode } from 'ag-grid';
import {
    TreeStandardListOfPointersToNodesTypes,
    TreeStandardPointerToNodeType
} from '../../../../../../../../../../../controls/tree/types';
import { ModalComponent } from '../../../../../../../../../../../modal/modal';
import { TaxonomyComponent } from '../../../../../../../../../../taxonomy/taxonomy';
import { TaxonomyService } from '../../../../../../../../../../taxonomy/services/service';
import { IMFXModalProvider } from '../../../../../../../../../../../imfx-modal/proivders/provider';
import { IMFXModalEvent } from '../../../../../../../../../../../imfx-modal/types';
import { IMFXModalComponent } from '../../../../../../../../../../../imfx-modal/imfx-modal';

@Component({
    selector: 'advanced-criteria-control-hierarchical-lookupsearch-taxonomy-modal',
    templateUrl: 'tpl/index.html',
    providers: [
        TaxonomyService,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IMFXAdvancedCriteriaControlHierarchicalLookupSearchTaxonomyModalComponent {
    public data: AdvancedSearchDataForControlType;
    private modal: IMFXModalComponent;
    private result: AdvancedSearchDataFromControlType;
    private selectedNodes: any[] = [];

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

        this.cdr.detectChanges();
    }

    afterViewInit() {
        let value: AdvancedSearchDataFromControlType = this.data.criteria.data.value;
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
                this.onSelect(content.getSelected());
            });
        }
    }

    /**
     * Send data to parent comp
     */
    transferData(res: AdvancedSearchDataFromControlType) {
        this.transfer.onSelectValue(<AdvancedSearchDataFromControlType>res);
        // this.cdr.markForCheck();
    }

    showModal() {
        let self = this;

        this.modal = this.modalProvider.show(TaxonomyComponent, {
            size: 'lg',
            title: 'ng2_components.ag_grid.select_taxonomy',
            position: 'center',
            footer: 'ok'
        }, {compContext: this});

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
