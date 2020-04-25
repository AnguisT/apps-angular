import {ViewsProvider} from "../../../../views/providers/views.provider";
import {ViewsConfig} from "../../../../views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {TimecodeInputFormatter} from "../../../../slick-grid/formatters/timecode-input/timecode.input.formatter";
import {Select2Formatter} from "../../../../slick-grid/formatters/select2/select2.formatter";
import {DeleteFormatter} from "../../../../slick-grid/formatters/delete/delete.formatter";
import {TextFormatter} from "../../../../slick-grid/formatters/text/text.formatter";

export class SegmentsViewsProvider extends ViewsProvider {
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
      id: 1,
      name: 'Part#',
      field: 'PRT_NUM',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    columns.unshift({
      id: 2,
      name: 'Seq#',
      field: 'SQ_NUM',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    if (readOnly) {
      columns.unshift({
        id: 3,
        name: 'Type',
        field: 'TYPE_text',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false
      });
    } else {
      columns.unshift({
        id: 3,
        name: 'Type',
        field: 'TYPE',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false,
        formatter: Select2Formatter,
        __deps: {
          componentFactoryResolver: this.compFactoryResolver,
          appRef: this.appRef,
          injector: this.injector,
          data: []
        }
      });
    }
    if (readOnly) {
      columns.unshift({
        id: 4,
        name: 'In',
        field: 'SOMS',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false
      });
      columns.unshift({
        id: 5,
        name: 'Out',
        field: 'EOMS',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false
      });
    } else {
      columns.unshift({
        id: 4,
        name: 'In',
        field: 'SOMS',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false,
        formatter: TimecodeInputFormatter,
        width: 150,
        __deps: {
          componentFactoryResolver: this.compFactoryResolver,
          appRef: this.appRef,
          injector: this.injector,
          data: []
        }
      });
      columns.unshift({
        id: 5,
        name: 'Out',
        field: 'EOMS',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false,
        formatter: TimecodeInputFormatter,
        width: 150,
        __deps: {
          componentFactoryResolver: this.compFactoryResolver,
          appRef: this.appRef,
          injector: this.injector,
          data: []
        }
      });
    }
    columns.unshift({
      id: 6,
      name: 'Duration',
      field: 'DURATION_text',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    if (readOnly) {
      columns.unshift({
        id: 7,
        name: 'Title',
        field: 'PRT_TTL',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false
      });
    } else {
      columns.unshift({
        id: 7,
        name: 'Title',
        field: 'PRT_TTL',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false,
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
        id: 8,
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

    return columns;
  }
}
