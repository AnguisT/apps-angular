import {Injectable, Injector} from "@angular/core";
import {RaiseWorkflowWizzardComponent} from "../../rw.wizard/rw.wizard";
import {MediaClip} from "../../../views/clip-editor/rce.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Injectable()
export class RaiseWorkflowWizzardProvider {
    // ref to module
    public moduleContext: RaiseWorkflowWizzardComponent;
    public wizardModallIsOpen: boolean = false;
    public subscribersReady: boolean = false;

    private workflowParams: any;
    /**
     * On open modal
     */
    open(item, itemType, clips?: Array<MediaClip>) {
        this.workflowParams = {
            'itemId': item.ID,
            'itemType': itemType,
            'itemTitle': item.TITLE,
            'clips': clips
        };

        let wizardComponent: RaiseWorkflowWizzardComponent = this.moduleContext;
        wizardComponent.init(this.workflowParams);
    }
}
