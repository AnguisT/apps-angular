/**
 * Created by Sergey Trizna on 10.01.2016.
 */
import { ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Injector,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectorRef
} from '@angular/core';
import { LookupSearchLocationService } from '../../../services/lookupsearch/location.service';
import { IMFXControlsTreeComponent } from '../../controls/tree/imfx.tree';
import { LocationsListLookupTypes } from './types';
import { TreeStandardListTypes } from '../../controls/tree/types';
@Component({
    selector: 'location',
    templateUrl: 'tpl/index.html',
    styleUrls: ['./styles/index.scss'],
    providers: [
        LookupSearchLocationService
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LocationComponent {
    public modalRef: any;
    public onReady: EventEmitter<void> = new EventEmitter<void>();
    public onSelectEvent: EventEmitter<any> = new EventEmitter<any>();
    private locations: TreeStandardListTypes = [];
    @ViewChild('tree') private tree: IMFXControlsTreeComponent;

    constructor(private injector: Injector,
                private lookupSearchLocationService: LookupSearchLocationService,
                private cdr: ChangeDetectorRef) {
        this.modalRef = this.injector.get('modalRef');
    }

    ngAfterViewInit() {
        this.lookupSearchLocationService.getLocations()
            .subscribe(
                (data: LocationsListLookupTypes) => {
                    let normData: TreeStandardListTypes = this.tree.turnArrayOfObjectToStandart(
                        data,
                        {
                            key: 'ID',
                            title: 'NAM',
                            children: 'Children'
                        }
                    );
                    this.locations = normData;
                    this.tree.setSource(this.locations);
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

    onSelect($event) {
        this.onSelectEvent.emit(this.getSelected());
    }

    getSelected() {
        return this.tree.getSelected();
    }

    setSelectedByObject(arr) {
        let ids = [];
        arr.forEach((elem) => {
            ids.push(elem.key);
        });
        this.tree.setSelectedByArrayOfNodes(ids);
    }

    setSelectedByIds(arr: Array<number> = []) {
        this.tree.setSelectedByArrayOfNodes(arr);
    }

    setCheckboxByObj(arr) {
        // this.tree.toggleExpandAll();
        this.tree.setCheckboxForNodes(arr);
        // this.tree.toggleExpandAll();
    }
}
