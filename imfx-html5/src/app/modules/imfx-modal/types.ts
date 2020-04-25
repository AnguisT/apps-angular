/**
 * Created by Sergey Trizna on 18.04.2018.
 */
import {ModalOptions} from "ngx-bootstrap";
import {IMFXModalComponent} from "./imfx-modal";
export type IMFXModalInitialStateType = {
    data?: any,
    modalOptions?: IMFXModalOptions
}

export type IMFXModalOptions = ModalOptions & {
    name?: string;
    dialogStyles?: JQueryCssProperties;
    footer?: IMFXModalFooterOptions|false|'ok'|'close'|'close|ok'|'cancel|ok';
    footerRef?: string;
    title?: string;
    size?:'sm'|'md'|'lg'|'xl';
    position?: 'center'|'top';
    _compFunc?: Function;
}

export type IMFXModalFooterOptions = {
    buttons: IMFXModalFooterButtonOptions[]|string|false
}

export type IMFXModalFooterButtonOptions = {
    name: string,
    label: string,
    // callBack: Function,
    classes?: string
}

export type IMFXModalEvent = {
    $event?: any,
    name: string|'hide'|'autohide',
    state?: any
}
