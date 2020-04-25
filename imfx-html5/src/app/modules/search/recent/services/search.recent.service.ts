/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import {Injectable} from "@angular/core";
import {RecentModel} from '../models/recent';
import {ServerStorageService} from "../../../../services/storage/server.storage.service";
import {Observable, Subscription} from "rxjs";


export interface SearchRecentServiceInterface {
    serverStorage: any;

    addRecentSearch(prefix: string, data: RecentModel, itemsLimit): Observable<Subscription>;
    storeRecentSearches(prefix: string, data: Array<RecentModel>): Observable<Array<RecentModel>>;
    retrieveRecentSearches(prefix, itemsLimit): Observable<Array<RecentModel>>;
    clearRecentSearches(prefix): Observable<Subscription>;
}

@Injectable()
export class SearchRecentService implements SearchRecentServiceInterface {
    constructor(public serverStorage: ServerStorageService) {
    }

    addRecentSearch(prefix, data, itemsLimit): Observable<Subscription> {
        return Observable.create((observer) => {
            this.serverStorage.add(prefix, data, itemsLimit).subscribe((resp) => {
                observer.next(resp);
            });
        });
    }
    storeRecentSearches(prefix, data): Observable<Array<RecentModel>> {
        return Observable.create((observer) => {
            this.serverStorage.store(prefix, data).subscribe((resp) => {
                observer.next(resp);
            });
        });
    }

    retrieveRecentSearches(prefix, itemsLimit): Observable<Array<RecentModel>> {
        return Observable.create((observer) => {
            this.serverStorage.retrieve([prefix], true, itemsLimit).subscribe((resp) => {
                observer.next(resp[0].Value?JSON.parse(resp[0].Value):null);
            });
        });
    }

    clearRecentSearches(prefix): Observable<Subscription> {
        return Observable.create((observer) => {
            this.serverStorage.clear(prefix).subscribe(() => {
                observer.next(true);
            });
        });
    }
}
