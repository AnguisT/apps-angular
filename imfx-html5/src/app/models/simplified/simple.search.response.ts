import { SimpleSearchFacets } from './simple.search.facets';
import { SimpleSearchItem } from './simple.search.item';

export type SimpleSearchResponse = {
    Facets: Array<SimpleSearchFacets>;
    Items: Array<SimpleSearchItem>;
    ResultCount: number;
    SeriesInfo: any;
};
