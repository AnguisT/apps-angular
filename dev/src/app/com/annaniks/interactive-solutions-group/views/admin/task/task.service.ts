import { Injectable } from '@angular/core';
import { ApiService } from '../../../services';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _apiService: ApiService) {}

  saveBoard(data) {
    return this._apiService.put('task', data);
  }

  deleteColumn(id) {
    return this._apiService.delete('task/' + id);
  }

  getBoard(projectId) {
    return this._apiService.get(`task/${projectId}`);
  }
}
