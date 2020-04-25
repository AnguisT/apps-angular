/**
 * Created by Sergey Trizna on 28.12.2016.
 */
import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Response, Headers } from '@angular/http';
import { SimpleSearchResponse } from '../../models/simplified/simple.search.response';

/**
 * Media search service
 */
@Injectable()
export class TableSearchService {
    private extendsFields;
    constructor(public httpService: HttpService) {
    }

    /**
     * Search by parameters
     * @param searchType - search type as part of url
     * @param text - the string for search
     * @param page - page number
     * @param sortField - sort type for fields (asc or desc)
     * @param sortDirection sort type for direction (asc or desc)
     * @param searchCriteria - params from adv search
     * @returns {Observable<Response>}
     */
    search(searchType: string,
           text: string,
           page: number,
           sortField?: string,
           sortDirection?: string,
           searchCriteria?: string|Array<string>) {
        let sortFieldVal = sortField ? sortField : '';
        let sortDirectionVal = sortDirection ? sortDirection : 'desc';
        let critsVal = searchCriteria ? searchCriteria : [];

        let reqsData = {
            'Text': text,
            'Page': page,
            'SortField': sortFieldVal,
            'SortDirection': sortDirectionVal,
            'SearchCriteria': critsVal,
            'ExtendedColumns': this.extendsFields
        };

        // ... Set content type to JSON
        let headers = new Headers({'Content-Type': 'application/json'});

        return this.httpService
            .post(
                '/api/search/' + searchType,
                JSON.stringify(reqsData),
                {headers: headers}
            )
            .map((resp) => {
                return resp.json();
            });
    }

    getTableViews(tableViewType: string) {
        let lang = localStorage.getItem('tmd.base.settings.lang');
        if (lang) {
          lang = lang.replace(/\"/g,"");
        }
        return this.httpService
            .get(
                '/api/view/info/' + tableViewType + '?lang=' + lang
            )
            .map((resp) => {
                return resp.json();
            });
    }

    getTableView(tableViewType: string, id: string) {
        return this.httpService
            .get(
                '/api/view/' + tableViewType + '/' + id
            )
            .map((res) => {
                return res.json();
            });

    }

    setExtendsColumns(columns) {
        this.extendsFields = columns;
    }

    searchSuggestion(text: string) {
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
}
