import {SlickGridProvider} from "../../../../slick-grid/providers/slick.grid.provider";
import {Router} from "@angular/router";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";

export class TaggingSlickGridProvider extends SlickGridProvider {
  public router: Router;
  public compFactoryResolver?: ComponentFactoryResolver;
  public appRef?: ApplicationRef;
  private selectedTagTypes = ['Comments', 'Legal', 'Cuts'];

  constructor(@Inject(Injector) public injector: Injector) {
    super(injector);
    this.router = injector.get(Router);
    this.compFactoryResolver = injector.get(ComponentFactoryResolver);
    this.appRef = injector.get(ApplicationRef);
  }
  getFilter(): Function {
    let selectedTagTypes = this.selectedTagTypes;
    return (item: any) => {
      if (!(<any>this.componentContext).slickGrid.module.hasOuterFilter) {
        return true;
      }
      else {
        return (selectedTagTypes.indexOf(item.TagType) === -1) ? false : true;
      }
    };
  }
  setSelectedTagTypes(arr): void {
    this.selectedTagTypes = arr;
  }
  /**
   * On double click by row
   * @param data
   */
  onRowDoubleClicked() {
    return;
  }
  /**
   * On mousedown
   * @param data
   */
  onRowMousedown(data) {
    let row = data.row;
    (<any>this.componentContext).setNode({
      markers: [
        {time: row.InTc},
        {time: row.OutTc}
      ],
      id: row.customId || row.Id
    });
  }
}
