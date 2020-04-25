/**
 * Created by Sergey Trizna on 17.04.2018.
 */

import {Injectable, Injector} from "@angular/core";
import {BsModalService} from "ngx-bootstrap/modal";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {IMFXModalComponent} from "../imfx-modal";
import {IMFXModalOptions} from "../types";
import {ThemesProvider} from "../../../providers/design/themes.providers";
@Injectable()
export class IMFXModalProvider {
    constructor(private injector: Injector) {
    }

    show(comp: Function,
         modalOptions: IMFXModalOptions = {}, externalData = {}): IMFXModalComponent {
        let _defaultOptions = {
            backdrop: "static",
            keyboard: true,
            focus: true,
            ignoreBackdropClick: false,
            class: 'imfx-modal',
            animated: true,
            show: true,
            size: 'md',
            position: 'center',
            title: '',
            dialogStyles: {}
        };
        let themesProvider = this.injector.get(ThemesProvider);
        // let modalRef = this.injector.get(BsModalRef);
        let modalService = this.injector.get(BsModalService);

        modalOptions = $.extend(true, {} , _defaultOptions, modalOptions);

        // classes
        if (!modalOptions.class) {
            modalOptions.class = "";
        }
        // size
        modalOptions.class = modalOptions.class + ' modal-' + modalOptions.size;

        // position
        if (modalOptions.position == 'center') {
            modalOptions.class = modalOptions.class + ' modal-centred';
        }

        // theme
        modalOptions.class = modalOptions.class + " " + themesProvider.getCurrentTheme();

        // name
        if (modalOptions.name) {
            modalOptions.class = modalOptions.class + " " + modalOptions.name;
        }


        // component func
        modalOptions._compFunc = comp;
        // common data object
        let opts = modalOptions;
        opts.initialState = {
            _data: {
                data: externalData,
                modalOptions: modalOptions
            }
        };

        let modalRef = modalService.show(IMFXModalComponent, opts);
        // modalRef.content.hide = () => {
        //     let a = modalRef.content.modalEvents.emit({
        //         name: 'hide',
        //         $event: {}
        //     });
        //     console.log(a);
        //     debugger
        //     modalRef.hide();
        // };
        //
        // let onShowSbscr = modalService.onShow.subscribe(function () {
        //     // modalRef.content.onShow.emit();
        //     // onShowSbscr.unsubscribe();
        // });
        //
        // let onShownSbscr = modalService.onShown.subscribe(function() {
        //     // for slick grid
        //     if(modalRef.content && modalRef.content.slickGridComp){
        //         modalRef.content.slickGridComp.provider.resize();
        //     }
        //     // modalRef.content.onShown.emit();
        //     // onShownSbscr.unsubscribe();
        // });
        //
        // let onHideSbscr = modalService.onHide.subscribe(function($event) {
        //             modalRef.content.emitClickFooterBtn('hide', $event);
        //             onHideSbscr.unsubscribe();
        //         });
        //
        // let onHiddenSbscr = modalService.onHidden.subscribe(function() {
        //     // modalRef.content.onHidden.emit();
        //     // onHiddenSbscr.unsubscribe();
        // });

        return modalRef.content;
    }

    // show(comp, externalData: Object = {}, modalOptions: ModalOptions = {
    //     backdrop: "static",
    //     keyboard: true,
    //     focus: true,
    //     ignoreBackdropClick: true,
    //     class: 'imfx-modal',
    //     animated: true,
    //     show: true
    // }) {
    //     let guid = Guid.newGuid();
    //     $('body').append('<div class="imfx-modal-wrapper" id="'+guid+'"></div>');
    //     let html = $('.imfx-modal-wrapper#'+guid);
    //     let compRef:ComponentRef<any> = this.baseProvider.buildComponent(comp, externalData, html);
    //     let initialState = <IMFXModalInitialStateType>{
    //         contentCompRef: compRef,
    //         externalData: externalData
    //     };
    //
    //     let opts = $.extend(true, initialState, modalOptions);
    //
    //     this.modalRef = this.modalService.show(IMFXModalComponent, opts);
    // }

}


// export function IMFXModalProviderFactory(injector: Injector) {
//     return new IMFXModalProvider(injector);
// };
