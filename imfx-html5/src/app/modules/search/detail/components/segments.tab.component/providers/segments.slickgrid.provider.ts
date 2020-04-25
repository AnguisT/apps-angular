/**
 * Created by Sergey Trizna on 15.03.2018.
 */
import {SlickGridProvider} from "../../../../slick-grid/providers/slick.grid.provider";
import {Injectable} from "@angular/core";
import {SlickGridEventData} from "../../../../slick-grid/types";


@Injectable()
export class SegmentsSlickGridProvider extends SlickGridProvider {
  onRowMousedown(data) {
    let row = data.row;
    (<any>this.componentContext).config.elem.emit('setMarkers', {
      markers:  [
        {time: row.SOMS},
        {time: row.EOMS}
      ],
      m_type: 'clip',
      id: row.id
    });
  }
}
