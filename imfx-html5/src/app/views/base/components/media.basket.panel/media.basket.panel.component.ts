import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from "@angular/core";
import {BasketService} from "../../../../services/basket/basket.service";
import {BaseProvider} from "../../providers/base.provider";
// import {SlickGridProvider} from "../../../../modules/search/slick-grid/providers/slick.grid.provider";
@Component({
    selector: 'media-basket-panel-component',
    templateUrl: 'tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        // SlickGridProvider
    ]
})

/**
 * Top bar media basket panel
 */
export class MediaBasketPanelComponent {
    public status: { isopen: boolean } = {isopen: false};
    private items: any = [];
    private shectChanges: boolean = false;
    private changesTimer;
    // private sgp: SlickGridProvider;

    constructor(private cdr: ChangeDetectorRef,
                private basketService: BasketService,
                private baseProivder: BaseProvider) {
    }

    ngOnInit() {
        this.basketService.retrieveItems();
        this.basketService.items.subscribe(updatedItems => {
            this.items = updatedItems || [];

            // update state of formatters at row
            if (this.baseProivder && this.baseProivder.outletComponent) {
                // let sgp: SlickGridProvider = this.baseProivder.outletComponent.slickGridComp.provider;
                // let slick = sgp.getSlick();
                // if (slick) {
                //     for (let i = 0; i < updatedItems.length; i++) {
                //         let id = updatedItems[i].id;
                //         // slick.invalidateRow(id);
                //     }
                //     // slick.render();
                // }
            }

            // this.cdr.markForCheck();

        });
        this.basketService.itemAddedRemoved.subscribe((res: number[]) => {
            this.cdr.detectChanges();
            this.shectChanges = true;
            let self = this;
            if (this.changesTimer) {
                clearTimeout(this.changesTimer);
            }
            this.changesTimer = setTimeout(function () {
                self.shectChanges = false;
            }, 500);


        });
    }


    itemClick($event) {
        console.log('parent click');
    }

    getCount() {
        return this.items.length;
    }

    closeBasket() {
        this.status.isopen = false;
    }

}
