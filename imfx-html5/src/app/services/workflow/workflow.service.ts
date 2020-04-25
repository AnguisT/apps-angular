/**
 * Created by Pavel on 27.03.2017.
 */
import {Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {Headers} from "@angular/http";

/**
 * Workflow service
 */
@Injectable()
export class WorkflowService {

  constructor(private httpService: HttpService) {

  }

  getWorkflowDetails (id) {
    return this.httpService
      .get(
        '/api/job/' + id
      )
      .map((res) => {
        return res.json();
      });
  }
  getWorkflowTaskDetails (id) {
    return this.httpService
      .get(
        '/api/priority/' + id + '/history'
      )
      .map((res) => {
        return res.json();
      });
  }

  getSampleWorkflowDetails () {
    return this.httpService
      .get(
        '/api/job/132257'
      )
      .map((res) => {
        return res.json();
      });
  }

}
