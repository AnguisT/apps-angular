/**
 * Created by Sergey Trizna on 17.01.2018.
 */

import {Component, Injector, ViewEncapsulation, ChangeDetectionStrategy} from "@angular/core";
import {JobStatuses} from "../../../../constants/job.statuses";
import {
    SlickGridExpandableRowData,
    SlickGridInsideExpandRowFormatterData
} from "../../../../../../modules/search/slick-grid/types";


@Component({
    selector: 'workflow-grid-rows-cell-detail-component',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        // WorkflowSlickGridProvider
        // WorkflowAccordionProvider,
        // AccordionService,
        // SilverlightProvider
    ],
    changeDetection: ChangeDetectionStrategy.Default
})
export class WorkflowExpandRowComponent {
    private jobStatuses = JobStatuses;
    private item: SlickGridExpandableRowData;
    private provider: any;
    private tasks: any;
    public injectedData: {
        data: SlickGridInsideExpandRowFormatterData
    };

    constructor(private injector: Injector) {
        this.injectedData = this.injector.get('data');
        this.item = this.injectedData.data.item;
        this.tasks = this.item.Tasks;
        this.provider = this.injectedData.data.provider;
    }

    onClick(item, i) {
        this.provider.onClickByExpandRow(item, i);
    }

    onDoubleClick(item, i) {
      // debugger;
      this.provider.navigateToPage(item, i);

    }

    getClass(item) {
        switch (item.TSK_STATUS) {
            case JobStatuses.READY:
                return 'ready'
            case JobStatuses.FAILED:
                return 'failed'
            case JobStatuses.ABORT:
                return 'failed'
            case JobStatuses.INPROG:
                return 'inprogress'
            case JobStatuses.COMPLETED:
                return 'completed'
            default:
                return '';
        }
    }

    // navigateToPage(item) {
    //     return this.config.options.provider.navigateToPage(item);
    // }

}
