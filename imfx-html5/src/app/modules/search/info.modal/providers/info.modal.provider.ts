import {EventEmitter,Injectable} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {InfoModalConfig} from '../info.modal.config';
import { ModalDirective } from 'ngx-bootstrap';

export interface InfoModalProviderInterface {
    config: InfoModalConfig;
    bodyText: String;
    headerText: String;
    cancel: boolean;
    ok: boolean;
  /**
   * On show modal
   * @type {EventEmitter<any>}
   */
    onShowModal: EventEmitter<any>;

    showErrorModal(staticModal): void;
    showSuccessAlert(): void;
}
@Injectable()
export class InfoModalProvider implements InfoModalProviderInterface {
    config: InfoModalConfig;
    bodyText: String;
    headerText: String;
    cancel = true;
    ok = true;

    onShowModal: EventEmitter<any> = new EventEmitter<any>();

    public showErrorModal(errorText): void {
        let modal = this.config.moduleContext.modalProvider.getModal('error');
        if (modal) {
            modal.setText(errorText + "\r\n").show();
        } else {
            //alert(error.getText());
        }
    };

    public showSuccessAlert(): void {
        this.config.options.showAlert = true;
        setTimeout(() => {
            this.config.options.showAlert = false;
        },1500);
    };
}
