/**
 * Created by Sergey Trizna on 19.03.2018.
 */
import {CoreService} from "../../../../../../core/core.service";
import {Inject, Injectable} from "@angular/core";
import {HttpService} from "../../../../../../services/http/http.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AudioTracksService extends CoreService {
    constructor(@Inject(HttpService) _httpService: HttpService) {
        super(_httpService);
        // debugger
    }

    getAudioTracks(id): Observable<Array<any>> {
        return this.httpService.get('/api/v3/media/related/'+id+'/audio').map((res) => {
            return res.json();
        });
        //
    }
}