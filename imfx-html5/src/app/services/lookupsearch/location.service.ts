/**
 * Created by Sergey Trizna on 17.01.2017.
 */
import {Injectable} from "@angular/core";
import {HttpService} from "../http/http.service";
import {SessionStorageService} from "ng2-webstorage";
import {Observable} from "rxjs";
import {LocationsListLookupTypes} from "../../modules/search/location/types";
@Injectable()
export class LookupSearchLocationService {
    constructor(private httpService: HttpService,
                private sessionStorage: SessionStorageService) {
    }

    /**
     * Returned list of locations by params
     * @returns {any}
     */
    public getLocations(): Observable<LocationsListLookupTypes> {
        let data: LocationsListLookupTypes = this.sessionStorage.retrieve('lookupsearch.locations');

        return Observable.create((observer) => {
                if (!data) {
                    // this.httpService.get('/api/lookupsearch/users?search=' + param)
                    this.httpService.get('/api/lookupsearch/locations')
                        .map(res => res.json())
                        .subscribe(
                            (res) => {
                                this.sessionStorage.store('lookupsearch.locations', res);
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
        return this.httpService.baseUrl + '/api/lookupsearch/locations';
    }
}
