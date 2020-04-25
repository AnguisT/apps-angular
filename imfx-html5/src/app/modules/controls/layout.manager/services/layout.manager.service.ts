import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Response, Headers } from "@angular/http";
import { HttpService } from '../../../../services/http/http.service';
import {LayoutManagerModel, LayoutType} from "../models/layout.manager.model";

@Injectable()
export class LayoutManagerService {
  constructor(private httpService: HttpService) {
  }

  getLayouts(typeId: LayoutType): Observable<Response> {
    return this.httpService.get('/api/v3/layouts/' + typeId)
      .map((res) => {
        return res;
      });
  };

  getLayout(id): Observable<Response> {
    return this.httpService.get('/api/v3/layout/' + id)
      .map((res) => {
        return res.json();
      });
  };

  getDefaultLayout(typeId: LayoutType): Observable<Response> {
    return this.httpService.get('/api/v3/layout/default/' + typeId)
      .map((res) => {
        return res.json();
      });
  };

  deleteLayout(id): Observable<Response> {
    return this.httpService.remove('/api/v3/layout/' + id)
      .map((res) => {
        return res.json();
      });
  }

  saveLayout(model: LayoutManagerModel): Observable<Response> {
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.httpService
      .post(
        '/api/v3/layout/' + model.Id,
        JSON.stringify(model),
        {headers: headers}
      )
      .map((res) => {
        return res.json();
      });
  }
}
