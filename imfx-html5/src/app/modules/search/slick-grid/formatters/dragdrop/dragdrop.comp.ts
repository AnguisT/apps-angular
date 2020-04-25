/**
 * Created by Sergey Trizna on 30.03.2018.
 */
import {ChangeDetectionStrategy, Component, Injector, Input, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridExpandableRowData, SlickGridFormatterData, SlickGridRowData} from "../../types";
import {SlickGridProvider} from "../../providers/slick.grid.provider";


@Component({
    selector: 'dragdrop-formatter-comp',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DragDropFormatterComp {
    private data: SlickGridFormatterData;
    private provider: SlickGridProvider;
    private idx: number;
    private col: SlickGridColumn;
    private row: SlickGridRowData & SlickGridExpandableRowData;

    constructor(private injector: Injector) {
        this.data = this.injector.get('data').data;

        this.row = this.data.data;
        this.provider = this.data.columnDef.__contexts.provider;
        this.idx = this.provider.getDataView().getIdxById(<string>this.row.id);
    }

    ngAfterViewInit() {
        let sub;
        let el = this.provider.getSlick().getCellNode(this.data.rowNumber, this.data.cellNumber);
        let $dotEl = $(el);
        $($dotEl).addClass('skipSelection');
        let ids = this.provider.getSelectedRowsIds();
        if (ids.indexOf(this.idx) > -1) {
            $dotEl.show();
        } else {
            $dotEl.hide();
        }

        this.provider.onSelectRow.subscribe((ids) => {
            let needAdd = false;
            if (ids.length > 0 && ids.indexOf(this.idx) > -1) {
                needAdd = true;
            }

            if (needAdd) {
                $dotEl.show();
            } else {
                $dotEl.hide();
            }
        });
    }

    onDragRowStart(ev) {
        ev.dataTransfer.effectAllowed='move';
        ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
        // ev.dataTransfer.setDragImage(ev.target,100,100);
        this.provider.onDragRowStart(ev);
        return true;
    }
}
