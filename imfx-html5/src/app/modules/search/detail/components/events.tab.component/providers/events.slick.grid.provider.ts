import {SlickGridProvider} from "../../../../slick-grid/providers/slick.grid.provider";
import {Router} from "@angular/router";
import {BasketService} from "../../../../../../services/basket/basket.service";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {SlickGridEventData, SlickGridRowData} from "../../../../slick-grid/types";

export class EventsSlickGridProvider extends SlickGridProvider {

  // public searchFormProvider?: SearchFormProvider,
  public router: Router;
  private basketService: BasketService;
  public compFactoryResolver?: ComponentFactoryResolver;
  public appRef?: ApplicationRef;

  constructor(@Inject(Injector) public injector: Injector) {
    super(injector);
    this.router = injector.get(Router);
    this.basketService = injector.get(BasketService);
    this.compFactoryResolver = injector.get(ComponentFactoryResolver);
    this.appRef = injector.get(ApplicationRef);
  }

  /**
   * On mousedown
   * @param data
   */
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
