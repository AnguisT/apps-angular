/**
 * Created by Sergey Trizna on 16.01.2018.
 */
import {SlickGridColumn, SlickGridExpandableRowData} from "../../types";
import {WorkflowSlickGridProvider} from "../../../../../views/workflow/providers/workflow.slick.grid.provider";

export function ExpandContentFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridExpandableRowData) {
    let ctx = columnDef.__contexts;
    let provider = ctx.provider;
    if(dataContext._collapsed == false){
        new Promise((resolve, reject) => {
            resolve();
        }).then(
            () => {
                provider.createDetailComponent(dataContext)
            });
    }
    if (dataContext._isPadding == true) {}
    else if (dataContext._collapsed) {} else {
        let html = [];
        let rowHeight = provider.getSlick().getOptions().rowHeight;
        html.push("</div>");
        html.push("<div class='dynamic-cell-detail slickgrid-toggle-expandable' id='"+dataContext.ID+"' ");   //apply custom css to detail
        html.push("style='height:", dataContext._height, "px;"); //set total height of padding
        html.push("top:", rowHeight, "px'>");             //shift detail below 1st row
        html.push("<div>", dataContext._detailContent, "</div>");  //sub ctr for custom styling

        new Promise((resolve, reject) => {
            resolve();
        }).then(
            () => {
                let element: HTMLElement = ctx.provider.getSlick().getCellNode(rowNumber, cellNumber);
                $(element).addClass('skipSelection');
            });

        return html.join("");
    }


}

