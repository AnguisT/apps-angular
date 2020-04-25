import {
    Component,
    ViewEncapsulation
} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';
import {BasketService} from '../../../../../../services/basket/basket.service';

@Component({
    selector: 'grid-column-basket-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class BasketColumnComponent implements AgRendererComponent {
    constructor(private basketService: BasketService) {
    }
    private params:any;
    private url:string;

    // called on init
    agInit(params:any):void {
        this.params = params;
        this.url = this.params.value;
    }

    // called when the cell is refreshed
    refresh(params:any):void {
        this.params = params;
        this.url = this.params.value;
    }


    toggleBasket():void {
      debugger
      this.params.data.searchType = this.params.colDef.searchType;
      let searchType = this.params.colDef.searchType.replace("inside-",""); // prevent crashes for media and versions grid inside titles or version details
      this.isOrdered() ? this.basketService.removeFromBasket([this.params.data]) : this.basketService.addToBasket(this.params.data, searchType);
    }

    isOrdered():boolean {
      return this.basketService.hasItem(this.params.data);
    }
}

