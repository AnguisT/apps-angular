import {Inject, Injectable} from "@angular/core";
import {HttpService} from "../../../../services/http/http.service";
import {Observable} from "rxjs";
import {Response, Headers} from "@angular/http";

/**
 * Info modal
 */
export interface InfoModalServiceInterface {
    httpService: HttpService;
    /**
     *
     * @param viewType
     */
}
/**
 * Save View Modal service
 */
@Injectable()
export class InfoModalService implements InfoModalServiceInterface {
    httpService;
    constructor(@Inject(HttpService) _httpService: HttpService) {
        this.httpService = _httpService;
    }
}