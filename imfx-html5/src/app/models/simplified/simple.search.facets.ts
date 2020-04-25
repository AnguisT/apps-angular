import { SimpleSearchFacetsItem } from './simple.search.facets.item';

export type SimpleSearchFacets = {
    FacedName: string;
    FacetId: string;
    FacetItems: Array<SimpleSearchFacetsItem>;
};
