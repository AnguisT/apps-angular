import {Injectable} from "@angular/core";

import {CoreSearchComponent} from "../../../../../../core/core.search.comp";
import {TasksWizardAbortComponent} from "../wizard";
import {ModalComponent} from "../../../../../../modules/modal/modal";

@Injectable()
export class TasksWizardAbortComponentProvider {
    // ref to module
    moduleContext: TasksWizardAbortComponent;

    // ref to component
    componentContext: CoreSearchComponent;

    // reference to modalComponent
    public wizardModal: ModalComponent;

    // current state of modal
    public modalIsOpen: boolean = false;

    /**
     * Show modal
     */
    showModal() {
        this.modalIsOpen = true;
        this.moduleContext.onShow();
        this.wizardModal.show();
    }


}
