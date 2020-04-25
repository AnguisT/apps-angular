/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {Inject, Injectable} from '@angular/core';
import {GridService} from '../../../../../modules/search/grid/services/grid.service';
import {HttpService} from '../../../../../services/http/http.service';
import {Headers, Response} from '@angular/http';
import {Observable} from "rxjs";

@Injectable()
export class VersionsGridService extends GridService {
    constructor(@Inject(HttpService) httpService: HttpService) {
        super(httpService);
    }

    getRowsById(id: number): Observable<Response> {
        let headers = new Headers({'Content-Type': 'application/json'});

        return this.httpService
            .get(
                '/api/int/title/' + id + '/versions',
            )
            .map((resp) => {
                return resp.json();
            });
    }
}
