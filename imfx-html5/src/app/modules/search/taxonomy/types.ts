/**
 * Created by Sergey Trizna on 02.10.2017.
 */
export type TaxonomyType = {
    ID: number,
    Name: string,
    ParentID?: number,
    Children?: Array<TaxonomyType>
}