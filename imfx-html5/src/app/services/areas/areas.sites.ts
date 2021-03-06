/**
 * Created by Sergey Trizna on 21.02.2018.
 */
/**
 * Created by Sergey Trizna on 21.02.2018.
 */

import {SessionStorageService} from "ng2-webstorage/dist/services";
import {HttpService} from "../http/http.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AreasSitesService {
    constructor(private httpService: HttpService,
                private sessionStorage: SessionStorageService) {
    }

    getAreas(val: string) {
        let key = 'areas.sites.' + val;
        let data: any = this.sessionStorage.retrieve(key);

        return Observable.create((observer) => {
                if (!data) {
                    this.httpService.get('/areas/sites/' + val)
                        .map(res => res.json())
                        .subscribe(
                            (res) => {
                                this.sessionStorage.store(key, res);
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
}