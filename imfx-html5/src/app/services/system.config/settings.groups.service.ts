import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../http/http.service';
import { SessionStorageService } from 'ng2-webstorage';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class SettingsGroupsService {
    private prefixStorageSettingsGroupById = 'settings.group';
    public logoChanged: EventEmitter<any> = new EventEmitter<any>();
    constructor(private http: Http,
                private httpService: HttpService,
                private sessionStorage: SessionStorageService) {

    }

    getSettingsGroupsList() {
        return this.httpService
            .get(
                '/api/settings/group/'
            )
            .map((res) => {
                return res.json();
            });
    }


    delete(id) {
        return this.httpService
            .remove(
                '/api/settings/group/' + id
            )
            .map((res) => {
                return res.json();
            });
    }

    getSettingsGroupById(id: number, disableCache: boolean = false) {
        let storageKey = this.prefixStorageSettingsGroupById + '.' + id;
        let data = this.sessionStorage.retrieve(storageKey);
        return Observable.create((observer) => {
                if (!data || disableCache) {
                    this.httpService
                        .get(
                            '/api/settings/group/' + id
                        )
                        .map((res) => {
                            return res.json();
                        })
                        .subscribe((resp) => {
                            this.sessionStorage.store(storageKey, resp);
                            observer.next(resp);
                        });

                } else {
                    observer.next(data);
                }
            }
        );
    }

    clearSettingsGroupById(id: number){
        this.sessionStorage.clear(this.prefixStorageSettingsGroupById + '.' + id);
    }

    getSettingsUserById(id) {
        return this.httpService
            .get(
                '/api/settings/user/' + id
            )
            .map((res) => {
                return res.json();
            });
    }

    getSearchFields() {
        return this.httpService
            .get(
                '/api/search/search-fields/'
            )
            .map((res) => {
                return res.json();
            });
    }

    getFacets() {
        return this.httpService
            .get(
                '/api/search/facets/'
            )
            .map((res) => {
                return res.json();
            });
    }
    /**
     * Returned list of users by params
     * @returns {any}
     */
    public getFieldsForSimplified(): Observable<Subscription> {
        let storageKey = 'settings.simplified.fields';
        let data = this.sessionStorage.retrieve(storageKey);

        return Observable.create((observer) => {
                if (!data) {
                    // this.httpService.get('/api/lookupsearch/users?search=' + param)
                    this.httpService.get('/api/view/info/ChameleonSearch')
                        .map(res => res.json())
                        .subscribe(
                            (res) => {
                                this.sessionStorage.store(storageKey, res);
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

    saveSettingsGroup(group) {
        let headers = new Headers({'Content-Type': 'application/json'});
        return (group.ID !== undefined
            ? this.httpService.put('/api/settings/group/' + group.ID, group, {headers: headers})
            .map((res) => {
                return res.json();
            })
            : this.httpService.post('/api/settings/group/', group, {headers: headers})
            .map((res) => {
                return res.json();
            })
        );
    }

    saveSessionStorage(id, resp){
        let storageKey = this.prefixStorageSettingsGroupById + '.' + id;
        this.sessionStorage.store(storageKey, resp);
    }
}
