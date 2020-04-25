import {Injectable} from '@angular/core';
import {HttpService} from "../../../services/http/http.service";
import { Headers, Response } from '@angular/http';

/**
 * Media basket service
 */
@Injectable()
export class NamesService {

    constructor(private httpService: HttpService) {
    }

    getData(data) {
        let req = {"Text": data, "Page": "1"};
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.httpService
            .post(
                '/api/search/names',
                JSON.stringify(req),
                {headers: headers}
            )
            .map((res) => {
                return res.json();
            });
    }

    addName(data) {
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.httpService
            .post(
                '/api/v3/name',
                JSON.stringify(data),
                {headers: headers}
            )
            .map((res) => {
                return res.json();
            });
    }

    editName(data, id) {
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.httpService
            .put(
                '/api/v3/name/' + id,
                JSON.stringify(data),
                {headers: headers}
            )
            .map((res) => {
                return res.json();
            });
    }

    getDetail(id) {
        return this.httpService
            .get(
                '/api/v3/name/' + id
            )
            .map((res) => {
                return res.json();
            });
    }
}
