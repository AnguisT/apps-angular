/**
 * Created by Sergey Trizna on 14.06.2017.
 */
import {Inject, Injectable} from "@angular/core";
import {SessionStorageService} from "ng2-webstorage";
import {HttpService} from "../http/http.service";
import {Observable, Subscription} from "rxjs";
import {Headers} from "@angular/http";
// let hash = require('object-hash');
// let hashed = hash(data);
// let keyAndHash = key+'.'+hashed;
@Injectable()
export class ServerStorageService {
    private httpService;
    private storagePrefix = 'config.user.preferences';

    constructor(@Inject(HttpService) _httpService: HttpService,
                @Inject(SessionStorageService) protected storageService: SessionStorageService) {
        this.httpService = _httpService;
    }

    keys(cacheClear: boolean = false): Observable<Subscription> {
        let data;
        return Observable.create((observer) => {
            if (cacheClear) {
                this._fetchKeys().subscribe((resp) => {
                    observer.next(resp);
                });
            } else {
                data = this.storageService.retrieve(this.storagePrefix);
                if (!data) {
                    this._fetchKeys().subscribe((data) => {
                        observer.next(data);
                    });
                } else {
                    observer.next(data);
                }
            }
        });
    }

    retrieve(keys?: Array<number | string>, cacheClear: boolean = false, max = 0): Observable<Subscription> {
        let self = this;
        return Observable.create((observer) => {
            if (cacheClear) {
                self._fetchKeys(keys).subscribe((resp) => {
                    observer.next(resp);
                });
            } else {
                let response = {};
                let checkExist = true;
                $.each(keys, (i, k) => {
                    if (max > 0 && i > max - 1) {
                        return false;
                    }
                    response[k] = self.storageService.retrieve(self.storagePrefix + '.' + k);
                    if (!response[k]) {
                        checkExist = false;
                    }
                });
                //TODO add check, if key not exist in store try get from server
                if (!checkExist) {
                    self._fetchKeys(keys).subscribe((resp) => {
                        observer.next(resp);
                    });
                } else {
                    observer.next(response);
                }
            }
        });
    }

    clear(key: string | number): Observable<Subscription> {
        return Observable.create((observer) => {
            this.store(key, null).subscribe(() => {
                observer.next(true)
            })
        });
    }

    store(key: string | number | Array<string | number>, data: any): Observable<Subscription> {
        let self = this;
        return Observable.create((observer) => {
            let headers = new Headers({'Content-Type': 'application/json'});
            self.httpService
                .post(
                    '/api/user-preferences',
                    [{Key: key, Value: JSON.stringify(data)}],
                    {headers: headers}
                )
                .map((response) => {
                    return response;
                })
                .subscribe(
                    (res) => {
                        self.storageService.store(self.storagePrefix + '.' + key, data);
                        observer.next(data);
                    }, (err) => {
                        observer.error()
                    });
        });
    }

    add(key: string | number, data, max = 0): Observable<Subscription> {
        return Observable.create((observer) => {
            this.retrieve([key], true).subscribe((exists) => {
                let newValue = (exists[0] && exists[0].Value) ? JSON.parse(exists[0].Value) : [];
                if (max > 0 && (newValue.length + 1) > max) {
                    newValue = newValue.slice((max - 1) * (-1))
                }
                newValue.push(data);
                this.store(key, newValue).subscribe(() => {
                    observer.next(newValue);
                });
            });
        });

    }

    private _fetchKeys(keys?: Array<number | string>): Observable<Subscription> {
        let self = this;
        return Observable.create((observer) => {
            let uri = keys && keys.length > 0 ? '/api/user-preferences?keys=' + keys.join(',') : '/api/user-preferences/all';
            self.httpService
                .get(uri)
                .map((response) => {
                    return response.json()
                })
                .subscribe(
                    (data) => {
                        $.each(data, (i, k) => {
                            self.storageService.store(self.storagePrefix + "." + k.Key, k.Value);
                        });
                        observer.next(data);
                    }, (error) => {
                        observer.error(error);
                    })
        });
    }
}
