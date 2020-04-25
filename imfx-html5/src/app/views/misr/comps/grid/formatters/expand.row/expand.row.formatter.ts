/**
 * Created by Sergey Trizna on 17.01.2018.
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewEncapsulation} from "@angular/core";
import {appRouter} from "../../../../../../constants/appRouter";
import {Router} from "@angular/router";
import SlickData = Slick.SlickData;
import {SlickGridInsideExpandRowFormatterData} from "../../../../../../modules/search/slick-grid/types";
import {SlickGridProvider} from "../../../../../../modules/search/slick-grid/providers/slick.grid.provider";
import {MisrSlickGridProvider} from "../../../../providers/misr.slickgrid.provider";
import * as Cookies from 'js-cookie';
import * as $ from "jquery";
import * as Rx from 'rxjs';

@Component({
    selector: 'misr-grid-rows-cell-detail-component',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        // ChartService
        // WorkflowSlickGridProvider
        // WorkflowAccordionProvider,
        // AccordionService,
        // SilverlightProvider
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MisrExpandRowComponent {
    private item: any;
    private items: any[];
    private provider: MisrSlickGridProvider;
    private tasks: any;
    public injectedData: {
        data: SlickGridInsideExpandRowFormatterData
    };
    private dataView: Slick.Data.DataView<SlickData>;
    private selector: string = '.misrExpandRowItemSettingsPopup';
    private popupOpened: boolean = false;
    private popupOpenedId: string;
    private documentClickSbscrb;
    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef,
                protected router: Router,) {
        this.injectedData = this.injector.get('data');
        this.item = this.injectedData.data.item;
        this.provider = this.injectedData.data.provider;
        this.items = this.item.items;
        this.dataView = this.provider.getDataView();
    }

    ngOnInit() {
        this.dataView.beginUpdate(); // closed in updateData;
        this.hidePopups();
        this.provider.onScrollGrid.subscribe(() => {
            this.hidePopups()
        });
        this.documentClickSbscrb = Rx.Observable.fromEvent(document, 'click').subscribe(() => {
            this.hidePopups()
        })
    }

    ngAfterViewInit() {

        // this.items[0].hideme = true;
        // this.items[3].hideme = true;
    }

    onClick($event, group, state = null) {
        let slick = this.provider.getSlick();
        this.dataView.beginUpdate();
        if(state == null){
            group.hideme = !group.hideme;
        } else {
            group.hideme = state;
        }

        if (!group.hideme) {
            this.contentReady();
            this.provider.addExpandableRows(this.item, group.props.length, group._id);
            this.addExpandRow(this.item.id, group._id);
        } else {
            let idsForRemove = [];
            $.each(group.props, (k, prop) => {
                let key = k + 1;
                idsForRemove.push(this.provider.getAdditionalRowId(this.item.id, key, group._id))
            });
            this.provider.removeExpandableRows(this.item, idsForRemove);
            this.removeExpandRow(this.item.id, group._id)
        }
        console.log(this.provider.expandedSubRowsRows);

        this.dataView.endUpdate();
        slick.updateRowCount();
        // slick.resizeCanvas();
        this.provider.resize();
        this.cdr.markForCheck()
    }

    updateData(item) {
        this.items = item.items;
        let slick = this.provider.getSlick();
        let audioRequirementsGroup = this.items[1];
        let subtitleRequirementsGroup = this.items[2];
        let needUpdate = false;
        this.items[0].hideme = true;
        this.items[3].hideme = true;
        if (audioRequirementsGroup._props.length > 0) {
            this.items[1].props = audioRequirementsGroup._props;
            this.provider.addExpandableRows(this.item, audioRequirementsGroup._props.length, audioRequirementsGroup._id);
            needUpdate = true;
            this.addExpandRow(this.item.id, this.items[1]._id);
        }
        //
        //
        if (subtitleRequirementsGroup._props.length > 0) {
            this.items[2].props = subtitleRequirementsGroup._props;
            this.provider.addExpandableRows(this.item, subtitleRequirementsGroup._props.length, subtitleRequirementsGroup._id);
            needUpdate = true;
            this.addExpandRow(this.item.id, this.items[2]._id);
        }

        let rowsForCurrentPage = this.getExpRowsForCurrentPage();
        // let _lastInterGr = null;
        $.each(rowsForCurrentPage, (k, ar) => {
                if(this.items[ar[2]].hideme == true){
                    this.onClick(null, this.items[ar[2]], false);
                }
        });

        if (needUpdate) {
            slick.updateRowCount();
            //
        }


        this.dataView.endUpdate();
        this.provider.resize();

        this.cdr.markForCheck()
    }

    contentReady() {
        // setTimeout(() => {
        //     this.config.options.provider.contentReadyEvent(), 0
        // });
    }

    goToDetail(id, type) {
        if (type === 'Media Items')
            Cookies.set('forceBackRoute', 'misr', { expires: 365 });
        // this.router.navigate(['media/detail', id]);
            this.router.navigate(
                [
                    appRouter.media.detail.substr(
                        0,
                        appRouter.media.detail.lastIndexOf('/')
                    ),
                    id
                ]
            );
    }



    selectExpandedRow(rowIndex, remove) {
        // rowIndex--;
        // this.parentContainer = $(".ag-row[row='" + rowIndex + "']")
        // if(remove) {
        //     this.parentContainer.removeClass("imfx-grid-row-expanded");
        // } else {
        //     this.parentContainer.addClass("imfx-grid-row-expanded");
        // }
    }

    ngOnDestroy() {
        this.documentClickSbscrb.unsubscribe()
    }

    // popup
    tryOpenPopup($event) {
        let dropdown = $('misr').find(this.selector);
        let element = $event.target;
        let target = 0;
        for (var i = 0; i < dropdown.length; i++) {
            target += $(dropdown[i]).has(element).length;
            if (target === 0) {
                this.hidePopups();
            }
        }
        if (target === 1) {
            this.openPopups($event);
        }
    }


    openPopups($event) {
        let btnEl = $($event.target);
        if (!this.popupOpened || (btnEl.data('rowid') != null && btnEl.data('rowid') != this.popupOpenedId)) {
            this.provider.hidePopups();
            let offset = <any>btnEl.offset();
            offset.top = offset.top + 4;
            offset.left = offset.left;
            let sel = $('misr').find(this.selector);
            $(sel).css(offset);
            $(sel).show();

            let outOfconfines = $(window).height() - $(this.selector).children().height() - offset.top - 15;
            if (outOfconfines < 0) {
                offset.top = offset.top + outOfconfines;
            }
            $(sel).css(offset);
            this.popupOpened = true;
            this.popupOpenedId = btnEl.data('rowid');
        } else {
            this.hidePopups();
        }

        $event.preventDefault();
        $event.stopPropagation();
        return false;
    }

    hidePopups() {
        this.popupOpened = false;
        this.popupOpenedId = null;
        let sel = $('misr').find(this.selector);
        $(sel).hide();
        return;
    }

    onDocumentClick($event) {
        debugger;
        let btnEl = $($event.target);
        if ($(btnEl).data('rowid') && $(btnEl).data('rowid').indexOf('subrow') > -1) {
            this.tryOpenPopup($event);
        } else {
            this.hidePopups();
            $event.stopPropagation()
            // $event.preventDefault();
        }
    }

    onResize() {
        this.hidePopups()
    }

    private addExpandRow(itemId = null, groupId = null) {
        let val = this.provider.PagerProvider.getCurrentPage() + '|' + itemId + '|' + groupId;
        let expSubRows = this.provider.expandedSubRowsRows;
        if(expSubRows.indexOf(val) == -1) {
            expSubRows.push(val)
        }
    }

    private removeExpandRow(itemId = null, groupId = null) {
        let val = this.provider.PagerProvider.getCurrentPage() + '|' + itemId + '|' + groupId;
        let expSubRows = this.provider.expandedSubRowsRows;
        let index = expSubRows.indexOf(val);
        if(index > -1) {
            expSubRows.splice(index, 1)
        }
    }

    private onDestroy(item) {
        $.each(this.provider.expandedSubRowsRows, (k, v:string) => {
            if(v){
                let valArr = v.split('|');
                if(valArr[0] == this.provider.PagerProvider.getCurrentPage().toString() && valArr[1] == item.id){
                    this.removeExpandRow(valArr[1], valArr[2]);
                }
            }
        })
    }

    private getExpRowsForCurrentPage(): number[] {
        let page = this.provider.PagerProvider.getCurrentPage().toString();
        let res = [];
        $.each(this.provider.expandedSubRowsRows, (k, v:string) => {
            if(v){
                let valArr = v.split('|');
                if(valArr[0] == page){
                    res.push(valArr);
                }
            }
        });


        return res;
    }
}
