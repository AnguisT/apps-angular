import {Injectable} from "@angular/core";
import {WorkflowWizardPriorityComponent} from "../../wizards/priority/wizard";
import {CoreSearchComponent} from "../../../../../core/core.search.comp";
import {ModalComponent} from "../../../../../modules/modal/modal";

@Injectable()
export class WorkflowUsersProvider {
    // ref to module
    moduleContext: WorkflowWizardPriorityComponent;

    // ref to component
    componentContext: CoreSearchComponent;




    // current state of modal
    // public modalIsOpen: boolean = false;

    // /**
    //  * Show modal
    //  */
    // showModal() {
    //     this.modalIsOpen = true;
    //     this.moduleContext.onShow();
    //     this.wizardModal.show();
    // }
}
