import {ViewsProvider} from "../../../../views/providers/views.provider";
import {ViewsConfig} from "../../../../views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {TimecodeInputFormatter} from "../../../../slick-grid/formatters/timecode-input/timecode.input.formatter";
import {Select2Formatter} from "../../../../slick-grid/formatters/select2/select2.formatter";
import {DeleteFormatter} from "../../../../slick-grid/formatters/delete/delete.formatter";
import {TextFormatter} from "../../../../slick-grid/formatters/text/text.formatter";
import {DatetimeFormatter} from "../../../../slick-grid/formatters/datetime/datetime.formatter";

export class ATSecondSlickGridViewsProvider extends ViewsProvider {
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
      name: 'Id',
      field: 'Id',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    columns.unshift({
      id: 2,
      name: 'Filename',
      field: 'Filename',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    columns.unshift({
      id: 3,
      name: 'Device',
      field: 'M_CTNR_ID_text',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    columns.unshift({
      id: 4,
      name: 'LanguageCode',
      field: 'LanguageCode',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    columns.unshift({
      id: 5,
      name: 'Duration',
      field: 'DURATION_text',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    if (!readOnly) {
      columns.unshift({
        id: 6,
        name: ' Created Dt',
        field: 'CreatedDt',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false,
        formatter: DatetimeFormatter,
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
