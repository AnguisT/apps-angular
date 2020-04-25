import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {SlickGridProvider} from "../../../modules/search/slick-grid/providers/slick.grid.provider";

export class CarrierSlickGridProvider extends SlickGridProvider {
  public compFactoryResolver?: ComponentFactoryResolver;
  public appRef?: ApplicationRef;

  constructor(@Inject(Injector) public injector: Injector) {
    super(injector);
    this.compFactoryResolver = injector.get(ComponentFactoryResolver);
    this.appRef = injector.get(ApplicationRef);
  }
}
