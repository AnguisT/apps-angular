import {ViewsProvider} from "../../../../views/providers/views.provider";
import {ViewsConfig} from "../../../../views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {PreviewFilesFormatter} from "../../../../slick-grid/formatters/preview-files/preview-files.formatter";
import {PreviewImfDetailsFormatter} from "../../../../slick-grid/formatters/preview-imf-details/preview-imf-details.formatter";
import {VersionIconsFormatter} from "../../../../slick-grid/formatters/versions.icons/versions.icons.formatter";

export class IMFViewsProvider extends ViewsProvider {
  config: ViewsConfig;

  constructor(@Inject(ComponentFactoryResolver) public compFactoryResolver: ComponentFactoryResolver,
              @Inject(ApplicationRef) public appRef: ApplicationRef,
              @Inject(Injector) public injector: Injector) {
    super(compFactoryResolver, appRef, injector);
  }

  getCustomColumns(readOnly?: boolean) {
    let columns = [];

    columns.unshift({
      id: 0,
      field: "*",
      name: "",
      width: 60,
      minWidth: 60,
      sortable: true,
      resizable: false,
      formatter: VersionIconsFormatter,
      __isCustom: true,
      __deps: {
        componentFactoryResolver: this.compFactoryResolver,
        appRef: this.appRef,
        injector: this.injector
      }
    });
    columns.unshift({
      id: 1,
      field: "Filename",
      name: "File Name",
      sortable: true,
      resizable: true
    })
    columns.unshift({
      id: 2,
      field: "Details",
      name: "",
      formatter: PreviewImfDetailsFormatter,
      sortable: false,
      resizable: false,
      width: 150,
      minWidth: 150,
      isCustom: true,
      __deps: {
        componentFactoryResolver: this.compFactoryResolver,
        appRef: this.appRef,
        injector: this.injector,
        data: []
      }
    });

    return columns;
  }
}
