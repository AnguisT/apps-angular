/**
 * Created by Sergey Trizna on 23.03.2017.
 */
import {Inject, Injectable} from '@angular/core';
import {HttpService} from '../../../services/http/http.service';
import {Observable} from "rxjs";
import {Response, Headers} from "@angular/http";
/**
 * Interface for accordion of grid
 */
export interface AccordionServiceInterface {
    httpService: HttpService;
    getMediaData(id:string): Observable<Response>
}
/**
 * Service for accordion of grid
 */
@Injectable()
export class AccordionService implements AccordionServiceInterface {
    httpService;
    constructor(@Inject(HttpService) _httpService: HttpService) {
        this.httpService = _httpService;
    }
    getMediaData(id:string): Observable<Response> {
        return this.httpService.get('/api/misr/' + id + '/media' )
                .map((resp) => {
                    return resp.json();
                })
    }
}
