/**
 * Created by Sergey Trizna on 04.03.2017.
 */
import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http/http.service';
import { Observable } from 'rxjs';
import { Headers, Response } from '@angular/http';
import { SearchModel } from '../models/search/search';
import { SimpleSearchResponse } from '../../../../models/simplified/simple.search.response';
import { AllSearchResponse } from '../../../../models/search/search.response';
import {CoreService} from "../../../../core/core.service";
import {FinalSearchRequestType} from "../types";

/**
 * Interface for grid search
 */
export interface GridServiceInterface {
    extendedColumns: Array<string>;
    httpService: HttpService;
    /**
     * Search by parameters
     * @param searchType
     * @param text
     * @param page
     * @param sortField
     * @param sortDirection
     * @param searchCriteria
     */
    search(searchType: string,
           searchModel: SearchModel,
           page: number,
           sortField?: string,
           sortDirection?: string): Observable<AllSearchResponse>;

    /**
     * Suggestion of search
     * @param text
     */
    searchSuggestion(text: string): Observable<Response>;

    /**
     * Simolified search
     * @param options
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
    }): Observable<SimpleSearchResponse>;

    /**
     *
     * @param extendedColumns
     */
    setExtendsColumns(extendedColumns): void;

    getParamsForSearch(searchModel: SearchModel, page, sortFieldVal, sortDirectionVal): any;
}
/**
 * Grid search service
 */
@Injectable()
export class GridService  extends CoreService implements GridServiceInterface {
    extendedColumns;
    httpService;
    constructor(_httpService: HttpService) {
        super(_httpService);
        // this.httpService = _httpService;
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
           sortDirection?: string): Observable<AllSearchResponse> {
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
            // return this.httpService
            //     .post(
            //         '/api/search/' + searchType,
            //         JSON.stringify(reqsData),
            //         {headers: headers}
            //     )
            //     .map((resp) => {
            //         /*debugger*/
            //         return resp.json();
            //     }, (resp) => {
            //         /*debugger*/
            //     }, (err) => {
            //         /*debugger*/
            //     });
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
                    (complete) => {
                        observer.complete();
                    }
                );
        });
    }

    getParamsForSearch(
        searchModel: SearchModel,
        page, sortFieldVal,
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
    }): Observable<SimpleSearchResponse> {
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
