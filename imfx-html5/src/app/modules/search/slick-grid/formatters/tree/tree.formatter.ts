/**
 * Created by Sergey Trizna on 07.12.2017.
 */
import {SlickGridColumn, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {SlickGridProvider} from "../../providers/slick.grid.provider";


export function TreeFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {

    let ctx = columnDef.__contexts;
    let provider: SlickGridProvider = ctx.provider;
    let dataView = provider.dataView;
    let data = provider.getData();
    let spacer = "<span style='display:inline-block;height:1px;width:" + (10 * dataContext["indent"]) + "px'></span>";
    let idx = dataView.getIdxById(dataContext.id);
    let propOfChild = provider.module.isTree.expandMode == 'allLevels' ? 'deepChilds' : 'childs';
    if (!(<SlickGridTreeRowData>data[idx]).hidden) {
        setTimeout(() => {
            let element: HTMLElement = ctx.provider.getSlick().getCellNode(rowNumber, cellNumber);
            let html = '';

            if (
                data[idx] &&
                data[idx][propOfChild] &&
                data[idx][propOfChild].length > 0) {
                if ((<SlickGridTreeRowData>dataContext).collapsedMark) {
                    html = spacer + " <i class='icon icons-right slickgrid-toggle-row slickgrid-expand-collapse-icon' id='" + idx + "'></i>&nbsp;";
                } else {
                    html = spacer + " <i class='icon icons-down slickgrid-toggle-row slickgrid-expand-collapse-icon' id='" + idx + "'></i>&nbsp;";
                }
            } else {
                spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
                html = spacer + " <i class='slickgrid-expand-collapse-icon' id='" + idx + "'></i> &nbsp;";
            }

            if (element) {
                $(element).parent().append('<div class="padding-tree-row" style="width: '+10 * dataContext["indent"] + 'px;"></div>');
                // $(element).parent().css('marginLeft', 10 * dataContext["indent"] + 'px');
                (<any>$(element)).html(html);

            } else {
                throw new Error('Element not found');
            }
        });
    } else {
        console.log('skipped');
        // debugger
    }

    return '<div></div>';
    // return commonFormatter(TreeFormatterComp, {
    //     rowNumber: rowNumber,
    //     cellNumber: cellNumber,
    //     value: value,
    //     columnDef: columnDef,
    //     data: dataContext
    // });
}



