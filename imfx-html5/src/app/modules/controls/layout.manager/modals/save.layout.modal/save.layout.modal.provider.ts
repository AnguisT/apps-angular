import {EventEmitter, Injectable} from "@angular/core";
import {ModalComponent} from "../../../../modal/modal";
import {SaveLayoutModalComponent} from "./save.layout.modal.component";
import {LayoutManagerModel, LayoutType} from "../../models/layout.manager.model";

@Injectable()
export class SaveLayoutModalProvider {

  moduleContext: SaveLayoutModalComponent;
  public saveLayoutModal: ModalComponent;
  public modalIsOpen: boolean = false;
  private layout: any = {};

  constructor() {
  }

  showModal(layoutType: LayoutType, layoutModel: LayoutManagerModel, isShared: boolean, changeEmitter: EventEmitter<LayoutManagerModel>) {
    this.moduleContext.toggleOverlay(true);
    this.moduleContext.setData(layoutType, layoutModel, isShared, changeEmitter);

    this.saveLayoutModal.onShow.subscribe(() => {
      this.modalIsOpen = true;

    });
    this.saveLayoutModal.onShown.subscribe(() => {

    });
    this.saveLayoutModal.onHide.subscribe(() => {
      this.modalIsOpen = false;
    });

    this.saveLayoutModal.show();
  }
}
