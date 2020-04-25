/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import * as $ from 'jquery';
import {
    Component,
    EventEmitter,
    Input,
    NgZone,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
// config for modal
import { ModalConfig } from './modal.config';
// blank modal
import { ModalBlankContentComponent } from './comps/blank/content';
// provider
import { ModalProvider, ModalProviderInterface } from './providers/modal.provider';
import { Event as RouterEvent, NavigationStart, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'modal',
    templateUrl: './tpl/index.html',
    styleUrls: ['./styles/index.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        ModalProvider
    ]
})
export class ModalComponent {
    onHidden: EventEmitter<any> = new EventEmitter<any>();
    onHide: EventEmitter<any> = new EventEmitter<any>();
    onShown: EventEmitter<any> = new EventEmitter<any>();
    onShow: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('contentContainer', {
        read: ViewContainerRef
    }) private contentContainerRef: ViewContainerRef;
    @ViewChild('moduleModal') private modalRef: any;
    @ViewChild('modalBody') private modalBody: any;

    @Input('config') set setConfig(config) {
        this.config = $.extend(true, this.config, config);
    }

    private config = <ModalConfig>{
        componentContext: <any>null,
        moduleContext: this,
        options: {
            provider: <ModalProviderInterface>null,
            modal: {
                type: 'custom',
                title: 'empty',
                size: 'sm',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: true,
                show: false,
                classes: '',
                overflow: 'hidden',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                isFooter: true,
                isHeader: true,
                height: '80vh',
                max_height: '600px'
            },
            content: {
                view: ModalBlankContentComponent
            },
            containerRef: null
        }
    };

    private heightStyle;

    constructor(protected provider: ModalProvider,
                private viewContainerRef: ViewContainerRef,
                protected ngZone: NgZone,
                private router: Router,
                private translate: TranslateService) {
        // Set default provider/services if custom is null
        !this.config.options.provider ?
            this.config.options.provider = this.provider :
            this.provider = this.config.options.provider;
        this.provider.config = this.config;
        // this.config.options.modal.isFooter ?
        //     (this.config.options.modal.size === 'sm' ?
        //         $(this.modalBody.nativeElement).height(`calc(${this.config.options.modal.height} - 127px)`) :
        //         $(this.modalBody.nativeElement).height(`calc(${this.config.options.modal.height} - 84px)`)) :
        //     $(this.modalBody.nativeElement).height(`calc(${this.config.options.modal.height} - 66px)`);

        // $(this.modalBody.nativeElement).height(`calc(${this.config.options.modal.height} - 127px)`);


        router.events.subscribe((event: RouterEvent) => {
            this._navigationInterceptor(event);
        });
    }

    ngOnInit() {
        this.provider.build(this.config, this.getReferences());
    }

    ngAfterViewInit() {
        // this.config.options.modal.isFooter ?
        //     (this.config.options.modal.size === 'sm' ?
        //         $(this.modalBody.nativeElement).height(`calc(${this.config.options.modal.height} - 127px)`) :
        //         $(this.modalBody.nativeElement).height(`calc(${this.config.options.modal.height} - 84px)`)) :
        //     $(this.modalBody.nativeElement).height(`calc(${this.config.options.modal.height} - 66px)`);
        this.addHeightForBody();

    }

    addHeightForBody() {
        if (this.config.options.modal.isFooter) {
            if (this.config.options.modal.size === 'sm') {
                $(this.modalBody.nativeElement).height(
                    `calc(${this.config.options.modal.height} - 127px)`
                );
                $(this.modalBody.nativeElement).css('max-height',
                    `calc(${this.config.options.modal.max_height} - 127px)`
                );
            } else if (this.config.options.modal.size === 'md') {
                $(this.modalBody.nativeElement).height(
                    `calc(${this.config.options.modal.height} - 66px)`
                );
                $(this.modalBody.nativeElement).css('max-height',
                    `calc(${this.config.options.modal.max_height} - 66px)`
                );
            } else {
                $(this.modalBody.nativeElement).height(
                    `calc(${this.config.options.modal.height} - 84px)`
                );
                $(this.modalBody.nativeElement).css('max-height',
                    `calc(${this.config.options.modal.max_height} - 84px)`
                );
            }
        } else {
            $(this.modalBody.nativeElement).height(
                `calc(${this.config.options.modal.height} - 66px)`
            );
            $(this.modalBody.nativeElement).css('max-height',
                `calc(${this.config.options.modal.max_height} - 66px)`
            );
        }
    }

    /**
     * Return content view of modal component
     * @returns {boolean}
     */
    getContent(): any {
        let content = this.getCompiledView();
        let res = false;
        if (content) {
            res = content.instance;
        }

        return res;
    }

    /**
     * Get reference to compiled component
     * @returns {any}
     */
    getCompiledView() {
        return this.provider.compiledContentView;
    }

    /**
     * Get reference to modal directive
     */
    getModal() {
        return this.modalRef;
    }

    /**
     * (Syntactic sugar) show modal
     */
    show(customTitle?: string, isFooterCustom?: boolean, maxHeight?: string) {
        this.getModal().show();
        if (customTitle) {
            this.config.options.modal.title = this.translate.instant(<string>customTitle);
        } else {
            let title = this.config.options.modal.title;
            if (this.config.options.modal.title.toString().indexOf('.') !== -1) {
                this.config.options.modal.title = this.translate.instant(<string>title);
            }
        }
        if (isFooterCustom === true || isFooterCustom === false) {
            this.config.options.modal.isFooter = isFooterCustom;
        }
        if (maxHeight) {
            this.config.options.modal.max_height = maxHeight;
            this.addHeightForBody();
        }
    }

    /**
     * (Syntactic sugar) hide modal
     */
    hide() {
        let modal = this.getModal();
        $(modal._element.nativeElement).find('#formGroupExampleInput').val('');
        modal.hide();
        $(modal._element.nativeElement).hide();
        // TODO Fix it
        // fix for https://github.com/twbs/bootstrap/issues/12990
        // $('body').find('bs-modal-backdrop').remove();
    }

    /**
     * (Syntactic sugar) set text to modal
     */
    public setText(text: string): ModalComponent {
        let content = this.getContent();
        if (content.setText) {
            content.setText(text);
        }

        return this;
    }

    public setCallback(callback: any): ModalComponent {
        let content = this.getContent();
        if (content.setCallback) {
            content.setCallback(callback);
        }

        return this;
    }

    private _navigationInterceptor(event) {
        if (event instanceof NavigationStart) {
            this.ngZone.runOutsideAngular(() => {
                this.hide();
            });
        }
    }

    private _onShow() {
        let title = this.config.options.modal.title;
        if (this.config.options.modal.title.toString().indexOf('.') !== -1) {
            this.config.options.modal.title = this.translate.instant(<string>title);
        }
        let el = this.getModal()._element.nativeElement;
        // let mbody = $(el).find('.modal-body');
        // mbody.css('height', ($(document).height() * 0.7));
        // $(window).on('resize', () => {
        //     mbody.css('height', ($(document).height() * 0.7));
        // });

        return this.onShow.emit();
    }

    private _onHide($event) {
        return this.onHide.emit($event);
    }

    private _onHidden() {
        return this.onHidden.emit();
    }

    private _onShown() {
        return this.onShown.emit();
    }


    private getReferences() {
        return {
            content: this.contentContainerRef,
            modal: this.modalRef
        };
    }
}
