import {ViewsProvider} from "../../../modules/search/views/providers/views.provider";
import {ViewsConfig} from "../../../modules/search/views/views.config";

export class CarrierViewsProvider extends ViewsProvider {
    config: ViewsConfig;

    /**
     * @inheritDoc
     * @returns {Array}
     */
    getCustomColumns() {
        let columns = [];
        // columns.unshift({
        //     cellRendererFramework: BasketColumnComponent,
        //     $$id: -4,
        //     field: "_mediaBasket",
        //     headerName: "",
        //     width: 35,
        //     sortable: false,
        //     resizeable: false,
        //     pinned: this.shouldPinColumn(),
        //     suppressMovable: true,
        //     setupCol: false,  //for setup modal
        //     suppressSorting: true, //can't sort
        //     searchType: this.config.componentContext.searchGridProvider.config.options.searchType
        // });

        // columns.unshift({
        //     cellRendererFramework: SettingsColumnComponent,
        //     $$id: -5,
        //     field: "_settings",
        //     headerName: "",
        //     width: 35,
        //     sortable: false,
        //     resizeable: false,
        //     pinned: this.shouldPinColumn(),
        //     suppressMovable: true,
        //     setupCol: false,      //for setup modal
        //     suppressSorting: true, //can't sort
        // });

        return columns;
    }

}
