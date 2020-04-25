/**
 * Created by Sergey Trizna on 22.09.2017.
 */


import {Inject, Injectable} from "@angular/core";
import {HttpService} from "../../../../services/http/http.service";
import {Observable} from "rxjs";
import {Headers} from "@angular/http";
import {SessionStorageService} from "ng2-webstorage";
import {isArray} from "rxjs/util/isArray";
import {SavedSearchList, SaveSearchResponse} from "../types";
import {AdvancedCriteriaListTypes} from "../../advanced/types";
import {SearchTypesType} from "../../../../services/system.config/search.types";

export interface SearchSavedServiceInterface {
    httpService: HttpService;
    sessionStorage: SessionStorageService;
    storagePrefix: string;

    /**
     * Get list of saved searches
     * @param searchType
     * @param id
     */
    getListOfSavedSearches(searchType: string, cacheClear: boolean): Observable<SavedSearchList>;

    /**
     * Get item of saved search
     * @param searchType
     * @param id
     */
    getItemOfSavedSearch(searchType: string, id: number, cacheClear: boolean): Observable<AdvancedCriteriaListTypes>;

    /**
     * Save parameters of search to server
     */
    saveSearch(id, name, type, data): Observable<SaveSearchResponse>;

    /**
     * Clear saved searches
     * @param searchType
     */
    clearSavedSearches(searchType: string): void;

    /**
     * Remove saved search by id and searchType
     * @param searchType
     * @param id
     */
    removeSavedSearch(searchType: SearchTypesType, id: number): Observable<SaveSearchResponse>


    /**
     * Get list or item of saved searches
     * @param searchType
     * @param id
     */
    getSavedSearches(searchType: string, id?: number): Observable<Array<any>>;
}
/**
 * Search Settings service
 */
@Injectable()
export class SearchSavedService implements SearchSavedServiceInterface {
    httpService;
    sessionStorage;
    storagePrefix = 'advanced.search.saved.searches.';

    constructor(@Inject(HttpService) _httpService: HttpService,
                @Inject(SessionStorageService) _sessionStorage: SessionStorageService) {
        this.httpService = _httpService;
        this.sessionStorage = _sessionStorage;
    }

    clearSavedSearches(searchType: string): void {
        let namespace = this.storagePrefix + searchType;
        let stored = this.sessionStorage.retrieve(namespace + '.all');
        if (stored && isArray(stored)) {
            stored.forEach((st) => {
                this.sessionStorage.clear(namespace + '.' + st.ID);
            });
        }

        this.sessionStorage.clear(namespace + '.all');
    }

    getListOfSavedSearches(searchType: string, clearCache: boolean = false): Observable<SavedSearchList> {
        let storagePrefix = this.storagePrefix + searchType + '.all';
        let data = this.sessionStorage.retrieve(storagePrefix);
        return Observable.create((observer) => {
                if (!data || clearCache == true) {
                    let url = '/api/view/searches/' + searchType;
                    this.httpService
                        .get(url)
                        .map(res => res.json())
                        .subscribe(
                            (res) => {
                                let _res = JSON.parse(JSON.stringify(res));
                                this.sessionStorage.store(storagePrefix, _res);
                                observer.next(res);
                            },
                            (err) => {
                                observer.error(err);
                            });

                } else {
                    observer.next(data);
                }
            }
        );
    }

    getItemOfSavedSearch(searchType: string, id: number, clearCache: boolean = false): Observable<AdvancedCriteriaListTypes> {
        let storagePrefix = this.storagePrefix + searchType + '.' + id;
        let data = this.sessionStorage.retrieve(storagePrefix);
        return Observable.create((observer) => {
                if (!data || clearCache == true) {
                    let url = '/api/view/search/' + searchType + '/' + id;
                    this.httpService
                        .get(url)
                        .map(res => res.json())
                        .subscribe(
                            (res) => {
                                this.sessionStorage.store(storagePrefix, res);
                                observer.next(res);
                            },
                            (err) => {
                                observer.error(err);
                            });

                } else {
                    observer.next(data);
                }
            }
        );
    }

    removeSavedSearch(searchType: SearchTypesType, id: number): Observable<SaveSearchResponse> {
        return Observable.create((observer) => {
                let url = '/api/view/search/' + searchType + '/' + id;
                this.httpService
                    .remove(url)
                    .map(res => res.json())
                    .subscribe(
                        (res) => {
                            observer.next(res);
                        },
                        (err) => {
                            observer.error(err);
                        });
            }
        );
    }

    getSavedSearches(searchType: string, id: number | string = 'all', clearCache: boolean = false): Observable<Array<any>> {
        let storagePrefix = this.storagePrefix + searchType + '.' + id;
        let data = this.sessionStorage.retrieve(storagePrefix);
        return Observable.create((observer) => {
                if (!data || clearCache == true) {
                    let url = '/api/view/search/' + searchType + '/' + id;
                    if (id == 'all') {
                        url = '/api/view/searches/' + searchType;
                    }
                    this.httpService
                        .get(url)
                        .map(res => res.json())
                        .subscribe(
                            (res) => {
                                this.sessionStorage.store(storagePrefix, res);
                                observer.next(res);
                            },
                            (err) => {
                                observer.error(err);
                            });

                } else {
                    observer.next(data);
                }
            }
        );
    }

    /**
     * Save parametes of search
     * @param id
     * @param name
     * @param type
     * @param data
     * @returns {Observable<R>}
     */
    saveSearch(id = -1, name, type, data): Observable<SaveSearchResponse> {

        let headers = new Headers({'Content-Type': 'application/json'});
        if (id > -1) {
            let storagePrefix = this.storagePrefix + type + '.' + id;
            this.sessionStorage.store(storagePrefix, data)
        }

        return this.httpService
            .post(
                '/api/view/search/' + type + '/' + id + '?name=' + name,
                JSON.stringify(data),
                {headers: headers}
            )
            .map((resp) => {
                return resp.json();
            });
    }
}
