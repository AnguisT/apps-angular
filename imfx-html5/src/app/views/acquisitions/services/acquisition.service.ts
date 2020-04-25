import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Headers} from "@angular/http";
import {HttpService} from "../../../services/http/http.service";

/**
 * Media basket service
 */
@Injectable()
export class AcquisitionService {

  constructor(private httpService: HttpService) {
  }

  getData(searchString) {
    return this.httpService
      .post(
        '/api/search/acq',
        searchString
      )
      .map((res) => {
        return res.json();
      });
  }

  getDetail(id) {
    return this.httpService
      .get(
        '/api/v3/acq/' + id
      )
      .map((res) => {
        return res.json();
      });
  }
}
