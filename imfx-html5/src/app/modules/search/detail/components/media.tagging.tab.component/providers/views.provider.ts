import {ViewsProvider} from "../../../../views/providers/views.provider";
import {ViewsConfig} from "../../../../views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {TagFormatter} from "../../../../slick-grid/formatters/tag/tag.formatter";
import {ColorIndicatorFormatter} from "../../../../slick-grid/formatters/color-indicator/color.indicator.formatter";

export class TaggingViewsProvider extends ViewsProvider {
  config: ViewsConfig;

  constructor(@Inject(ComponentFactoryResolver) public compFactoryResolver: ComponentFactoryResolver,
              @Inject(ApplicationRef) public appRef: ApplicationRef,
              @Inject(Injector) public injector: Injector) {
    super(compFactoryResolver, appRef, injector);
  }

  /**
   * @inheritDoc
   * @returns {Array}
   */
  getCustomColumns() {
    let columns = [];
    // columns.unshift({
    //   id: 0,
    //   field: 'thumbIn',
    //   name: "",
    //   width: 150,
    //   sortable: true,
    //   resizable: true,
    //   __isCustom: true
    // });
    //
    // columns.unshift({
    //   id: 1,
    //   field: 'thumbOut',
    //   name: "",
    //   width: 150,
    //   sortable: true,
    //   resizable: true,
    //   __isCustom: true
    // });

    columns.unshift({
      id: -1,
      field: "*",
      name: "",
      width: 20,
      sortable: false,
      resizable: false,
      formatter: ColorIndicatorFormatter,
      __deps: {
        componentFactoryResolver: this.compFactoryResolver,
        appRef: this.appRef,
        injector: this.injector
      }
    });

    columns.unshift({
      id: 2,
      field: "InTc",
      name: "In",
      width: 120,
      sortable: true,
      resizable: true
    });

    columns.unshift({
      id: 3,
      field: "OutTc",
      name: "Out",
      width: 120,
      sortable: true,
      resizable: true
    });
    columns.unshift({
      id: 4,
      field: "Notes",
      name: "Notes",
      width: 330,
      sortable: true,
      resizable: true
    });
    columns.unshift({
      id: 5,
      field: "Tags",
      name: "Tags",
      width: 240,
      sortable: true,
      resizable: true,
      formatter: TagFormatter,
      __isCustom: true,
      __text_id: 'tags',
      __deps: {
        componentFactoryResolver: this.compFactoryResolver,
        appRef: this.appRef,
        injector: this.injector
      }
    });
    columns.unshift({
      id: 6,
      field: "TagType",
      name: "Type",
      width: 100,
      sortable: true,
      resizable: true
    });
    return columns;
  }
}
