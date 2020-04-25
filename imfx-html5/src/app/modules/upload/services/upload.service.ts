/**
 * Created by Sergey Trizna on 28.06.2017.
 */
import {Injectable, Inject} from "@angular/core";
import {HttpService} from "../../../services/http/http.service";
import {Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import {ConfigService} from "../../../services/config/config.service";
import {UploadProvider} from "../providers/upload.provider";
// import 'blob-polyfill/Blob';
// import {FormData} from 'formdata-polyfill';
var FormData = require('formdata-polyfill');
/**
 * Upload service
 */
@Injectable()
export class UploadService {

    public providerContext: UploadProvider;
    private httpService;
    // public percentValue: number = 0;
    constructor(@Inject(HttpService) _httpService: HttpService) {
        this.httpService = _httpService;
    }

    upload(data): Observable<Response> {
        return Observable.create((observer) => {
            let headers = new Headers();
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'multipart/form-data');
            headers.set('Accept', 'application/json');
            /*debugger*/;
            let d = {};
            let base64js = require('base64-js');
            d['fileToUpload'] = base64js.fromByteArray(data);
            // if (data.forEach) {
            //     data.forEach(function (e, k) {
            //         if (k === 'fileToUpload') {
            //             d[k] = base64js.fromByteArray(e);
            //             /*debugger*/;
            //             // d[k] = btoa(e);
            //         } else {
            //             d[k] = e
            //         }
            //     });
            // } else {
            //     d = data;
            // }


            // let iterator = data.keys();
            // iterator.forEach(function (d, k) {
            //     /*debugger*/;
            // })
            // for (let key of data.keys()) {
            //     /*debugger*/;
            //     d[key] = data.getAll(key);
            //     console.log(key, d[key]);
            // }

            /*debugger*/;
            this.httpService.post('/api/upload/chunk', JSON.stringify(d), {headers: headers})
                .map(res => res.json())
                .subscribe(
                    (data) => {
                        console.log(data);
                        /*debugger*/
                        observer.next(data);

                    },
                    (error) => {
                        console.log(error);
                        /*debugger*/;
                        observer.error(error);
                    })

        });
    }

    uploadUseAJAX(data: any): Observable<Response> {
        let self = this;
        return Observable.create((observer) => {
            let xhr = $.ajaxSettings.xhr();
            $.ajax({
                url: ConfigService.getAppApiUrl() + '/api/upload/file',
                type: 'POST',
                data: data._asNative(),
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: (request) => {
                    request.setRequestHeader("Accept", 'application/vnd.tmd.mediaflex.api+json;version=1');
                    request.setRequestHeader('Authorization', 'Bearer ' + this.httpService.getAccessToken());
                    request.setRequestHeader("Cache-Control", "no-cache");
                    request.setRequestHeader("Cache-Control", "no-store");
                    request.setRequestHeader("Pragma", "no-cache");
                },
                xhr: (e) => {
                    /*debugger*/
                    //Upload progress
                    xhr.upload.addEventListener("progress", function(evt){
                        if (evt.lengthComputable) {
                            self.providerContext.queueFiles[self.providerContext.getQueueId()].percentValue = evt.loaded / evt.total
                        }
                    }, false);
                    return xhr;
                }
            }).done((result) => {
                observer.next(result);
                //API call succeeded
            }).fail((xhr, status, error) => {
                observer.error({xhr: xhr, status: status, error: error});
            });

            // for test
            // setTimeout(()=> {
            //     observer.next('test');
            // }, 3000)
        })
    }
}
