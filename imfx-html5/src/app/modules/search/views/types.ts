import {util} from "jointjs";
import number = util.format.number;
import {bootloader} from "@angularclass/hmr";
import {RESTColumnSettings, RESTColumSetup} from "../slick-grid/types";
import {Select2ListTypes} from "../../controls/select2/types";
import {ReturnRequestStateType} from "../../../views/base/types";

export type ViewType = {
    ColumnData: RESTColumSetups;
    Id: number;
    IsPublic: boolean;
    PlacementId: number;
    SearchColumns: string[],
    ShowThumbs: boolean,
    Type: string,
    ViewName: string | null,
}

export type RESTColumSetups = {
    [key: string]: RESTColumSetup
}

export type ViewsOriginalType = {
    BuilderType: string;
    DataGridTag: any | null;
    DefaultSearchColumns: string[]
    DefaultView: ViewType
    DefaultViewName: string | null;
    DefaultWidth: number
    UserViews: UserViewsOriginalType
    ViewColumns: ViewColumnsType
}

export type UserViewsOriginalType = {
    [key: number]: string
}

export type ViewColumnsType = {
    [key: string]: RESTColumnSettings
}

export type CurrentViewsStateType = {
    viewObject: ViewType;
    isSaved: boolean
}

export type ViewSaveResp = ReturnRequestStateType & {
    ID: number;
}


export type SaveViewValidateResult = { saveError: string, valid: boolean }
