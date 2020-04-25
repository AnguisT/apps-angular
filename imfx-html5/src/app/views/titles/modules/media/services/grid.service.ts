/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {Inject, Injectable} from "@angular/core";
import {HttpService} from "../../../../../services/http/http.service";
import {Observable} from "rxjs";
import {SlickGridService} from "../../../../../modules/search/slick-grid/services/slick.grid.service";

@Injectable()
export class MediaGridService extends SlickGridService {
    constructor(@Inject(HttpService) httpService: HttpService) {
        super(httpService);
    }

    getRowsById(id: number): Observable<any> {
        // let headers = new Headers({'Content-Type': 'application/json'});

        return this.httpService
            .get(
                '/api/int/version/' + id + '/media',
            )
            .map((resp) => {
                return resp.json();
            });
    }
}
