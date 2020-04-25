/**
 * Created by Sergey Trizna on 05.03.2017.
 */
import {Injectable, Inject} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {Response, Headers} from "@angular/http";
import {HttpService} from "../../../../services/http/http.service";

// import {Observable} from "rxjs";
// import {Response} from "@angular/http";

/**
 * Search form service search
 */
export interface SearchFormServiceInterface {
    httpService: HttpService;

    /**
     * Search suggestions
     * @param text
     */
    searchSuggestion(text: string): Observable<Subscription>;
}
/**
 * Search form service
 */
@Injectable()
export class SearchFormService implements SearchFormServiceInterface {
    constructor(@Inject(HttpService) public httpService: HttpService) {
    }

    searchSuggestion(text: string): Observable<Subscription> {
        return Observable.create((observer) => {
            let reqsData = {
                'Text': text
            };

            let headers = new Headers({'Content-Type': 'application/json'});
            this.httpService.post(
                '/api/SearchSuggestion/',
                JSON.stringify(reqsData),
                {headers: headers}
            ).map((res) => {
                return res.json();
            }).subscribe(
                (resp) => {
                    observer.next(resp);
                },
                (error) => {
                    observer.error(error);
                }
            )
        });
    }
}
