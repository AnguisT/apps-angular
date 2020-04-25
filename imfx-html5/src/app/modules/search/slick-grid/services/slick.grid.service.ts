/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http/http.service';
import { Observable } from 'rxjs/Observable';
import { SearchModel } from '../../grid/models/search/search';
import { FinalSearchRequestType } from '../../grid/types';
import { Headers, Response } from '@angular/http';
import { CoreService } from '../../../../core/core.service';

/**
 * Grid search service
 */
@Injectable()
export class SlickGridService extends CoreService {
    protected extendedColumns: Array<any>;

    constructor(@Inject(HttpService) _httpService: HttpService) {
        super(_httpService);
        // debugger
    }

    /**
     * Search by parameters
     * @param searchType - search type as part of url
     * @param searchModel - model with data for search
     * @param page - page number
     * @param sortField - sort type for fields (asc or desc)
     * @param sortDirection sort type for direction (asc or desc)
     * @returns {Observable<Response>}
     */
    search(searchType: string,
           searchModel: SearchModel,
           page: number,
           sortField?: string,
           sortDirection?: string): Observable<Response> {
        return Observable.create((observer) => {
            let sortFieldVal = sortField ? sortField : '';
            let sortDirectionVal = sortDirection ? sortDirection : 'desc';
            // let critsVal = searchCriteria ? searchCriteria : [];
            let reqsData = this.getParamsForSearch(
                searchModel,
                page,
                sortFieldVal,
                sortDirectionVal
            );

            // ... Set content type to JSON
            let headers = new Headers({'Content-Type': 'application/json'});

            return this.httpService
                .post(
                    '/api/search/' + searchType,
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

    getParamsForSearch(
        searchModel: SearchModel,
        page,
        sortFieldVal,
        sortDirectionVal
    ): FinalSearchRequestType {
        return {
            'Text': searchModel.baseToRequest(),
            'Page': page,
            'SortField': sortFieldVal,
            'SortDirection': sortDirectionVal,
            'SearchCriteria': searchModel.advancedToRequest(),
            'ExtendedColumns': this.extendedColumns
        };
    }

    /**
     *
     * @param text
     * @returns {Observable<Response>}
     */
    searchSuggestion(text: string): Observable<Response> {
        let reqsData = {
            'Text': text
        };

        let headers = new Headers({'Content-Type': 'application/json'});
        return this.httpService
            .post(
                '/api/SearchSuggestion/',
                JSON.stringify(reqsData),
                {headers: headers}
            )
            .map((res) => {
                return res.json();
            });
    }

    /**
     *
     * @param options
     * @returns {Observable<Response>}
     */
    doSimplifiedSearch(options: {
        SearchCriteria?: {
            FieldId: string
            Operation: string
            Value: string
        }[],
        SortField?: any,
        Text?: string,
        Page?: number
    }): Observable<Response> {
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.httpService
            .post(
                '/api/unifiedsearch/',
                JSON.stringify(options),
                {headers: headers}
            )
            .map((res) => {
                return res.json();
            });
    }

    /**
     *
     * @param columns
     */
    setExtendsColumns(extendedColumns): void {
        this.extendedColumns = extendedColumns;
    }
}
