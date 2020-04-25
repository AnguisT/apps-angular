/**
 * Created by Sergey Trizna on 25.05.2017.
 */
import {Injectable} from "@angular/core";
import {HttpService} from "../http/http.service";
import {Headers, ResponseContentType} from "@angular/http";
import {Observable} from "rxjs";
/**
 * Report service
 */
@Injectable()
export class ReportService {
    public moduleContext;

    constructor(private httpService: HttpService) {

    }

    public getListOfReports() {
        return this.httpService
            .get('/api/get-reportings/1')
            .map((listOfReports) => {
                return listOfReports.json()
            });
    }

    public getParamsByReport(id) {
        return this.httpService.get('/api/reporting-params/' + id)
            .map((paramsForReport) => {
                return paramsForReport.json()
            });
    }

    public generateReport(id, params) {
        let _params = JSON.stringify(params);
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.httpService.post('/api/generate-reporting/' + id, _params, {headers: headers})
            .map((resp) => {
                return resp.json()
            });
    }

    public getReportByGUID(guid): any {
        return Observable.create((observer) => {
            return this.httpService.get('/api/get-reporting/' + guid, {responseType: ResponseContentType.Blob}).subscribe(
                (report: any) => {
                    let fr = new FileReader();
                    let self = this;
                    fr.onload = function () {
                        if (this.result == "false") {
                            self.moduleContext.tryGetReport(guid);
                        } else {
                            try {
                                let err = JSON.parse(this.result);
                                observer.error(err);
                            } catch (e) {
                                observer.next(report);
                            }
                            observer.complete()
                        }
                    };
                    fr.readAsText(report._body);
                },
                (err) => {
                    observer.error(err);
                    observer.complete();
                });
        });
        // return Observable
        //     .interval(5000)
        //     .flatMap(() => {
        //         return this.httpService.get('api/get-reporting/' + guid);
        //     });
    }

    pri
}
