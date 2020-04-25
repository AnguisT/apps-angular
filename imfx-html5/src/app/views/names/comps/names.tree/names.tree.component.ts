import {
    ChangeDetectorRef,
    Component, ElementRef, EventEmitter, Injector, ViewChild, ViewEncapsulation
} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {IMFXControlsTreeComponent} from "../../../../modules/controls/tree/imfx.tree";
import {NamesService} from "../../services/names.service";
import {TreeStandardListTypes} from "../../../../modules/controls/tree/types";
import {IMFXModalComponent} from "../../../../modules/imfx-modal/imfx-modal";
import {IMFXModalProvider} from "../../../../modules/imfx-modal/proivders/provider";
import {NamesModalComponent} from "../../modals/names.modal/names.modal.component";
import {LookupService} from "../../../../services/lookup/lookup.service";


@Component({
    selector: 'names-tree',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        NamesService,
        IMFXModalProvider
    ]
})

export class NamesTreeComponent {

    @ViewChild('tree') public tree: IMFXControlsTreeComponent;
    @ViewChild('overlayWrapper') public overlayWrapper: ElementRef;
    @ViewChild('detailOverlayWrapper') public detailOverlayWrapper: ElementRef;
    public doSearch:EventEmitter<any>  = new EventEmitter<any>();

    private fieldLabels = {

    };

    private mainData: TreeStandardListTypes = [];
    private data = [];
    private activeData = null;
    private addModal: IMFXModalComponent;
    private editModal: IMFXModalComponent;
    private countries = [];

    constructor(protected injector: Injector,
                protected router: Router,
                protected service: NamesService,
                protected cdr: ChangeDetectorRef,
                protected lokupService: LookupService,
                protected modalProvider: IMFXModalProvider,
                protected route: ActivatedRoute) {
    }

    ngOnInit() {
        this.doSearch.subscribe((data) => {
            this.toggelOverlay(true);
            this.service.getData(data).subscribe((res) => {
                this.data = res.Data;
                this.mainData = this.tree.turnArrayOfObjectToStandart(this.data, {
                    key: 'ID',
                    title: 'NAME',
                    children: 'Children',
                });
                this.tree.setSource(this.mainData);
                this.toggelOverlay(false);
                this.cdr.detectChanges();
            });
        });

        this.lokupService.getLookups('Countries').subscribe((res) => {
            if(res && res.length > 0) {
                this.countries = res;
                this.cdr.detectChanges();
            }
        });
    }

    getCountry(id) {
        if(id == null || this.countries.length == 0) {
            return "";
        }
        return this.countries.filter(function( obj ) {
            return obj.Id == id;
        });
    }

    ngOnDestroy() {
        this.doSearch.unsubscribe();
    }

    toggelOverlay(show) {
        if(show) {
            $(this.overlayWrapper.nativeElement).show();
        }
        else {
            $(this.overlayWrapper.nativeElement).hide();
        }
    }
    toggelDetailOverlay(show) {
        if(show) {
            $(this.detailOverlayWrapper.nativeElement).show();
        }
        else {
            $(this.detailOverlayWrapper.nativeElement).hide();
        }
    }

    onSelect(e) {
        if (e.data.targetType == "title") {
            this.toggelDetailOverlay(true);
            this.service.getDetail(e.data.node.data.dirtyObj.ID).subscribe((res) => {
                this.activeData = res;
                console.log(this.activeData);
                this.cdr.detectChanges();
                this.toggelDetailOverlay(false);
            });
        }
    }
    toggleTree(expand) {
        if (expand) {
            this.tree.expandAll();
        }
        else {
            this.tree.collapseAll();
        }
    }

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
                }this.addModal = this.modalProvider.show(NamesModalComponent, {
                    size: 'lg',
                    title: 'names.addmodal.title',
                    position: 'center',
                    footerRef: 'modalFooterTemplate'
                }, {namesContext: this});
                this.addModal.modalEvents.subscribe((res) => {
                    debugger;
                })
            }
        }
        return matches;
    }

    showAddModal() {

    }

    showEditModal() {
        this.editModal = this.modalProvider.show(NamesModalComponent, {
            size: 'lg',
            title: 'names.editmodal.title',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        }, {namesContext: this, nameData: this.activeData});
        this.editModal.modalEvents.subscribe((res) => {
            debugger;
        })
    }
}
