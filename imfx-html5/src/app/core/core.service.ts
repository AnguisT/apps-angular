/**
 * Created by Sergey Trizna on 27.11.2017.
 */
import {HttpService} from "../services/http/http.service";
import {Inject} from "@angular/core";
import {SessionStorageService} from "ng2-webstorage";
export class CoreService {
    protected httpService: HttpService;
    // protected sessionStorage: SessionStorageService;
    constructor(/*@Inject(HttpService)*/ _httpService: HttpService/*, _sessionStorage?: SessionStorageService*/) {
        this.httpService = _httpService;
        // this.sessionStorage = _sessionStorage;
    }
}
