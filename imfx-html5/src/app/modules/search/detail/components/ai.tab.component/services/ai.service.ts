import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Response, Headers } from "@angular/http";
import {HttpService} from "../../../../../../services/http/http.service";

@Injectable()
export class AiTabService {
  constructor(private httpService: HttpService) {
  }

  getAiData(id): Observable<Response> {
    return this.httpService.get('/api/v3/ai-tags/' + id)
      .map((res) => {
        return res.json();
      });
  };
}
