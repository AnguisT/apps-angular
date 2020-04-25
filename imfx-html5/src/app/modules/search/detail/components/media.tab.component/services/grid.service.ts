import {Inject, Injectable} from '@angular/core';
import {HttpService} from '../../../../../../services/http/http.service';
import {Headers} from "@angular/http";
import {Observable} from "rxjs";
import {SlickGridService} from "../../../../slick-grid/services/slick.grid.service";

@Injectable()
export class MediaTabGridService extends SlickGridService {
    constructor(@Inject(HttpService) httpService: HttpService) {
        super(httpService);
    }

    getRowsById(id: number): Observable<any> {
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.httpService
            .get(
                '/api/v3/media/related/' + id,
            )
            .map((resp) => {
                return {"Data": resp.json()};
            });
    }
}
