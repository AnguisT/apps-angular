import {EventEmitter, Injectable} from "@angular/core";
import {ModalComponent} from "../../../../../../modules/modal/modal";
import {EditAcquisitionModalComponent} from "./edit.acquisition.modal.component";

@Injectable()
export class EditAcquisitionModalProvider {

  moduleContext: EditAcquisitionModalComponent;
  public editAcquisitionModal: ModalComponent;
  public modalIsOpen: boolean = false;

  constructor() {
  }

  showModal(changeEmitter: EventEmitter<any>) {
    this.moduleContext.toggleOverlay(true);
    this.moduleContext.setData(changeEmitter);

    this.editAcquisitionModal.onShow.subscribe(() => {
      this.modalIsOpen = true;

    });
    this.editAcquisitionModal.onShown.subscribe(() => {

    });
    this.editAcquisitionModal.onHide.subscribe(() => {
      this.modalIsOpen = false;
    });

    this.editAcquisitionModal.show();
  }
}
