/**
 * Created by Sergey Trizna on 11.11.2017.
 */
import {AdvancedCriteriaListTypes} from "../advanced/types";
export type FinalSearchRequestType = {
    'Text'?: string
    'Page'?: number,
    'SortField'?: string,
    'SortDirection'?: 'asc'|'desc',
    'SearchCriteria'?: AdvancedCriteriaListTypes,
    'ExtendedColumns'?: Array<string>
}