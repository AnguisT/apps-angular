/**
 * Created by Sergey Trizna on 27.06.2017.
 */
export type SimplifiedSettingsStaticWidgetItem = {
    enabled: boolean,
    x: number,
    y: number,
    width: number,
    height: number,
    minWidth?: number,
    minHeight?: number,
    maxWidth?: number,
    maxHeight?: number
}
export type SimplifiedSettingsDynamicWidgetItem = {
    id: string,
    value: string,
    enabled: boolean,
    x: number,
    y: number,
    width: number,
    height: number,
    minWidth?: number,
    minHeight?: number,
    maxWidth?: number,
    maxHeight?: number

}
export type SimplifiedSettings = {
    dynamicWidgets: Array<SimplifiedSettingsDynamicWidgetItem>
    staticWidgets: {
        [key: string]: SimplifiedSettingsStaticWidgetItem
    },
    common: {
        [key: string]: any;
    }
};

export type GridStackOptions = {
    float: boolean,
    animate: boolean,
    cellHeight: number,
    verticalMargin: number,
    // height: 50,
    staticGrid: boolean,
    // removable: '#trash',
    removable: boolean,
    removeTimeout: number,
    acceptWidgets: boolean
}

export type ViewColumnType = {
    BindingName: string,
    TemplateName: string,
    BindingFormat: string,
    CanUserSort: boolean,
    IsExtendedField: boolean
}

export type ViewColumnFakeType = {
    BindingName: string,
    TemplateName: string,
}

export type TransferdSimplifedType = {
    setupType: string,
    groupId: number,
    setups: SimplifiedSettings|any
}