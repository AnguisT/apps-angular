import {EventEmitter, Injectable} from "@angular/core";
import {ModalComponent} from "../../../../../../modules/modal/modal";
import {NewContactModalComponent} from "./new.contact.modal.component";

@Injectable()
export class NewContactModalProvider {

  moduleContext: NewContactModalComponent;
  public newContactModal: ModalComponent;
  public modalIsOpen: boolean = false;

  constructor() {
  }

  showModal() {
    this.moduleContext.toggleOverlay(true);
    this.moduleContext.setData();

    this.newContactModal.onShow.subscribe(() => {
      this.modalIsOpen = true;

    });
    this.newContactModal.onShown.subscribe(() => {

    });
    this.newContactModal.onHide.subscribe(() => {
      this.modalIsOpen = false;
    });

    this.newContactModal.show();
  }
}
