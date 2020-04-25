import {Inject, Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Headers, Response, ResponseContentType} from "@angular/http";
import {HttpService} from "../../../../../services/http/http.service";
@Injectable()
export class MediaWizardService {
    httpService;

    constructor(@Inject(HttpService) _httpService: HttpService) {
        this.httpService = _httpService;
    }
}
