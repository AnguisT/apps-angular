/**
 * Created by initr on 16.12.2016.
 */
import {Injectable} from '@angular/core';
import {HttpService} from '../http/http.service';
import {SessionStorageService} from 'ng2-webstorage';
import {Observable} from 'rxjs';
import {UsersListLookupTypes} from "./types";
@Injectable()
export class LookupSearchUsersService {
    constructor(private httpService: HttpService,
                private sessionStorage: SessionStorageService) {
    }

    /**
     * Returned list of users by params
     * @returns {any}
     */
    public getUsers(): Observable<UsersListLookupTypes> {
        let data:UsersListLookupTypes = this.sessionStorage.retrieve('lookupsearch.users');

        return Observable.create((observer) => {
                if (!data) {
                    // this.httpService.get('/api/lookupsearch/users?search=' + param)
                    this.httpService.get('/api/lookupsearch/users')
                        .map(res => res.json())
                        .subscribe(
                            (res) => {
                                this.sessionStorage.store('lookupsearch.users', res);
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

    public getUrl() {
        // /api/lookupsearch/users?search=...
        return this.httpService.baseUrl +  '/api/lookupsearch/users';
    }
}
