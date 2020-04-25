/**
 * Created by Sergey Trizna on 22.02.2018.
 */

import {SessionStorageService} from "ng2-webstorage/dist/services";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpService} from "../../../services/http/http.service";
import {Headers} from "@angular/http";
import {WorkflowChangePriorityModel} from "../comps/wizards/priority/types";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class JobService {
    constructor(private httpService: HttpService,
                private sessionStorage: SessionStorageService) {
    }

    public assign(id: number, type: string, jobs: any[] = [], action: 'pass' | 'share' | 'passclear', route:'tasks'|'jobs'): Observable<Subscription> {
        let reqsData = {
            jobs: jobs,
            assignTo: {type, id},
            action: action
        };

        return Observable.create((observer) => {
            let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
            return this.httpService
                .post(
                    '/api/v3/'+route+'/assign',
                    JSON.stringify(reqsData),
                    {headers: headers},
                    {},
                    false
                )
                .map((resp) => {
                    return resp.json();
                })
                .subscribe(
                    (resp) => {
                        observer.next(resp);
                    },
                    (err) => {
                        observer.error(err);
                    },
                    () => {
                        observer.complete();
                    }
                );
        });
    }

    changePriority(model: WorkflowChangePriorityModel): Observable<Subscription> {
        return Observable.create((observer) => {
            let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
            return this.httpService
                .post(
                    '/api/v3/jobs/priority',
                    JSON.stringify(model),
                    {headers: headers},
                    {},
                    false
                ).map((resp) => {
                    return resp.json();
                }).subscribe(
                    (resp) => {
                        observer.next(resp);
                    },
                    (err) => {
                        observer.error(err);
                    },
                    () => {
                        observer.complete();
                    }
                );
        });
    }
}