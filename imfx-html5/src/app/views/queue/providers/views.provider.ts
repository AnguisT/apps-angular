/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {ViewsProvider} from '../../../modules/search/views/providers/views.provider';

import {ViewsConfig} from "../../../modules/search/views/views.config";
import {AgRendererComponent} from "ag-grid-ng2";
import {ProgressColumnComponent} from "../../../modules/search/grid/comps/columns/progress/progress";
import {StatusColumnComponent} from "../../../modules/search/grid/comps/columns/status/status";
import {RESTColumSetup, SlickGridColumn} from "../../../modules/search/slick-grid/types";
import {StatusFormatter} from "../../../modules/search/slick-grid/formatters/status/status.formatter";
import {ProgressFormatter} from "../../../modules/search/slick-grid/formatters/progress/progress.formatter";


export class QueueViewsProvider extends ViewsProvider {
    config: ViewsConfig;
    constructor(@Inject(ComponentFactoryResolver) public compFactoryResolver: ComponentFactoryResolver,
                @Inject(ApplicationRef) public appRef: ApplicationRef,
                @Inject(Injector) public injector: Injector) {
      super(compFactoryResolver, appRef, injector);
    }

    /**
     * Return custom components for grid column
     * @returns {AgRendererComponent}
     */
    getCustomColumnRenderer (field: string):any {
      if (field == "Status_text") {
        return StatusColumnComponent
      }
      if (field == "Progress") {
        return ProgressColumnComponent
      }
      return null
    }

    getFormatterByName(bindingName: string, col: RESTColumSetup, colDef: SlickGridColumn): SlickGridColumn {
      if (bindingName) {
        let bn = bindingName.toLowerCase();
        switch (bn) {
          // Loc status
          case 'status_text':
            colDef = $.extend(true, {}, colDef, {
              isFrozen: false,
              minWidth: 60,
              formatter: StatusFormatter,
              enableColumnReorder: true,
              // __text_id: 'status',
              __deps: {
                componentFactoryResolver: this.compFactoryResolver,
                appRef: this.appRef,
                injector: this.injector
              }
            });
            break;
          case 'progress':
            colDef = $.extend(true, {}, colDef, {
                formatter: ProgressFormatter,
                multiColumnSort: false,
                __deps: {
                  componentFactoryResolver: this.compFactoryResolver,
                  appRef: this.appRef,
                  injector: this.injector
                }
              });
            break;
          default:
            break;
        }
      }

      return colDef;
    }
}
