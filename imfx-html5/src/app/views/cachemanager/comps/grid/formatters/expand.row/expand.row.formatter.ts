/**
 * Created by Sergey Trizna on 17.01.2018.
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewEncapsulation} from "@angular/core";
import {Router} from "@angular/router";
import {SlickGridInsideExpandRowFormatterData} from "../../../../../../modules/search/slick-grid/types";
import {MisrSlickGridProvider} from "../../../../providers/misr.slickgrid.provider";
import {CMSlickGridProvider} from "../../../../providers/cm.slickgrid.provider";
import * as $ from "jquery";
import SlickData = Slick.SlickData;
import * as Rx from 'rxjs';

@Component({
    selector: 'cachemanager-grid-rows-cell-detail-component',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    // host: {
    //     '(document:click)': 'onDocumentClick($event)',
    //     '(window:resize)': 'onResize($event)',
    // },
    encapsulation: ViewEncapsulation.None,
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CacheManagerExpandRowComponent {
    public injectedData: {
        data: SlickGridInsideExpandRowFormatterData
    };
    private item: any;
    private provider: CMSlickGridProvider;
    private dataView: Slick.Data.DataView<SlickData>;
    private selector: string = '.cacheManagerExpandRowItemSettingsPopup';
    private popupOpened: boolean = false;
    private popupOpenedId: string;
    private documentClickSbscrb;
    constructor(private injector: Injector,
                private cdr: ChangeDetectorRef,
                protected router: Router,) {
        this.injectedData = this.injector.get('data');
        this.item = this.injectedData.data.item;
        this.provider = this.injectedData.data.provider;
        this.dataView = this.provider.getDataView();

        this.documentClickSbscrb = Rx.Observable.fromEvent(document, 'click').subscribe(() => {
            this.hidePopups()
        })
    }

    ngOnInit() {
        this.hidePopups();
        this.provider.onScrollGrid.subscribe(() => {
            this.hidePopups()
        })
        // this.dataView.beginUpdate(); // closed in updateData;
    }

    ngAfterViewInit() {
    }

    // popup
    tryOpenPopup($event) {
        let dropdown = $('cachemanager').find(this.selector);
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
            let sel = $('cachemanager').find(this.selector);
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
        let sel = $('cachemanager').find(this.selector);
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

    ngOnDestroy() {
        this.documentClickSbscrb.unsubscribe()
    }
}
