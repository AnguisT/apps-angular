/**
 * Created by Sergey Trizna on 15.11.2017.
 */
import {Observable} from "rxjs/Observable";
import {RecentModel} from "../models/recent";
import {SearchRecentConfig} from "../search.recent.config";
import {Subscription} from "rxjs/Subscription";

export interface SearchRecentProviderInterface {
    config: SearchRecentConfig;

    /**
     * Array of recent searches
     */
    recentSearches: Array<RecentModel>;

    /**
     * Return array of recent searches
     */
    getRecentSearches();

    /**
     * Add model of recent search to stack
     * @param recentModel
     */
    addRecentSearch(recentModel: RecentModel);

    /**
     * Clear stack of recent searches
     */
    clearRecentSearches();

    /**
     * Set recent searches
     * @param recentSearches
     */
    setRecentSearches(recentsJSONs: Array<any>);

    moveToTop(recentSearch: RecentModel, withoutSave: boolean): Observable<Subscription>;

    applyInModule(): void;

    selectRecentSearch(recentSearch: RecentModel);
}
