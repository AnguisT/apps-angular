/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {SlickGridProvider} from "../../../../../modules/search/slick-grid/providers/slick.grid.provider";
import {SlickGridEventData} from "../../../../../modules/search/slick-grid/types";
import {appRouter} from "../../../../../constants/appRouter";
import * as Cookies from 'js-cookie';

export class TitlesMediaSlickGridProvider extends SlickGridProvider {
    onRowDoubleClicked(data: SlickGridEventData) {
        if (this.config.options.type) {
            let destination = this.config.options.type.replace('inside-', '').toLowerCase();
            Cookies.set('forceBackRoute', 'titles', {expires: 365});
            this.router.navigate([
                appRouter[destination].detail.substr(0, appRouter[destination].detail.lastIndexOf('/')),
                (<any>data.row).ID
            ]);
        }
    }
}
