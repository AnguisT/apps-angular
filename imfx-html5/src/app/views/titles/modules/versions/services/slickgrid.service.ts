/**
 * Created by Sergey Trizna on 23.01.2018.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SlickGridService} from "../../../../../modules/search/slick-grid/services/slick.grid.service";

@Injectable()
export class TitlesSlickGridService extends SlickGridService {
    getRowsByIdTitlesToVerions(id: number): Observable<Response> {
        // let headers = new Headers({'Content-Type': 'application/json'});

        return this.httpService
            .get(
                '/api/int/title/' + id + '/versions'
            )
            .map((resp) => {
                return resp.json();
            });
    }

    getRowsByIdVersionsToMedia(id: number): Observable<Response> {
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
