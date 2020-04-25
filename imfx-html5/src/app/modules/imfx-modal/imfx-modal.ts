/**
 * Created by Sergey Trizna on 17.04.2018.
 */
import {
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    ElementRef,
    EventEmitter, Injector,
    NgZone,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
// provider
import {ModalProvider} from './providers/modal.provider';
import {Event as RouterEvent, NavigationStart, Router} from '@angular/router';
import {TranslateService} from 'ng2-translate';
import {BaseProvider} from '../../views/base/providers/base.provider';
import {IMFXModalEvent, IMFXModalInitialStateType, IMFXModalOptions} from './types';
import {ThemesProvider} from '../../providers/design/themes.providers';
import {BsModalRef} from 'ngx-bootstrap';
import {OverlayComponent} from '../overlay/overlay';


@Component({
    selector: 'imfx-modal',
    templateUrl: './tpl/index.html',
    styleUrls: ['./styles/index.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush, // default only!
    encapsulation: ViewEncapsulation.None,
})
export class IMFXModalComponent {
    private _data: IMFXModalInitialStateType;
    public contentView: any | null;
    @ViewChild('modalHeader') private modalHeaderRef: ElementRef;
    @ViewChild('modalBody') private modalBodyRef: ElementRef;
    @ViewChild('modalFooterContainer', {read: ViewContainerRef}) modalFooterContainerRef: ViewContainerRef;
    @ViewChild('modalFooter') private modalFooterRef: ElementRef;
    @ViewChild('overlayModal') private overlayModalRef: OverlayComponent;
    public modalEvents: EventEmitter<IMFXModalEvent> = new EventEmitter<IMFXModalEvent>();
    public onShow: EventEmitter<void> = new EventEmitter<void>();
    public onShown: EventEmitter<void> = new EventEmitter<void>();
    public onHide: EventEmitter<void> = new EventEmitter<void>();
    public onHidden: EventEmitter<void> = new EventEmitter<void>();

    constructor(protected ngZone: NgZone,
                private router: Router,
                private injector: Injector,
                private translate: TranslateService,
                private themesProvider: ThemesProvider,
                private baseProvider: BaseProvider) {
        router.events.subscribe((event: RouterEvent) => {
            this._navigationInterceptor(event);
        });
    }

    getData(): any {
        return this._data.data;
    }

    getModalOptions(): IMFXModalOptions {
        return this._data.modalOptions;
    }

    ngOnInit() {
        this.contentView = this.baseProvider.createComponent(this.getModalOptions()._compFunc, [
            {provide: 'modalRef', useValue: this}
        ]);
    }

    ngAfterViewInit() {
        // insert comp to DOM
        this.baseProvider.insertComponent(this.contentView, this.modalBodyRef.nativeElement);

        // build footer
        this.buildFooter();

        // set modal position
        this.applyCustomCss();
    }

    /**
     * Hide modal
     */
    hide(name: string = 'autohide', $event = null) {
        let mref = this.injector.get(BsModalRef);
        mref.hide();
        this.modalEvents.emit({
            name: name,
            $event: $event
        });
    }

    /**
     * Emmiter for events of buttons
     */
    emitClickFooterBtn(name: string, $event = null) {
        this.modalEvents.emit({
            name: name,
            $event: $event
        });
    }

    showOverlay() {
        this.overlayModalRef.show(this.modalBodyRef.nativeElement);
    }

    hideOverlay() {
        this.overlayModalRef.hide(this.modalBodyRef.nativeElement);
    }

    private _navigationInterceptor(event) {
        if (event instanceof NavigationStart) {
            this.ngZone.runOutsideAngular(() => {
                this.hide();
            });
        }
    }

    /**
     * Apply custom css styles
     */
    private applyCustomCss() {
        // color schema
        let dialogEl = $(this.modalHeaderRef.nativeElement).parent().parent().parent();
        // set position center
        if (this.getModalOptions().position == 'center') {
            dialogEl.css($.extend({}, {
                height: '80%',
                width: '100%',
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            }, this.getModalOptions().dialogStyles));
            dialogEl.find('.modal-content').css({width: '100%'});
        }

        // // fix for z-index
        // dialogEl.parent().css({zIndex:'1028'});
        // dialogEl.parent()
        // set xl size
        if (this.getModalOptions().size == 'xl') {
            dialogEl.css({
                maxWidth: '1140px'
            });
        }
    }


    private footerRef: ComponentRef<any>;

    private buildFooter() {
        if (this.getModalOptions().footerRef) {
            let footerRefStr = this.getModalOptions().footerRef;
            this.footerRef = this.contentView.instance[footerRefStr];
            // if(footerRef) {
            //     let footerView =  footerRef.createEmbeddedView(footerRef, {name: 'some description'});
            //     this.modalFooterContainerRef.insert(footerView);
            // }
        }
    }
}
