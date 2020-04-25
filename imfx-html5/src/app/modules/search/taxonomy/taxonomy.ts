/**
 * Created by Sergey Trizna on 10.01.2016.
 */
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Injector,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { LookupSearchLocationService } from '../../../services/lookupsearch/location.service';
import { IMFXControlsTreeComponent } from '../../controls/tree/imfx.tree';
import { TaxonomyType } from './types';
import { TreeStandardListTypes } from '../../controls/tree/types';
import { TaxonomyService } from './services/service';
@Component({
    selector: 'taxonomy',
    templateUrl: 'tpl/index.html',
    styleUrls: ['styles/index.scss'],
    providers: [
        LookupSearchLocationService,
        TaxonomyService
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaxonomyComponent {
    public data: any;
    public onReady: EventEmitter<void> = new EventEmitter<void>();
    private entries: TreeStandardListTypes = [];
    @ViewChild('tree') private tree: IMFXControlsTreeComponent;

    constructor(private injector: Injector,
                private service: TaxonomyService) {
        this.data = this.injector.get('modalRef');
    }

    ngAfterViewInit() {
        this.service.getTaxonomy()
            .subscribe(
                (data: Array<TaxonomyType>) => {
                    let normData: TreeStandardListTypes = this.tree.turnArrayOfObjectToStandart(
                        data, {
                            key: 'ID',
                            title: 'Name',
                            children: 'Children'
                        }
                    );
                    this.entries = normData;
                    this.tree.setSource(this.entries);
                    this.tree.expandAll();
                    setTimeout(() => {
                        this.onReady.emit();
                    });
                },
                (error: any) => {
                    console.error('Failed', error);
                }
            );
    }

    /**
     * Filter of data
     * @param $event
     */
    filter($event) {
        this.tree.filterCallback($event.target.value, function (str, node) {
            if (node.title != null) {
                let normTitle = str.toLowerCase();
                let normNodeTitle = node.title.toLowerCase();
                if (normNodeTitle.indexOf(normTitle) !== -1 || node.selected === true) {
                    return true;
                }
                return false;
            }
            return false;
        });
    }

    onClickByTreeItem($event) {
        let node = $event.data.node;
        if ($event.event.originalEvent.target.className !== 'fancytree-expander') {
            if (!node.children) {
                node = $event.data.node;
                if (node.children) return false;
                this.data._data.data.compContext.onSelect([$event.data.node]);
            } else {
                node = $event.data.node;
                node.setExpanded(!node.expanded);
            }
        }
    }

    onDblClickByTreeItem($event) {
        let node = $event.data.node;
        if (node.children) return false;
        this.data._data.data.compContext.onSelect([$event.data.node]);
        this.data.hide();
    }

    getSelected() {
        return this.tree.getSelected();
    }

    setSelectedByIds(arr: Array<number> = []) {
        $.each(arr, (k, id) => {
            this.tree.setSelectedById(id);
        });
    }
}
