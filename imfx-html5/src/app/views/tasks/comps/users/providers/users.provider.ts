import {Injectable} from "@angular/core";
import {TasksWizardPriorityComponent} from "../../wizards/priority/wizard";
import {CoreSearchComponent} from "../../../../../core/core.search.comp";

@Injectable()
export class TasksUsersProvider {
    // selected nodes
    selectedNodes = [];
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
