import {Injectable, Inject} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {Response, Headers} from "@angular/http";
import {HttpService} from "../../../../services/http/http.service";

/**
 * Interface for Charts
 */
export interface ChartServiceInterface {
    httpService: HttpService;

    getMediaData(id:string): Observable<Subscription>;
    getChartData(params): Observable<Subscription>;
  /*
   DELETE
   DELETE
   DELETE
   DELETE
   */
    getReportings(): Observable<Subscription>;
    generateReporting(): Observable<Subscription>;
    getReportingParams(): Observable<Subscription>;
    getGeneratedReporting(guid): Observable<Subscription>;

  /*
   DELETE
   DELETE
   DELETE
   DELETE
   */
}
/**
 * Charts service
 */
@Injectable()
export class ChartService implements ChartServiceInterface {
    httpService;
    constructor(@Inject(HttpService) _httpService: HttpService) {
        this.httpService = _httpService;
    }
    getMediaData(id:string): Observable<Subscription> {
        return Observable.create((observer) => {
            this.httpService
                .get(
                '/api/misr/' + id + '/media'
            )
                .map((resp) => {
                return resp.json();
            }).subscribe(
                (resp) => {
                    observer.next(resp);
                },
                (error) => {
                    observer.error(error);
                }
            );
        });
    }

    getChartData(params): Observable<Subscription> {
        return Observable.create((observer) => {
            var searchStr = '';
            var amp = '';
            var search = '';
            if(params) {
                if(params.channel || params.form){
                    search = '?';
                }
                if(params.channel && params.form){
                    amp = '&';
                }
                searchStr = "" + search + (params.channel ?'channel='+ params.channel : '') + amp + (params.form ? 'form=' + params.form : '');// + '&_='+new Date().getTime();
            }
            console.log(searchStr);
            this.httpService
                .get(
                    '/api/misr/chart' + searchStr
                )
                .map((resp) => {
                    return resp.json();
                }).subscribe(
                    (resp) => {
                        observer.next(resp);
                    },
                    (error) => {
                        observer.error(error);
                    }
                );
        });
    }
  /*
   DELETE
   DELETE
   DELETE
   DELETE
   */
    getReportings(): Observable<Subscription>  {
      return this.httpService
        .get(
          '/api/get-reportings/1'
        )
        .map((resp) => {
          return resp.json();
        });
    }

    getReportingParams(): Observable<Subscription>  {
      return this.httpService
        .get(
          '/api/reporting-params/180'
        )
        .map((resp) => {
          return resp.json();
        });
    }



    generateReporting(): Observable<Subscription>  {
      let headers = new Headers({'Content-Type': 'application/json'});
      return this.httpService
        .post(
          '/api/generate-reporting/179',
          JSON.stringify(""),
          {headers: headers}
        )
        .map((resp) => {
          return resp.json();
        });
    }

    getGeneratedReporting(guid): Observable<Subscription>  {
      return this.httpService
        .get(
          '/api/get-reporting/' + guid
        )
        .map((resp) => {
          return resp;
        });
    }
  /*
   DELETE
   DELETE
   DELETE
   DELETE
   */
}
