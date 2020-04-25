/**
 * Created by Sergey Trizna on 02.10.2017.
 */
export type TreeStandardItemType = {
    key: string,
    title: string,
    folder: boolean,
    children: TreeStandardListTypes
}

export type TreeStandardListTypes = Array<TreeStandardItemType>;

export type TreeStandardConvertParamsType = {
    key: string,
    title: string,
    children: string,
    additionalData?: string
}

export type TreeStandardPointerToNodeType = {
    key: string
}

export type TreeStandardListOfPointersToNodesTypes = Array<TreeStandardPointerToNodeType>