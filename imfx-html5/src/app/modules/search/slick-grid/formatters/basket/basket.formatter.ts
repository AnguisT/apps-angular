import {ChangeDetectionStrategy, Component, Injector, ViewEncapsulation} from "@angular/core";
import {SlickGridColumn, SlickGridFormatterData, SlickGridRowData, SlickGridTreeRowData} from "../../types";
import {commonFormatter} from "../common.formatter";
import {BasketService} from "../../../../../services/basket/basket.service";

@Component({
  selector: 'basket-formatter-comp',
  templateUrl: './tpl/index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BasketFormatterComp {
  private params;
  public injectedData: SlickGridFormatterData;

  constructor(private injector: Injector, private basketService: BasketService) {
    this.injectedData = this.injector.get('data');
    this.params = this.injectedData.data;
  }

  toggleBasket() {
    let data: SlickGridRowData|SlickGridTreeRowData = this.params.data;
    delete data.__contexts;
    this.params.data.searchType = this.params.columnDef.__contexts.provider.module.searchType;
    debugger;
    let searchType = this.params.data.searchType.replace("inside-",""); // prevent crashes for media and versions grid inside titles or version details
    searchType = searchType == 'versions' ? "Version" : searchType;
    this.isOrdered() ? this.basketService.removeFromBasket([data]) : this.basketService.addToBasket(data, searchType);
  }

  isOrdered() {
    return this.basketService.hasItem(this.params.data);
  }
}
export function BasketFormatter(rowNumber: number, cellNumber: number, value: any, columnDef: SlickGridColumn, dataContext: SlickGridTreeRowData | SlickGridRowData) {

  return commonFormatter(BasketFormatterComp, {
    rowNumber: rowNumber,
    cellNumber: cellNumber,
    value: value,
    columnDef: columnDef,
    data: dataContext
  });
}



