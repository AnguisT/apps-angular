import {ViewsProvider} from "../../../../views/providers/views.provider";
import {ViewsConfig} from "../../../../views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {TimecodeInputFormatter} from "../../../../slick-grid/formatters/timecode-input/timecode.input.formatter";
import {Select2Formatter} from "../../../../slick-grid/formatters/select2/select2.formatter";
import {DeleteFormatter} from "../../../../slick-grid/formatters/delete/delete.formatter";
import {TextFormatter} from "../../../../slick-grid/formatters/text/text.formatter";

export class EventsViewsProvider extends ViewsProvider {
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
  getCustomColumns(readOnly?: boolean) {
    let columns = [];

    columns.unshift({
      id: 0,
      field: "PRT_NUM",
      name: "Part#",
      width: 50,
      sortable: true,
      resizable: true
    });

    columns.unshift({
      id: 1,
      field: "SQ_NUM",
      name: "Seq#",
      width: 50,
      sortable: true,
      resizable: true
    });

    if (readOnly) {
      columns.unshift({
        id: 2,
        field: "TYPE",
        name: "Type",
        width: 330,
        resizable: true,
        sortable: true
      });
      columns.unshift({
        id: 3,
        field: "SOMS",
        name: "In",
        width: 150,
        sortable: true,
        resizable: true
      });
      columns.unshift({
        id: 4,
        field: "EOMS",
        name: "Out",
        width: 150,
        sortable: true,
        resizable: true
      });
    }
    else {
      columns.unshift({
        id: 2,
        field: "TYPE",
        name: "Type",
        width: 330,
        resizable: true,
        sortable: false,
        multiColumnSort: false,
        formatter: Select2Formatter,
        __deps: {
          componentFactoryResolver: this.compFactoryResolver,
          appRef: this.appRef,
          injector: this.injector,
          data: []
        }
      });
      columns.unshift({
        id: 3,
        field: "SOMS",
        name: "In",
        width: 150,
        formatter: TimecodeInputFormatter,
        __deps: {
          componentFactoryResolver: this.compFactoryResolver,
          appRef: this.appRef,
          injector: this.injector
        },
        sortable: true,
        resizable: true
      });
      columns.unshift({
        id: 4,
        field: "EOMS",
        name: "Out",
        width: 150,
        formatter: TimecodeInputFormatter,
        __deps: {
          componentFactoryResolver: this.compFactoryResolver,
          appRef: this.appRef,
          injector: this.injector
        },
        sortable: true,
        resizable: true
      });
    }
    columns.unshift({
      id: 5,
      field: "DURATION_text",
      name: "Duration",
      width: 150,
      sortable: true,
      resizable: true
    });
    if (!readOnly) {
      columns.unshift({
        id: 6,
        field: "PRT_TTL",
        name: "Title",
        width: 200,
        sortable: true,
        resizable: true,
        formatter: TextFormatter,
        __deps: {
          componentFactoryResolver: this.compFactoryResolver,
          appRef: this.appRef,
          injector: this.injector,
          data: {
              validationEnabled: true
          }
        }
      });
      columns.unshift({
        id: 7,
        field: "Delete",
        name: "",
        width: 50,
        resizable: false,
        sortable: false,
        multiColumnSort: false,
        formatter: DeleteFormatter,
        __deps: {
          componentFactoryResolver: this.compFactoryResolver,
          appRef: this.appRef,
          injector: this.injector
        }
      });
    }
    else {
      columns.unshift({
        id: 6,
        field: "PRT_TTL",
        name: "Title",
        width: 200,
        sortable: true,
        resizable: true
      });
    }
    return columns;
  }
}
