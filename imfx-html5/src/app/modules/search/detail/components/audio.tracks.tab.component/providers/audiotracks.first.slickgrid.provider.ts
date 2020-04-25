/**
 * Created by Sergey Trizna on 15.03.2018.
 */
import {SlickGridProvider} from "../../../../slick-grid/providers/slick.grid.provider";
import {Injectable} from "@angular/core";
import {SlickGridEventData} from "../../../../slick-grid/types";


@Injectable()
export class ATFirstSlickGridProvider extends SlickGridProvider {
  onRowMousedown(data) {
  }

  onRowDoubleClicked(){
    return;
  }
}
