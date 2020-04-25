/**
 * Created by Sergey Trizna on 10.10.2017.
 */
import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Headers, Response, ResponseContentType } from '@angular/http';

@Injectable()
export class ExportService {
    httpService;

    constructor(_httpService: HttpService) {
        this.httpService = _httpService;
    }

    getExportData(data): Observable<Blob> {
        return Observable.create((observer) => {
            let headers = new Headers({'Content-Type': 'application/json'});
            this.httpService.post(
                '/api/v3/search/export',
                JSON.stringify(data),
                {
                    headers: headers,
                    responseType: ResponseContentType.Blob
                })
                .map(response => (<Response>response).blob())
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
}
