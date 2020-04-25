import {ViewsProvider} from '../../../modules/search/views/providers/views.provider';
import {ViewsConfig} from "../../../modules/search/views/views.config";
import {ThumbnailFormatter} from "../../../modules/search/slick-grid/formatters/thumbnail/thumbnail.formatter";
import {BasketFormatter} from "../../../modules/search/slick-grid/formatters/basket/basket.formatter";
import {SettingsFormatter} from "../../../modules/search/slick-grid/formatters/settings/settings.formatter";
import {DatetimeFormatter} from "../../../modules/search/slick-grid/formatters/datetime/datetime.formatter";
import {RESTColumSetup, SlickGridColumn} from "../../../modules/search/slick-grid/types";
import {VersionIconsFormatter} from "../../../modules/search/slick-grid/formatters/versions.icons/versions.icons.formatter";

export class VersionViewsProvider extends ViewsProvider {
    config: ViewsConfig;

    /**
     * @inheritDoc
     * @returns {Array}
     */
    getCustomColumns() {
        let columns = [];

        columns.unshift({
            isFrozen: true,
            id: -3,
            name: 'Thumbnail',
            field: '*',
            width: 175,
            minWidth: 175,
            resizable: false,
            sortable: false,
            multiColumnSort: false,
            formatter: ThumbnailFormatter,
            headerCssClass: "disable-reorder",
            cssClass: 'thumb-wrapper',
            __isCustom: true,
            __text_id: 'thumbnails',
            __deps: {
              componentFactoryResolver: this.compFactoryResolver,
              appRef: this.appRef,
              injector: this.injector
            }
        });
        columns.unshift({
          isFrozen: true,
          id: -4,
          name: '',
          field: '*',
          width: 40,
          minWidth: 40,
          resizable: false,
          sortable: false,
          multiColumnSort: false,
          formatter: VersionIconsFormatter,
          headerCssClass: "disable-reorder",
          __isCustom: true,
          __deps: {
            componentFactoryResolver: this.compFactoryResolver,
            appRef: this.appRef,
            injector: this.injector
          }
        });
        // Basket
        columns.unshift({
          isFrozen: true,
          id: -5,
          name: '',
          field: '*',
          width: 50,
          minWidth: 50,
          resizable: false,
          sortable: false,
          multiColumnSort: false,
          formatter: BasketFormatter,
          headerCssClass: "disable-reorder",
          __isCustom: true,
          __text_id: 'basket',
          __deps: {
            componentFactoryResolver: this.compFactoryResolver,
            appRef: this.appRef,
            injector: this.injector
          }
        });

        // settings
        columns.unshift({
          isFrozen: true,
          id: -6,
          name: '',
          field: '*',
          width: 50,
          minWidth: 50,
          resizable: false,
          sortable: false,
          multiColumnSort: false,
          formatter: SettingsFormatter,
          headerCssClass: "disable-reorder",
          __isCustom: true,
          __text_id: 'settings',
          __deps: {
            componentFactoryResolver: this.compFactoryResolver,
            appRef: this.appRef,
            injector: this.injector
          }
        });

        return columns;
    }
    getFormatterByName(bindingName: string, col: RESTColumSetup, colDef: SlickGridColumn): SlickGridColumn {
      if (bindingName) {
        let bn = bindingName.toLowerCase();
        // Date
        if ( bn == 'created_dt' ||  bn == 'arrival_dt' ||  bn == 'exp_arrival_dt' ||  bn == 'licence_start_date' ||
              bn == 'logged_in_dt' ||  bn == 'modified_dt' ||  bn == 'n_tx_dt' ||  bn == 'prod_from_date' ||  bn == 'prod_to_date' ||
              bn == 'publish_date' || bn == 'return_dt' || bn == 'rl_deleted_dt' || bn == 'wipe_dest_dtDT') {
          // not sure MI_CHECKSUM_DT, MI_DELETED_DT, RETURN_DATE, TX_DATE, WIPE_DT
          colDef = $.extend(true, {}, colDef, {
            isFrozen: false,
            minWidth: 60,
            formatter: DatetimeFormatter,
            enableColumnReorder: true,
            __deps: {
              componentFactoryResolver: this.compFactoryResolver,
              appRef: this.appRef,
              injector: this.injector
            }
          });
        }
      }

      return colDef;
    }
}
