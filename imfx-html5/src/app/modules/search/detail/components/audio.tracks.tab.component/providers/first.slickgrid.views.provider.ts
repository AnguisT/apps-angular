import {ViewsProvider} from "../../../../views/providers/views.provider";
import {ViewsConfig} from "../../../../views/views.config";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {TimecodeInputFormatter} from "../../../../slick-grid/formatters/timecode-input/timecode.input.formatter";
import {Select2Formatter} from "../../../../slick-grid/formatters/select2/select2.formatter";
import {DeleteFormatter} from "../../../../slick-grid/formatters/delete/delete.formatter";
import {TextFormatter} from "../../../../slick-grid/formatters/text/text.formatter";
import {DatetimeFormatter} from "../../../../slick-grid/formatters/datetime/datetime.formatter";

export class ATFirstSlickGridViewsProvider extends ViewsProvider {
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
      name: 'Track No',
      field: 'TrackNo',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    if (readOnly) {
      columns.unshift({
        id: 1,
        name: 'Language',
        field: 'Language',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false
      });
    } else {
      columns.unshift({
        id: 1,
        name: 'Language',
        field: 'LanguageId',
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
        id: 2,
        name: 'M/S',
        field: 'MS',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false
      });
    } else {
      columns.unshift({
        id: 2,
        name: 'M/S',
        field: 'MsTypeId',
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
    columns.unshift({
      id: 3,
      name: 'Tag',
      field: 'LangTag',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    if (readOnly) {
      columns.unshift({
        id: 4,
        name: 'Content',
        field: 'Content',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false
      });
    } else {
      columns.unshift({
        id: 4,
        name: 'Type',
        field: 'TypeId',
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
    columns.unshift({
      id: 5,
      name: 'QC Flag',
      field: 'QcText',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    columns.unshift({
      id: 6,
      name: 'Int. Audio',
      field: 'IntAudioFlag',
      minWidth: 50,
      resizable: true,
      sortable: true,
      multiColumnSort: false
    });
    if (readOnly) {
      columns.unshift({
        id: 7,
        name: 'Date Added',
        field: 'DateAdded',
        minWidth: 50,
        resizable: true,
        sortable: true,
        multiColumnSort: false
      });
    } else {
      columns.unshift({
        id: 7,
        name: 'Date Added',
        field: 'DateAdded',
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
    if (!readOnly) {
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
