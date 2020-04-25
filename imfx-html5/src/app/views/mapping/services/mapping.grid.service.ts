import { Inject, Injectable } from '@angular/core';
import { GridService } from '../../../modules/search/grid/services/grid.service';
import { HttpService } from '../../../services/http/http.service';
import { Observable } from "rxjs/Observable";
import { Headers, ResponseContentType } from "@angular/http";

@Injectable()
export class MappingGridService extends GridService {
  constructor(@Inject(HttpService) httpService: HttpService) {
    super(httpService);
  }

  bindMediaToVersion(verId: number, midIds: number[]): Observable<any> {
    return Observable.create((observer) => {
      let headers = new Headers({'Content-Type': 'application/json'});
      this.httpService.post(
        '/api/v3/version/' + verId + '/attach-media',
        JSON.stringify(midIds),
        {
          headers: headers,
          responseType: ResponseContentType.Json
        })
        .map(response => (<Response>response).json())
        .subscribe(
          (resp) => {
            observer.next(resp);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  unbindMedia(midId: number) {
    return Observable.create((observer) => {
      let headers = new Headers({'Content-Type': 'application/json'});
      this.httpService.post(
        '/api/v3/media/' + midId + '/unattach',
        {},
        {
          headers: headers,
          responseType: ResponseContentType.Json
        })
        .map(response => (<Response>response).json())
        .subscribe(
          (resp) => {
            observer.next(resp);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
    // api/v3/media/{id}/unattach
  }
}
