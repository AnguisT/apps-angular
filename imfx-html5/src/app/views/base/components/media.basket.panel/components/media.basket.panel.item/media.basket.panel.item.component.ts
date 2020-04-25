/**
 * Created by Pavel on 29.11.2016.
 */
import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {BasketService} from "../../../../../../services/basket/basket.service";
import {Router} from "@angular/router";
import {appRouter} from "../../../../../../constants/appRouter";
import {SlickGridProvider} from "../../../../../demo/comps/slick-grid/slick-grid/providers/slick.grid.provider";

@Component({
    selector: 'media-basket-panel-item-component',
    templateUrl: '/tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    // providers: [
    //     SlickGridProvider
    // ]
})

/**
 * Media basket item
 */
export class MediaBasketPanelItemComponent {
    @Input() item;

    constructor(private basketService: BasketService, private router: Router) {
    }

    ngOnInit() {

    }

    remove($event) {
        $event.stopPropagation();
        this.basketService.removeFromBasket([this.item]);
        return false;
    }

    goToDetail() {
        this.router.navigate(
            [
                appRouter[this.item.basket_item_type].detail.substr(
                    0,
                    appRouter[this.item.basket_item_type].detail.lastIndexOf('/')
                ),
                this.item.ID
            ]
        );
    }
}
