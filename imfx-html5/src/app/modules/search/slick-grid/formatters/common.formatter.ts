/**
 * Created by Sergey Trizna on 18.12.2017.
 */
import {SlickGridFormatterData} from "../types";
import {BaseProvider} from "../../../../views/base/providers/base.provider";

export function commonFormatter(comp: any, setups: SlickGridFormatterData) {
    let ctxs = setups.columnDef.__contexts;
    let deps = setups.columnDef.__deps;
    new Promise((resolve, reject) => {
        resolve();
    }).then(
        () => {
            let bp = deps.injector.get(BaseProvider);
            let element: HTMLElement = ctxs.provider.getSlick().getCellNode(setups.rowNumber, setups.cellNumber);
            bp.buildComponent(comp, {
                data: <SlickGridFormatterData>setups
            }, element);
        },
        (err) => {
            console.log(err);
        }
    );

    return '<div></div>';
}
