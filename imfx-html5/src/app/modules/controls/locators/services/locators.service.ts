import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Response, Headers } from "@angular/http";
import { HttpService } from '../../../../services/http/http.service';

@Injectable()
export class LocatorsService {
  constructor(private httpService: HttpService) {
  }
  getDetailMediaTagging(id): Observable<Response> {
    return this.httpService.get('/api/media-tagging/' + id)
      .map((res) => {
        return res.json();
      });
  };
  saveMediaTagging(options, id): Observable<Response> {
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.httpService
      .post(
        '/api/media-tagging/save/' + id,
        JSON.stringify(options),
        {headers: headers}
      )
      .map((res) => {
        return res.json();
      });
  }
}
