import { MediaDetailDetailsViewColumnData } from './media.detail.detailsview.column.data';
import { MediaDetailDetailsViewTabsData } from './media.detail.detailsview.tabs.data.item';

export type MediaDetailDetailsViewResponse = {
    Id: number;
    ColumnData: MediaDetailDetailsViewColumnData;
    Subtype: string;
    TabsData: Array<MediaDetailDetailsViewTabsData>;
    Type: string;
};
