import {Injectable} from "@angular/core";
import { Http, Headers } from '@angular/http';
import {HttpService} from "../../../../services/http/http.service";
import {Observable} from "rxjs/Observable";
@Injectable()
export class TasksControlButtonsService {
    constructor(private http: Http, private httpService: HttpService) {
    }
    public saveTaskStatus(id: number, status: string): Observable<any> {
        let headers = new Headers({'Content-Type': 'application/json'});
        return Observable.create((observer) => {
            this.httpService.put(
                '/api/v3/task/status/' + id + '/' + status,
                '',
                {headers: headers})
                .map(res => res.json())
                .subscribe(
                    (res) => {
                        observer.next(res);
                    },
                    (err) => {
                        observer.error(err);
                    });
        });
    }
}
