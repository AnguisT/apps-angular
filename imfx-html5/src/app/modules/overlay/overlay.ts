/**
 * Created by Sergey Trizna on 12.06.2017.
 */
// see: https://gasparesganga.com/labs/jquery-loading-overlay/
import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {Location} from "@angular/common";
import {TranslateService} from "ng2-translate";
import {ThemesProvider} from "../../providers/design/themes.providers";
import * as $ from "jquery";
require('gasparesganga-jquery-loading-overlay/src/loadingoverlay.js');
require('gasparesganga-jquery-loading-overlay/extras/loadingoverlay_progress/loadingoverlay_progress.js');

@Component({
    selector: 'overlay',
    templateUrl: './tpl/index.html',
    styleUrls: ['./styles/index.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class OverlayComponent {
    @Input('color') private color = 'rgba(255, 255, 255, 1)';
    @Input('detail') private detail: boolean = false;
    @Input('image') private image = '';
    @Input('custom') private custom = '<div class="spinner large"></div>';
    @Input('maxSize') private maxSize = "80px";
    @Input('minSize') private minSize = "20px";
    @Input('resizeInterval') private resizeInterval = 50;
    @Input('size') private size = "50%";
    @Input('fade') private fade = [250, 700];
    @Input('mode') private mode: boolean = false;
    @Input('zIndex') private zIndex: number = 9999;
    // @Input('recentMode') private recentMode: boolean = false;
    // @Input('queueMode') private queueMode: boolean = false;
    // @Input('simpleMode') private simpleMode: boolean = false;
    // @Input('groupsMode') private groupsMode: boolean = false;
    private extendsOptions = {};
    private timeoutHandler: any;
    private text: string;
    private realElementZIndex: string | number = null;
    @Output('isError') public isError: EventEmitter<any> = new EventEmitter<any>();
    @Output('onHide') public onHide: EventEmitter<void> = new EventEmitter<void>();
    private isShowed: boolean = false;

    /**
     * Get default options
     * @returns Object
     */
    public getDefaultOptions() {
        return {
            color: this.color,
            image: this.image,
            custom: this.custom,
            maxSize: this.maxSize,
            minSize: this.minSize,
            resizeInterval: this.resizeInterval,
            size: this.size,
            fade: this.fade,
            zIndex: this.zIndex
        };
    }

    /**
     * Set default options
     * @param paramOptions
     */
    public setDefaultOptions(paramOptions) {
        this.extendsOptions = Object.assign(
            {}, // blank
            this.getDefaultOptions(),// default options
            paramOptions // options from params
        );
    }

    /**
     * Returned current state options for plugin
     * @returns Object
     */
    public getActualOptions(paramOptions = {}) {
        let color = this.themesProvider.getColorByCode(30);
        let opts = Object.assign(
            {}, // blank
            this.getDefaultOptions(),// default options
            {color: color},
            this.extendsOptions, // actually options
            paramOptions, // options from params
        );

        return opts;
    }

    constructor(private location: Location,
                private themesProvider: ThemesProvider,
                private translate: TranslateService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        (<any>$).LoadingOverlaySetup(this.getActualOptions());
    }

    showWithButton(el) {
        let text = this.translate.instant("common.cancel");
        let self = this;
        (<any>$).LoadingOverlaySetup(this.getActualOptions());
        this.timeoutHandler = setTimeout(function () {
            (<any>$(el)).LoadingOverlay('hide', true);
            self.custom = "<div class='spinner large'></div><button id='buttonCancel' class='icon-button-overlay' style='margin-top: 10px' title='Back'>" + text + "</button>";
            (<any>$(el)).LoadingOverlay('show', {
                custom: self.custom
            });
            let theme = $('.common-app-wrapper').hasClass('default') ? 'default' : 'dark';
          $('.loadingoverlay').removeClass('dark');
          $('.loadingoverlay').removeClass('default');
          $('.loadingoverlay').addClass(theme);
            $('overlay').removeClass('dark');
            $('overlay').removeClass('default');
            $('overlay').addClass(theme);
            let button = $('#buttonCancel');
            button.on('click', function () {
                if (self.mode) {
                    self.hide(el);
                    self.isError.emit(true);
                    self.custom = '<div class="spinner large"></div>';
                } else {
                    self.clickBack();
                    self.custom = '<div class="spinner large"></div>';
                }
            });
        }, 5000);
    }

    show(el) {
        if (!this.isShowed) {
            (<any>$(el)).LoadingOverlay("show");
            this.isShowed = true;
            this.showWithButton(el);
            this.realElementZIndex = $(el).css('zIndex');
            $(el).css('zIndex', isNaN(parseInt($(el).css('zIndex'))) ? -999 : parseInt($(el).css('zIndex')) - 1);
            let theme = $('.common-app-wrapper').hasClass('default') ? 'default' : 'dark';
            $('overlay').removeClass('dark');
            $('overlay').removeClass('default');
            $('overlay').addClass(theme);
        }
    }

    showWithoutButton(el) {
        this.isShowed = true;
        (<any>$).LoadingOverlaySetup(this.getActualOptions());
        (<any>$(el)).LoadingOverlay("show");
    }

    clickBack() {
        this.location.back();
    }

    hide(el) {
        this.isShowed = false;
        (<any>$(el)).LoadingOverlay("hide", true);
        clearTimeout(this.timeoutHandler);
        this.custom = '<div class="spinner large"></div>';
        if (this.realElementZIndex != null) {
            $(el).css('zIndex', this.realElementZIndex);
            this.realElementZIndex = null;
        }
        $(document).find('.loadingoverlay').remove();
        this.onHide.emit();
    }

    showWhole() {
        this.isShowed = true;
        (<any>$).LoadingOverlay("show");
    }

    hideWhole() {
        this.isShowed = false;
        (<any>$).LoadingOverlay("hide", true);
        clearTimeout(this.timeoutHandler);
        this._hide();
    }

    isShowedOverlay(): boolean {
        return this.isShowed;
    }

    private _hide() {
        this.isShowed = false;
        $('.loadingoverlay').hide();
    }
}
