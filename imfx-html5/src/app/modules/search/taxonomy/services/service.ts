/**
 * Created by Sergey Trizna on 22.11.2017.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SessionStorageService} from "ng2-webstorage";
import {HttpService} from "../../../../services/http/http.service";
import {TaxonomyType} from "../types";

@Injectable()
export class TaxonomyService {
    constructor(private httpService: HttpService,
                private sessionStorage: SessionStorageService) {
    }

    getTaxonomy(): Observable<Array<TaxonomyType>> {
        let key = 'taxonomy';
        let data = this.sessionStorage.retrieve(key);
        return Observable.create((observer) => {
            if (!data) {
                return this.httpService
                    .get(
                        '/api/taxonomy'
                    )
                    .map((res) => {
                        return res.json();
                    })
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
        });
    };

    getLowerLevelValuesOfTaxonomy(taxonomy): Array<TaxonomyType> {
        let res = [];
        if (taxonomy && taxonomy[0] && taxonomy[0].Children) {
            res = this.searchInNextLevel(taxonomy[0].Children, res);
        }

        return res;
    }

    searchInNextLevel(childs, res): Array<TaxonomyType> {
        $.each(childs, (i, child) => {
            if (child.Children && child.Children.length > 0) {
                this.searchInNextLevel(child.Children, res)
            } else {
                res.push(child);
            }
        });

        return res;
    }
}
