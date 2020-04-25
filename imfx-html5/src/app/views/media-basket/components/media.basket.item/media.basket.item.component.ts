/**
 * Created by Pavel on 29.11.2016.
 */
import {Component, Input, ViewEncapsulation, Output} from '@angular/core';
import {BasketService} from '../../../../services/basket/basket.service';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import { appRouter } from '../../../../constants/appRouter';

@Component({
  selector: 'media-basket-item-component',
  templateUrl: '/tpl/index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None/*,
   changeDetection: ChangeDetectionStrategy.OnPush*/
})

/**
 * Media basket item
 */
export class MediaBasketItemComponent {
  @Input() item;
  
  @Output() selectedId;

  constructor(private basketService: BasketService, private router: Router) {
  }

  ngOnInit() {
  }

  remove($event) {
    this.basketService.removeFromBasket([this.item])
  }

  toggleSelected($event) {
    $event.stopPropagation();
    this.item.selected = !this.item.selected;
  }

  goToDetail($event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.router.navigate(
      [
        appRouter[this.item.basket_item_type].detail.substr(
          0,
          appRouter[this.item.basket_item_type].detail.lastIndexOf('/')
        ),
        this.item.ID
      ]
    );
    return false;
  }
}
