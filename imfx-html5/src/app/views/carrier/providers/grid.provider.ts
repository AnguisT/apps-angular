import {GridProvider} from '../../../modules/search/grid/providers/grid.provider';
import {Inject} from "@angular/core";
import {BasketService} from "../../../services/basket/basket.service";
import {TranslateService} from "ng2-translate";
// import {Router} from "@angular/router";

export class CarrierGridProvider extends GridProvider {
    constructor(@Inject(BasketService) protected basketService: BasketService,
                @Inject(TranslateService) translate: TranslateService) {
        super(translate)
    }


  isOrdered(rowData):boolean {
    return this.basketService.hasItem(rowData.data);
  }
}
