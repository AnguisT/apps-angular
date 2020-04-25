import {FinalSearchRequestType} from "../search/grid/types";
import {ViewType} from "../search/views/types";

export type ExportModelType = FinalSearchRequestType & {
    ExportType: string,
    SearchType: string,
    View: ViewType
}
