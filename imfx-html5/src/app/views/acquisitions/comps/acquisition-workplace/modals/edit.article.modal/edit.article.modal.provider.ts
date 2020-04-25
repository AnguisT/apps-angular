import {EventEmitter, Injectable} from "@angular/core";
import {ModalComponent} from "../../../../../../modules/modal/modal";
import {EditArticleModalComponent} from "./edit.article.modal.component";

@Injectable()
export class EditArticleModalProvider {

  moduleContext: EditArticleModalComponent;
  public editArticleModal: ModalComponent;
  public modalIsOpen: boolean = false;

  constructor() {
  }

  showModal(changeEmitter: EventEmitter<any>) {
    this.moduleContext.toggleOverlay(true);
    this.moduleContext.setData(changeEmitter);

    this.editArticleModal.onShow.subscribe(() => {
      this.modalIsOpen = true;

    });
    this.editArticleModal.onShown.subscribe(() => {

    });
    this.editArticleModal.onHide.subscribe(() => {
      this.modalIsOpen = false;
    });

    this.editArticleModal.show();
  }
}
